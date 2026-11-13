# Tessera — AI Governance & Compliance Platform (interactive demo)

A fictional enterprise SaaS product site built for a school/university presentation. It shows how an AI governance platform could inventory AI systems, classify them under the EU AI Act, centralise documentation and monitor compliance.

> **Educational demonstration.** All companies, systems, scores and assessments are simulated. Nothing here is legal advice, a formal legal determination, live AI analysis or a regulatory certification.

## Run it

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## One page, nine scenes

A single scrolling page with anchored sections (no tabs, no separate pages). The nav highlights the current section as you scroll.

| # | Section | What it shows |
|---|---|---|
| – | Hero | Headline, three bullets, animated dashboard mockup |
| 01 | Platform (`#platform`) | Problems vs solutions, six modules, how it works |
| 02 | Dashboard (`#dashboard`) | KPIs, risk donut, readiness gauge, trend, deadlines, alerts, filterable portfolio, system profiles |
| 03 | Assessment (`#assess`) | Simulated classification (model + purpose), four outcomes, model registry |
| 04 | EU AI Act (`#eu-act`) | Risk pyramid, Art. 5 prohibitions, Annex III, Art. 50, GPAI, roles, timeline, penalty calculator |
| 05 | Documents (`#docs`) | Document library with previews and downloads, live checklist |
| 06 | Monitoring (`#monitoring`) | Reactive vs proactive, alert cards with details/actions, metrics, live feed |
| 07 | Value (`#value`) | Benefits, before/after slider, personas, illustrative estimator |
| 08 | Guided demo (`#demo`) | Three steps: choose, classify and review gaps, act |

## Motion

Scroll-triggered reveals (fade/slide/zoom with stagger), word-by-word masked headline reveals, inertial mouse-wheel scrolling, overlapping "sheet" sections, scroll-driven zoom on product windows, hero fade-out, scroll progress bar, hide-on-scroll nav, count-ups and charts that animate when they enter view. All of it respects `prefers-reduced-motion`.

## Structure

```
index.html            shell (nav, modal, toasts)
css/styles.css        design system and components (light + dark contexts)
css/presentation.css  single-page layout, scroll and motion layer
js/data.js            simulated company data
js/engine.js          rule-based classification engine + requirement catalogue
js/ui.js              icons, badges, modal, toast, shared result renderer
js/charts.js          dependency-free SVG charts
js/sec-*.js           one module per section
js/app.js             assembly, scroll animations, scroll-spy
```

## Regulatory notes

Based on Regulation (EU) 2024/1689 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)) and the European Commission's AI Act pages. Classification follows the **intended purpose** of an AI *system*, never the model brand. The timeline reflects the Digital Omnibus on AI, which postponed high-risk obligations to 2 Dec 2027 (Annex III) and 2 Aug 2028 (Annex I). Dates change: confirm against official sources before relying on them.
