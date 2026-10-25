<div align="center">

<h1>💼 VagaCerta</h1>

<strong>Um lugar para acompanhar sua busca por emprego do começo ao próximo passo</strong>

<p>Organize candidaturas, entrevistas, currículos personalizados e contatos de acompanhamento sem depender de planilhas dispersas.</p>

<a href="https://helioconde.github.io/vagacerta/"><img alt="Aplicativo Web" src="https://img.shields.io/badge/ABRIR-APLICATIVO%20WEB-2563eb?style=for-the-badge"></a>
<a href="https://github.com/HelioConde/vagacerta"><img alt="Release candidate" src="https://img.shields.io/badge/STATUS-RELEASE%20CANDIDATE-64748b?style=for-the-badge"></a>

<p><a href="https://helioconde.github.io/vagacerta/"><strong>Experimentar</strong></a> · <a href="FULLSTACK.md"><strong>Arquitetura</strong></a> · <a href="DESIGN_SYSTEM.md"><strong>Design system</strong></a></p>

</div>

---

## A proposta

A busca por uma vaga envolve muitos detalhes: empresas, datas, retornos, entrevistas e versões diferentes do currículo. **VagaCerta** reúne essas informações em um funil visual que deixa claro o próximo passo.

**Estado:** MVP em *release candidate*, com base funcional e validações externas ainda necessárias antes de considerar o lançamento estável.

## O que é possível organizar

- **Candidaturas:** criar, editar, localizar e filtrar oportunidades.
- **Funil:** Salva → Candidatada → Entrevista → Proposta ou Encerrada.
- **Próximas ações:** acompanhar follow-ups atrasados, concluir e adiar contatos.
- **Entrevistas:** manter orientações e anotações de preparação.
- **Currículos:** organizar versões direcionadas a diferentes oportunidades.
- **Produtividade:** indicadores, resumos e itens que exigem atenção.
- **Acesso:** modo local e sincronização opcional mediante conta e backend configurado.

## Local ou sincronizado?

| Modo | Como funciona |
| --- | --- |
| **Local** | Permite experimentar o produto sem criar uma conta |
| **Conta Supabase** | Autenticação e dados sincronizados, sujeitos à configuração e às políticas RLS |
| **Offline** | Possibilidades e limites de uso sem rede dependem do fluxo em questão |

> **Proteção dos dados:** antes do uso amplo com contas reais, ainda é necessário reproduzir a validação do isolamento entre usuários e dispositivos.

## Desenvolvimento

O frontend é implementado em **HTML, CSS e JavaScript**, com integração Supabase e testes de navegador.

```bash
git clone https://github.com/HelioConde/vagacerta.git
cd vagacerta
npm install
npm run check
npm run test:e2e
```

O projeto pode ser servido como site estático, por exemplo com `python -m http.server 8000` na raiz. Os testes Playwright exigem instalação dos navegadores correspondentes.

### Principais arquivos

`index.html` · `style.css` · `app.js` · `supabase-config.js` · `FULLSTACK.md` · `DESIGN_SYSTEM.md`.

## Critérios antes do lançamento estável

- Interface e fluxos essenciais: **desenvolvidos**, com QA documentado.
- GitHub Pages e workflow: **configurados**.
- Isolamento real entre duas contas autenticadas: **validação externa recomendada**.
- Integrações futuras e IA generativa: **fora do escopo de lançamento atual**.

[Documentação do backend](FULLSTACK.md) · [Padrões de interface](DESIGN_SYSTEM.md) · [README técnico anterior](docs/README_HISTORY_2026-10-25.md)

---

<div align="center"><strong>Desenvolvido por <a href="https://github.com/HelioConde">Hélio Conde</a></strong></div>
