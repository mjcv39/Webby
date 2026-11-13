# Tessera — AI Governance & Compliance Platform (interactive demo)

A fictional enterprise SaaS product website built for a school/university project. It demonstrates how an AI governance platform could inventory AI systems, classify them under the EU AI Act, centralise documentation and monitor compliance.

> **Educational demonstration.** All companies, systems, scores and assessments are simulated. Nothing here is legal advice, a formal legal determination, live AI analysis or a regulatory certification.

## Run it

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Pages (hash-routed single-page app)

| Route | Content |
|---|---|
| `#/home` | Landing page: hero, problem/solution flip cards, features, how it works |
| `#/dashboard` | Simulated enterprise dashboard, filterable portfolio, system profiles |
| `#/assess` | Model registry + simulated risk assessment (purpose-based classification) |
| `#/eu-ai-act` | EU AI Act centre: risk pyramid, Art. 5, Annex III, Art. 50, GPAI, roles, timeline, penalties |
| `#/documents` | Document library with previews/downloads and an interactive checklist |
| `#/monitoring` | Alerts (what / system / why / action), metrics, status indicators, live feed |
| `#/value` | Business value, before/after slider, persona tabs, illustrative estimator |
| `#/demo` | Six-step guided demo: model → use → classification → requirements → compliance → docs |

## Structure

```
index.html          shell (nav, modal, toasts)
css/styles.css      design system (light + dark contexts via CSS variables)
js/data.js          simulated company data (systems, documents, alerts, deadlines)
js/engine.js        rule-based classification engine + requirement catalogue
js/ui.js            icons, badges, modal, toast, shared result renderer
js/charts.js        dependency-free SVG charts (donut, gauge, ring, line, bars)
js/page-*.js        one module per page
js/app.js           router
```

## Regulatory notes

Based on Regulation (EU) 2024/1689 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)) and the European Commission's AI Act pages. Classification follows the **intended purpose** of an AI *system*, never the model brand. The timeline reflects the Digital Omnibus on AI, which postponed high-risk obligations to 2 Dec 2027 (Annex III) and 2 Aug 2028 (Annex I). Dates change: always confirm against official sources before relying on them.
