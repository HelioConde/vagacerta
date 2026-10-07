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
- score de compatibilidade opcional;
- salário/pretensão;
- link da vaga;
- métricas de total, candidaturas, entrevistas e compatibilidade média;
- layout responsivo;
- CI validando o frontend dedicado.

## Próximas entregas de produto — ordem obrigatória

1. **Score de compatibilidade explicado por requisito** — requisitos atendidos, ausentes e não comprovados; nenhuma nota opaca.
2. **Currículos personalizados em `vagacerta_documents`** — manter currículo-base e versões por candidatura.
3. **Follow-up** — data, fila de pendências, concluir/adiar e destaque de atrasados.
4. **Preparação de entrevista ligada à candidatura** — perguntas, checklist e notas.

Somente depois deste bloco:
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

- [ ] os quatro diferenciais acima funcionam no modo local;
- [ ] persistência/sincronização funcionam com conta autenticada;
- [ ] RLS de documentos e candidaturas validada entre dois usuários;
- [ ] PT-BR/EN cobrem os novos fluxos;
- [ ] mobile e teclado utilizáveis;
- [ ] Browser E2E cobre criação → candidatura → follow-up → entrevista;
- [ ] GitHub Pages/CI verdes;
- [ ] nenhum P0/P1 conhecido.

Até cumprir esse gate, VagaCerta é **produto em desenvolvimento**, não MVP finalizado.
