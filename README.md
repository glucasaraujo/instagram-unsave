# Instagram Unsave

Script JavaScript para remover publicações dos Salvos do Instagram pela interface do navegador. Sem instalação ou dependências.

## Como usar

1. Acesse o Instagram no navegador do computador e abra a área de Salvos.
2. Abra um post que ainda esteja salvo.
3. Abra as ferramentas de desenvolvedor (`F12`) e selecione o Console.
4. Copie o conteúdo de `unsave.js`, confira o código e execute no console.
5. Acompanhe as mensagens e confira os resultados na lista de Salvos ao terminar.

O padrão é `const LIMIT = Infinity`: continua até uma condição de parada. Para testar em um lote pequeno, altere para `const LIMIT = 5` antes de executar.

## Interromper

Execute no console:

```javascript
window.stopUnsave = true;
```

A parada é cooperativa: um clique já executado não é cancelado e uma pausa em andamento precisa terminar. Recarregar a página também interrompe a execução.

Para acompanhar se há uma execução ativa:

```javascript
window.unsaveRunning;
```

Para retomar, abra um post ainda salvo e execute o script completo novamente.

## Funcionamento e limites

- Localiza um único ícone visível `svg[aria-label="Remove"]` e clica no botão que o contém.
- Aguarda o desaparecimento do ícone e procura uma única seta visível `button._abl-` contendo `svg[aria-label="Next"]`.
- Para se os elementos estiverem ausentes ou ambíguos, se houver erro, ao atingir o limite ou ao receber o comando de parada.
- O contador registra mudanças indicadas pela interface; não confirma a gravação no servidor.
- `Infinity` não garante remover todos os posts. Carregamento lento, posts indisponíveis ou mudanças na interface podem interromper o processo antes do fim.
- Os seletores dependem do HTML e dos rótulos em inglês observados na interface. Outro idioma ou mudanças do Instagram podem exigir ajustes.
- A seta não é validada por URL ou identificação do post. Confira o comportamento em um lote pequeno, especialmente em publicações com carrossel.
- Remover dos Salvos altera a sua conta; o script não mantém uma lista para desfazer as remoções.
- Os intervalos não garantem evitar restrições de ações do Instagram. Caso apareça uma restrição, interrompa a execução.

## Validação

O usuário confirmou o funcionamento da versão em lote na própria interface em 21/10/2026. Isso não garante compatibilidade com outras contas, idiomas ou versões futuras. A cópia deste repositório preserva a lógica do script testado, com `LIMIT = Infinity`.

## Desenvolvimento

Verificação de sintaxe (Node.js opcional):

```bash
node --check unsave.js
```

O script depende de `window` e `document` e deve ser executado no navegador, não pelo Node.js. Não usa APIs privadas, não lê cookies ou senhas e não faz requisições de rede diretamente; os cliques acionam o próprio aplicativo do Instagram.

Projeto independente, sem vínculo com Instagram ou Meta.
