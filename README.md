# VagaCerta

Organizador de candidaturas com funil, métricas e sincronização.

## Status

> **Os quatro diferenciais do gate foram implementados em 07/10/2026. O projeto entra agora em validação de infraestrutura/QA antes de ser marcado como MVP finalizado.**

A fundação fullstack e os quatro diferenciais já estão implementados. O que resta é aplicar a migration no `pizzaria-db`, validar RLS/sincronização real e confirmar QA/Pages verdes.

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


## Gate atual de finalização

Implementado no GitHub:

- [x] compatibilidade explicada por requisito, com score calculado;
- [x] currículos personalizados versionados por candidatura;
- [x] fila de follow-up com concluir/adiar e destaque de atrasados;
- [x] preparação de entrevista ligada à candidatura;
- [x] Browser E2E do fluxo principal;
- [x] workflows QA e GitHub Pages;
- [x] migration + RLS versionadas em `supabase/migrations/20261007_vagacerta_product_gate.sql`.

Ainda depende de validação externa:

- [ ] aplicar a migration no `pizzaria-db`;
- [ ] validar duas contas/dispositivos e isolamento RLS;
- [ ] confirmar Actions/Pages verdes;
- [ ] revisar mobile/teclado no ambiente publicado.

Importação automática de vaga por URL e IA generativa ficam depois desse gate. IA, quando usada, deve permanecer exclusivamente no backend.
