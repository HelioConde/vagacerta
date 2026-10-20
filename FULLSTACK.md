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
- workflows QA e GitHub Pages;
- onboarding e estado vazio orientado à ação;
- navegação mobile do funil;
- produtividade e lista automática de atenção;
- resumo de atividade por candidatura;
- validação inline acessível;
- suporte explícito a offline/loading/erro;
- metadata de publicação com manifest, favicon, robots e sitemap.

## Diferenciais do gate

Os quatro diferenciais foram implementados em 07/10/2026. As migrations do gate, proteção de vínculo documento/candidatura e hardening de grants/RLS já estão aplicadas no Supabase compartilhado e versionadas em `supabase/migrations/`.

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
- [x] schema, grants e políticas necessários para persistência/sincronização autenticada estão aplicados;
- [ ] RLS de documentos e candidaturas validada entre dois usuários reais;
- [x] PT-BR/EN cobrem painel, formulário, autenticação e novos fluxos;
- [x] mobile e teclado cobertos no Browser E2E e nos snapshots automatizados;
- [x] Browser E2E cobre criação → candidatura → follow-up → currículo → entrevista, validação, offline, produtividade e atividade;
- [x] GitHub Pages habilitado e workflow de deploy verde;
- [x] Static QA, Live Update QA e Visual Snapshot verdes;
- [x] nenhum P0/P1 de código conhecido.

O VagaCerta está em **MVP release candidate**. O único gate externo ainda recomendado para release estável é validar isolamento entre duas contas reais.


## Hardening de segurança — 20/10/2026

- `vagacerta_applications` e `vagacerta_documents` não concedem acesso ao papel `anon`;
- `authenticated` recebe somente `SELECT, INSERT, UPDATE, DELETE`;
- documentos usam uma policy permissiva de propriedade mais uma policy restritiva que exige candidatura do mesmo usuário;
- policies permissivas duplicadas de documentos foram removidas;
- Supabase Advisor não aponta mais `multiple_permissive_policies` para tabelas do VagaCerta;
- migration registrada no banco: `20261020030519_vagacerta_harden_rls_and_grants`.
