# VagaCerta — Design System

Este documento define o padrão visual e de interação do VagaCerta. O objetivo é manter o produto calmo, legível e orientado à ação, sem sacrificar densidade de informação.

## Princípios

1. **Clareza antes de decoração** — informações sobre candidatura, status, follow-up e compatibilidade devem ser percebidas antes de detalhes visuais.
2. **Ação principal evidente** — cada tela ou bloco deve ter no máximo uma ação primária dominante.
3. **Calma visual** — verde profundo, superfícies neutras, sombras discretas e poucos elementos simultaneamente destacados.
4. **Densidade controlada** — cards compactos, mas nenhum texto funcional abaixo de 11 px.
5. **Acessível por padrão** — foco visível, alvos interativos de pelo menos 36 px e 42–44 px nas ações principais/mobile.
6. **Responsivo sem esconder função** — no mobile, controles empilham; nenhuma função crítica desaparece.

## Fundações

### Tipografia

- Corpo: DM Sans.
- Títulos e números: Manrope.
- Hero: 42–70 px desktop; 39–54 px mobile.
- Título de seção: 23 px.
- Corpo principal: 15–17 px.
- Rótulos e metadados: 11–12 px.
- Nunca usar texto funcional abaixo de 11 px.

### Cores

- Fundo: `#f4f7f4`
- Superfície: `#ffffff`
- Texto principal: `#16221a`
- Texto secundário: `#647268`
- Borda: `#d9e2dc`
- Verde principal: `#245f46`
- Verde forte: `#174a34`
- Verde suave: `#e6f1ea`
- Erro: `#9d3f3f`
- Aviso: `#805d14`
- Sucesso: `#26623f`

### Espaçamento

Escala base: 4, 8, 12, 16, 20, 24, 32, 40 e 48 px.

Evitar valores arbitrários quando um valor da escala resolver o mesmo problema.

### Bordas e sombras

- Raio pequeno: 10 px.
- Raio médio: 14 px.
- Raio grande: 20 px.
- Sombras são usadas apenas para hierarquia, não como decoração.
- Componentes da mesma camada devem compartilhar a mesma intensidade de sombra.

## Componentes

### Topbar

- Sticky no desktop.
- Marca à esquerda; idioma, sincronização e conta à direita.
- No mobile, pode quebrar em duas linhas.
- Status de sincronização usa indicador visual discreto, nunca só cor.

### Hero

- Mensagem principal curta.
- Um único destaque em verde.
- Card “Em andamento” funciona como KPI de entrada, não como dashboard completo.

### Toolbar

- Busca, filtro e ação primária.
- Sticky apenas quando houver espaço suficiente.
- Campo de busca sempre ocupa a maior largura disponível.

### Métricas

- Quatro cards em desktop.
- Dois ou um por linha em telas menores.
- Números têm prioridade sobre rótulos.

### Estado vazio e onboarding

- O primeiro acesso deve explicar o fluxo em no máximo três passos.
- O CTA principal do estado vazio abre o mesmo formulário da ação “Nova candidatura”.
- O onboarding desaparece assim que houver ao menos uma candidatura.
- Evitar ilustrações decorativas se elas não ajudarem a entender a próxima ação.

### Follow-ups

- Atrasados usam fundo/vermelho suave.
- Ações devem continuar legíveis sem depender apenas da cor.
- “Concluir” e “Adiar” mantêm peso secundário em relação a “Nova candidatura”.

### Board

- Colunas usam diferença de cor apenas como pista sutil.
- Em telas menores, uma navegação horizontal por etapas permite saltar diretamente para cada coluna.
- O resumo do board informa quantas candidaturas estão sendo exibidas após busca/filtro.
- Ao aplicar filtro, a ação “Limpar filtros” deve ficar disponível e devolver o foco à busca.
- Horizontal scroll é permitido e intencional.
- Cada coluna usa snap no mobile.
- Cards devem manter a mesma estrutura: cargo → empresa → sinais → notas → ferramentas → status.

### Cards

- Cargo é o elemento principal.
- Empresa é metadado secundário.
- Chips usam três famílias: sucesso, atenção e neutro.
- Evitar mais de uma linha de botões primários dentro do card.

### Diálogos

- Título claro e botão fechar sempre visível.
- Área de ações permanece sticky em formulários longos.
- Campos devem ter label persistente; placeholder nunca substitui label.
- Mensagens de erro/status devem usar `aria-live`.

### Publicidade

- Sempre visualmente secundária.
- Nunca entre label e campo, dentro de card, ou bloqueando uma ação.
- Não usar animação chamativa.

## Acessibilidade

- Link “Pular para o conteúdo” é o primeiro foco da página.
- `:focus-visible` deve ser claramente perceptível.
- Todos os campos têm labels.
- Textareas com instruções usam `aria-describedby`.
- Modais usam `<dialog>` com `aria-labelledby`.
- Respeitar `prefers-reduced-motion`.
- Nenhum texto funcional abaixo de 11 px.
- Nenhum alvo interativo visível abaixo de 36×36 px; preferir 42–44 px.

## Responsividade

### > 900 px
Layout completo; hero em duas colunas; board com cinco colunas roláveis.

### 621–900 px
Hero empilha; métricas 2×2; toolbar em duas colunas.

### <= 620 px
Topbar e toolbar deixam de ser sticky. Formulários viram uma coluna. Board usa cards de até 86vw. Ações de cards e follow-ups ocupam largura disponível.

### <= 390 px
Métricas usam uma coluna para evitar compressão excessiva.

## QA visual

O script `scripts/capture-site.mjs` gera:

- desktop completo;
- mobile completo;
- dialog de candidatura desktop;
- dialog de candidatura mobile;
- estado desktop em inglês;
- dashboard populado em desktop;
- dashboard populado em mobile.

O gate falha em:

- overflow involuntário;
- erro de console;
- request quebrada;
- imagem quebrada;
- texto abaixo de 11 px;
- alvo de toque pequeno no mobile.

## Regra para novas telas

Antes de criar um padrão novo, reutilizar tokens, `.button`, `.field`, `.panel-lite`, `.section-heading` e superfícies existentes. Um componente novo só deve introduzir nova linguagem visual quando representar uma função realmente diferente.
