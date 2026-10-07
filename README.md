# VagaCerta

Organizador de candidaturas com funil, métricas e sincronização.

## Status

> **Próximo foco pesado do portfólio após a fila de fechamento de 07/10/2026.**

A fundação fullstack está funcional, mas o produto ainda não entra em validação final porque faltam os diferenciais que o separam de um Kanban/planilha de candidaturas.

- frontend próprio;
- modo local quando aplicável;
- Supabase Auth e sincronização quando aplicável;
- banco compartilhado `pizzaria-db`;
- RLS nos dados privados;
- GitHub Pages preparado para `https://helioconde.github.io/vagacerta/`;
- CI próprio.

## Arquivos principais

- `index.html`
- `style.css`
- `app.js`
- `supabase-config.js`
- `FULLSTACK.md`

## Backend

Este projeto usa o Supabase compartilhado `pizzaria-db`. A chave no frontend é uma **publishable key**. Nunca coloque `service_role` ou segredos administrativos no navegador.

## Desenvolvimento

Abra `index.html` por um servidor HTTP local para testar. O deploy alvo é GitHub Pages.

## Arquitetura

Veja `FULLSTACK.md` para regras de produto, QA, segurança e próximas etapas.

## Idiomas e monetização

- PT-BR é o idioma principal do produto.
- A interface também deve oferecer inglês.
- A preferência de idioma é persistida no navegador.
- O modelo de monetização é baseado em anúncios não intrusivos.
- Anúncios não devem interromper cadastro, edição, leitura ou mudança de status das candidaturas.


## Escopo fechado da próxima fase

Antes de adicionar qualquer outra feature, concluir nesta ordem:

1. **Compatibilidade explicada** — score 0–100 acompanhado dos requisitos encontrados, atendidos, ausentes e não comprovados.
2. **Currículo personalizado** — versões ligadas à candidatura em `vagacerta_documents`, sem sobrescrever o currículo-base.
3. **Follow-up** — data sugerida/definida, fila de retornos pendentes e estado de concluído/adiado.
4. **Preparação de entrevista** — perguntas, pontos para revisar e notas vinculadas à candidatura.

Importação automática de vaga por URL e IA generativa ficam depois desse núcleo. IA, quando usada, deve permanecer exclusivamente no backend.
