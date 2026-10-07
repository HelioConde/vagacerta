# VagaCerta — arquitetura fullstack

Repositório: `HelioConde/vagacerta`.

## Produto

Organizador de candidaturas com histórico, funil por etapa, compatibilidade e próximos passos.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `vagacerta_applications`: empresa, cargo, URL, status, score, salário, notas e datas.
- `vagacerta_documents`: currículos/cartas ligados opcionalmente a uma candidatura.
- `product_subscriptions`: plano por produto.

Dados privados são protegidos por RLS.

## Implementado

- modo local sem conta;
- Supabase Auth;
- sincronização da conta;
- importação do protótipo local antigo;
- CRUD completo de candidaturas;
- etapas Salva → Candidatada → Entrevista → Proposta/Encerrada;
- mudança de status direto no card;
- busca por empresa, cargo ou anotação;
- filtro por status;
- compatibilidade explicada por requisito (`+` atendido, `-` ausente, `?` não comprovado) com score calculado;
- salário/pretensão;
- link da vaga;
- métricas de total, candidaturas, entrevistas e compatibilidade média;
- fila de follow-up com data, atrasados, concluir e adiar;
- versões personalizadas de currículo por candidatura;
- preparação de entrevista com perguntas, revisão e notas;
- layout responsivo;
- Browser E2E do fluxo principal;
- workflows QA e GitHub Pages.

## Diferenciais do gate

Os quatro diferenciais foram implementados em 07/10/2026. A migration necessária está versionada em `supabase/migrations/20261007_vagacerta_product_gate.sql` e ainda precisa ser aplicada no Supabase compartilhado antes de considerar a sincronização em nuvem concluída.

Somente depois de validar este bloco:
- importação de vaga por URL quando houver integração permitida;
- IA somente via backend/Edge Function;
- automações adicionais baseadas em feedback real.

## Idiomas

PT-BR é o idioma principal. Inglês deve estar disponível em toda a interface, preservando os mesmos recursos e dados.

## Monetização

O produto é preparado para monetização por anúncios. Os espaços publicitários devem ficar fora das ações críticas do funil e nunca bloquear cadastro, leitura, edição, autenticação ou mudança de status.

## QA obrigatório

Isolamento RLS, duplicidade, URLs inválidas, troca de status, score 0–100, mobile, teclado, estados loading/erro/vazio e importação local → nuvem.


## Gate para sair da implementação pesada

- [x] os quatro diferenciais acima implementados no modo local;
- [ ] persistência/sincronização funcionam com conta autenticada após aplicar migration;
- [ ] RLS de documentos e candidaturas validada entre dois usuários;
- [x] PT-BR/EN cobrem os novos fluxos;
- [ ] mobile e teclado utilizáveis no ambiente publicado;
- [x] Browser E2E cobre criação → candidatura → follow-up → currículo → entrevista;
- [ ] GitHub Pages/CI verdes;
- [ ] nenhum P0/P1 conhecido.

Até cumprir esse gate, VagaCerta é **produto em desenvolvimento**, não MVP finalizado.
