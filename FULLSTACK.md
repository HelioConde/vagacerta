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

## Próximas entregas de produto

- currículos personalizados em `vagacerta_documents`;
- score de compatibilidade explicado por requisito;
- data e lembrete de follow-up;
- preparação de entrevista ligada à candidatura;
- importação de vaga por URL quando houver integração permitida;
- IA somente via backend/Edge Function.

## Idiomas

PT-BR é o idioma principal. Inglês deve estar disponível em toda a interface, preservando os mesmos recursos e dados.

## Monetização

O produto é preparado para monetização por anúncios. Os espaços publicitários devem ficar fora das ações críticas do funil e nunca bloquear cadastro, leitura, edição, autenticação ou mudança de status.

## QA obrigatório

Isolamento RLS, duplicidade, URLs inválidas, troca de status, score 0–100, mobile, teclado, estados loading/erro/vazio e importação local → nuvem.
