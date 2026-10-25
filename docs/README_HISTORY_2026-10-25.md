# Histórico da documentação — vagacerta

> Versão anterior do README preservada em 25/10/2026. Para o início rápido e estado atual, consulte [README principal](../README.md).

---

# VagaCerta — Organize candidaturas de emprego

**Um espaço para acompanhar vagas, entrevistas, propostas e próximos contatos em um único fluxo.**

[**Abrir aplicativo**](https://helioconde.github.io/vagacerta/) · [**Arquitetura full-stack**](FULLSTACK.md) · [**Design system**](DESIGN_SYSTEM.md)

![JavaScript](https://img.shields.io/badge/JavaScript-frontend-F7DF1E?logo=javascript&logoColor=black) ![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20dados-3FCF8E?logo=supabase&logoColor=white) ![Status](https://img.shields.io/badge/status-release%20candidate-64748b)

## Em resumo

- **Central de candidaturas:** cadastro, pesquisa e funil de etapas.
- **Acompanhamento:** follow-ups, preparação para entrevistas e produtividade.
- **Modo local:** permite experimentar sem depender da sincronização.
- **Sincronização opcional:** autenticação Supabase e dados por conta, conforme a configuração.
- **Qualidade:** testes de interface e regressões documentados neste repositório.

**Para contribuir:** clone o repositório, execute `npm install` e `npm run check`. Use `npm run test:e2e` para os cenários de navegador.

> O projeto está em fase de validação. Antes de uso amplo com contas reais, é importante reproduzir o teste de isolamento entre usuários descrito abaixo.

---

Organizador de candidaturas com funil, produtividade, follow-ups, compatibilidade explicada e sincronização.

## Status

> **MVP em release candidate.** A interface, os principais fluxos de produto, o QA automatizado, os snapshots visuais e o deploy via GitHub Pages estão ativos e verdes. A única validação externa importante ainda aberta é o teste real de isolamento entre duas contas autenticadas.

- frontend próprio em HTML, CSS e JavaScript;
- modo local funcional inclusive offline;
- Supabase Auth e sincronização por conta;
- banco compartilhado `pizzaria-db`;
- RLS e grants endurecidos nos dados privados;
- GitHub Pages em `https://helioconde.github.io/vagacerta/`;
- CI com Static QA, Browser E2E, Live Update QA e snapshots visuais;
- PT-BR e inglês;
- manifest, favicon, robots e sitemap para publicação.

## Principais recursos

- CRUD de candidaturas;
- funil Salva → Candidatada → Entrevista → Proposta/Encerrada;
- busca, filtro e limpeza de filtros;
- compatibilidade explicada por requisito;
- follow-ups com atraso, concluir e adiar;
- preparação de entrevista;
- versões personalizadas de currículo;
- onboarding e estado vazio;
- indicadores de produtividade e lista de atenção;
- resumo de atividade por candidatura;
- estados offline, loading e erro;
- validação inline acessível;
- layout responsivo e navegação mobile do funil.

## Arquivos principais

- `index.html`
- `style.css`
- `app.js`
- `supabase-config.js`
- `FULLSTACK.md`
- `DESIGN_SYSTEM.md`

## Backend

Este projeto usa o Supabase compartilhado `pizzaria-db`. A chave no frontend é uma **publishable key**. Nunca coloque `service_role` ou segredos administrativos no navegador.

As migrations do VagaCerta ficam em `supabase/migrations/`. O hardening atual remove acesso `anon`, restringe `authenticated` a CRUD e mantém ownership/RLS nos registros privados.

## Desenvolvimento

Sirva a raiz do repositório por HTTP e use:

```bash
npm install
npm run check
npm run test:e2e
npm run screenshots
```

## Gate de release

Concluído:

- [x] compatibilidade explicada por requisito;
- [x] currículos personalizados por candidatura;
- [x] fila de follow-up;
- [x] preparação de entrevista;
- [x] produtividade e resumo de atividade;
- [x] estados loading/erro/offline;
- [x] PT-BR/EN e ARIA localizado;
- [x] teclado e responsividade cobertos por Playwright;
- [x] QA, Static QA, Live Update QA e snapshots visuais verdes;
- [x] GitHub Pages habilitado e workflow de deploy verde;
- [x] manifest, favicon, robots e sitemap.

Validação externa ainda recomendada antes de tratar o produto como release estável:

- [ ] testar duas contas reais e confirmar isolamento RLS entre usuários/dispositivos.

Importação automática de vaga por URL e IA generativa ficam fora do gate atual. IA, quando usada, deve permanecer exclusivamente no backend.
