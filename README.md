# Tessera — Every AI system, accounted for

A scroll-driven product showcase for **Tessera**, a fictional AI governance platform, built for a school/university presentation. The page tells one story in seven short chapters. It starts in the dark (hidden "shadow AI") and the sky warms into a sunrise as each chapter adds clarity.

> **Educational demonstration.** All companies, systems, scores and assessments are simulated. Nothing here is legal advice, a formal legal determination, live AI analysis or a regulatory certification.

## Run it

```bash
npm start            # node server.js, serves on $PORT (default 3000)
# or any static server:
python3 -m http.server 8000
```

`server.js` is a zero-dependency static server used for Railway deployment. It only serves `index.html`, `css/` and `js/`.

## The story (about 12 screens of scrolling)

| # | Chapter | What happens |
|---|---|---|
| – | Intro | Night horizon, the sun below it, AI systems in orbit |
| 01 | The problem *(pinned)* | As you leave the intro, the sun rises and 18 AI tools float up out of the horizon. They gather into an ordered registry, then get colour-coded by risk |
| 02 | The rules *(pinned)* | The EU AI Act risk pyramid builds layer by layer; a live timeline marks "today" |
| 03 | Try it | Pick a model and a purpose; the classification updates instantly. "Add to portfolio" carries it forward |
| 04 | The platform | A monitor mockup with the live dashboard, explorable hotspots and clickable system profiles (your system appears here) |
| 05 | Evidence | A fanned stack of real-looking documents; click to preview and download |
| 06 | The payoff | Drag-to-compare "shadow AI" vs "sunrise", four benefits, audience marquee |
| 07 | Finale | The sun is up: recap and call to action |

## Design

- **Palette** ("Pink sunrise"): true pink `#ff3e9a` as the main accent, soft pink `#ffb3da`, rose `#ff3e7f` and plum night skies. Orange `#f1745e` is kept only for "high risk", teal for "minimal risk".
- **Type:** Space Grotesk (display) + Inter (text).
- **Motion:**
  - Pinned, scroll-scrubbed scenes.
  - Word-by-word headline reveals.
  - Blur and slide reveals.
  - Inertial wheel scrolling.
  - A sky that brightens with scroll progress.
  - The monitor tilts into view.
  - The document fan spreads as you scroll.
  - A cursor glow and film grain.
  - A background layer of drifting aurora light, a parallax dot matrix, shooting stars and giant outlined chapter numerals.
  - All of it respects `prefers-reduced-motion`.

## Structure

```
index.html          shell (sky, chapter rail, modal, toasts)
server.js           static server for Railway
css/styles.css      complete design system and scenes
js/data.js          simulated company data
js/engine.js        rule-based EU AI Act classification engine
js/ui.js            icons, badges, modal, toasts, helpers
js/charts.js        dependency-free SVG charts
js/scene-*.js       one module per chapter
js/app.js           scroll engine: mounting, pinning, reveals, sky, rail
```

## Regulatory notes

Based on Regulation (EU) 2024/1689 ([EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)). Classification follows the **intended purpose** of an AI *system*, never the model brand. The timeline reflects the Digital Omnibus on AI (2026), which postponed high-risk obligations to 2 Dec 2027 (Annex III) and 2 Aug 2028 (Annex I). Confirm current dates against official sources.

## Photography

The real-world photos in `img/` are from [Unsplash](https://unsplash.com/license), which allows free use without permission. They were downloaded, re-encoded and stripped of metadata, and they are served from the repo, so the site works offline. On the page they are colour-graded pink in CSS. The hero uses a real sunrise photograph with an optical bloom and lens flare added on the sun.
