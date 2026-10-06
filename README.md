# VagaCerta

Organizador de candidaturas com funil, métricas e sincronização.

## Status

MVP fullstack funcional preparado para repositório independente.

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
