// Abra um post ainda salvo no Instagram e execute este arquivo no console.
(async () => {
  if (window.unsaveRunning) {
    console.warn('Já existe uma execução em andamento.');
    return;
  }

  // Use 5 para testar ou Infinity para continuar até uma condição de parada.
  const LIMIT = Infinity;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const visible = el => el.getClientRects().length > 0;
  const scope = () =>
    [...document.querySelectorAll('[role="dialog"]')].find(visible)
    || document;

  window.unsaveRunning = true;
  window.stopUnsave = false;
  let removed = 0;

  const waitFor = async (check, timeout = 7000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline && !window.stopUnsave) {
      const result = check();
      if (result) return result;
      await delay(200);
    }
    return null;
  };

  try {
    while (removed < LIMIT && !window.stopUnsave) {
      const icon = await waitFor(() => {
        const matches = [
          ...scope().querySelectorAll('svg[aria-label="Remove"]')
        ].filter(visible);
        return matches.length === 1 ? matches[0] : null;
      });

      if (!icon) {
        console.warn('Não encontrei um único botão de remover. Parando.');
        break;
      }

      const button = icon.closest('button, [role="button"]');
      if (!button || window.stopUnsave) break;
      button.click();

      const changed = await waitFor(() =>
        ![...scope().querySelectorAll('svg[aria-label="Remove"]')]
          .some(visible)
      );

      if (!changed) {
        console.warn('Não consegui confirmar a mudança do ícone. Parando.');
        break;
      }

      removed++;
      console.log(`Remoções indicadas pela interface: ${removed}/${LIMIT}`);

      await delay(1800);
      if (removed >= LIMIT || window.stopUnsave) break;

      const nextButtons = [
        ...document.querySelectorAll('button._abl-')
      ].filter(button =>
        visible(button) &&
        !button.disabled &&
        button.querySelector('svg[aria-label="Next"]')
      );

      if (nextButtons.length !== 1) {
        console.warn('Seta ausente ou ambígua. Parando.');
        break;
      }

      nextButtons[0].click();
      await delay(2000);
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    window.unsaveRunning = false;
    console.log(`Finalizado: ${removed} remoções indicadas pela interface.`);
  }
})();
