# Data visualization — library & pattern research

*June 2026 · complements [data-visualization.md](data-visualization.md)*

Research on **libraries, chart types, and editorial design patterns** we can leverage for Illuminairy’s Observatory data language. This is forward-looking: it does **not** recommend extending current funnel, SOHA, or plan HTML chart code.

**Mockup board:** [`design/mockups/09-data-viz-directions.html`](../design/mockups/09-data-viz-directions.html)

---

**Ideation matrix:** [`design/mockups/10-sat-viz-ideation-matrix.html`](../design/mockups/10-sat-viz-ideation-matrix.html) · [`docs/data-visualization-ideation.md`](data-visualization-ideation.md)

---

## Executive recommendation (revised June 2026)

**Previous pick (Visx) was wrong for the ask.** Visx is a **drawing toolkit**, not a chart library. It does not ship ranked-skill charts, sankeys, treemaps, or responsive tooltips. We used it to reskin SOHA layouts. That failed the “best-in-class library” bar.

### What “best in class” actually means (three tiers)

| Tier | What it is | Examples | Delivers out of the box |
|------|------------|----------|-------------------------|
| **A · Chart libraries** | Full catalog + themes + interactions | **Apache ECharts 6**, **Highcharts**, **amCharts 5**, Nivo | Line, bar, sankey, treemap, heatmap, dumbbell-like custom series, tooltips, responsive |
| **B · Grammar of graphics** | Compose marks (bar, dot, line) declaratively | **Observable Plot**, Vega-Lite | Journalism-quality defaults; you still design; great for **ideation** |
| **C · Primitives** | Scales + shapes only | **Visx**, raw D3 | Maximum control; **you build every chart type** |

NYT Graphics uses **tier C** (D3 + internal tools), not an npm chart gallery. Datawrapper/Flourish are **SaaS embeds** (tier above A) used by newsrooms for publication — not something you npm-install into Next.js.

### Pick for Illuminairy (by phase)

| Phase | Library | Role |
|-------|---------|------|
| **1 · Ideation** (now) | **[Observable Plot](https://observablehq.com/plot/)** (`@observablehq/plot`) | Prototype 10+ encodings per SAT entity in hours (lollipop, dot, barY, area, link/sankey-style). D3 maintainer’s grammar layer. Best for “what if treemap vs sankey?” |
| **2 · Production engine** | **[Apache ECharts 6](https://echarts.apache.org/)** + [`echarts-for-react`](https://github.com/hustcc/echarts-for-react) | **Primary recommendation** for in-app React: 40+ chart types, sankey/treemap/sunburst built-in, `registerTheme()` for aurora tokens, canvas+SVG, handles resize. Free Apache 2.0. |
| **2 alt · Commercial polish** | **[Highcharts](https://www.highcharts.com/)** + `highcharts-react-official` | Official React wrapper, WCAG/a11y module, enterprise support. **License cost** (~$400+/yr commercial). Pick if you want vendor + accessibility guarantees over DIY theming. |
| **2 alt · Infographic polish** | **[amCharts 5](https://www.amcharts.com/)** | 60+ types, maps, Gantt, stock — very polished defaults. Commercial license; Canvas-based. |
| **3 · Bespoke one-offs** | Visx or D3 | Only after A/B picks cannot express the encoding (custom constellation, logo arc). |

**Do not use as primary engine:** Recharts, Tremor, Chart.js defaults (dashboard SaaS look), MUI X Charts (immature catalog).

**Optional reference (not in-repo):** [Datawrapper](https://www.datawrapper.de/) or [Flourish](https://flourish.studio/) for **benchmarking** editorial quality on sample SAT data — export screenshots into Figma/mockups. Not for embedding in illuminairy.com funnel/SOHA.

### Why ECharts over the others (production)

| Need | ECharts | Highcharts | Observable Plot | Visx |
|------|---------|------------|-----------------|------|
| Sankey (misses → skills) | Native | Native | `Plot.link` | Build yourself |
| Treemap (ranked points) | Native | Native | Limited | `@visx/hierarchy` |
| Step/line trajectory | Native | Native | Native | Native |
| Theme from design tokens | `registerTheme` | `setOptions` | CSS + mark props | All manual |
| React + Next.js | Community wrapper (mature) | **Official** wrapper | `useEffect` + DOM node | Native React |
| Bundle / tree-shake | Import per chart type | Modular packages | Single pkg ~small | Modular |
| Cost | Free | Commercial | Free | Free |

Sources: [2026 library comparison (LogRocket)](https://blog.logrocket.com/best-react-chart-libraries-2026/), [deep dive D3/Plot/Visx/ECharts](https://www.youngju.dev/blog/culture/2026-05-14-data-visualization-libraries-2026-d3-plot-visx-recharts-echarts-vega-comparison-deep-dive-2026.en), [enterprise design system eval (ECharts theming)](https://johnson.works/blog/visualization-library-evaluation).

### Corrected stack

| Layer | Pick | Why |
|-------|------|-----|
| **Ideation** | Observable Plot + `10-sat-viz-ideation-matrix.html` | Many encodings fast, before committing |
| **Production chart engine** | **Apache ECharts 6** + registered `illuminairy` theme | Real chart catalog, interactions, responsive |
| **Commercial upgrade path** | Highcharts or amCharts 5 | If ECharts theming cannot hit editorial bar |
| **HTML-only editorial** | Ledger, milestone ribbon, hero numbers | No library needed |
| **Legacy / scratchpad** | Visx in `components/data-viz/` | Deprioritize; do not treat as SSOT |

**Installed today (can stay for scratchpad):** `@visx/*` v4 — **not** the production recommendation.

**Next install when you approve Phase 2:** `echarts`, `echarts-for-react` (and optionally `@observablehq/plot` for ideation sandbox).

---

## Ecosystem map (Python, JS, and “gold standard” tools)

Your list is accurate for **data science / analytics**. Illuminairy’s **production site** is **Next.js + TypeScript**. The question is not “which library is best globally” but **which layer each library owns**.

### Summary table

| Library | Language | Strength (your framing) | Illuminairy role | Ship on illuminairy.com? |
|---------|----------|-------------------------|------------------|--------------------------|
| **Plotly** (+ Dash) | Python / JS | Interactive web plots, hover, 3D, maps; Dash = full Python web apps | **Sidecar:** explore SAT distributions, export PNG/SVG; **optional** `react-plotly.js` spike | ⚠️ Dash **no**; Plotly.js **maybe** (heavy bundle, scientific defaults) |
| **Matplotlib** | Python | Publication-quality **static**; pixel control | **Internal:** diagnostic analysis notebooks, static figures for docs/decks | ❌ Not in React UI (unless pre-rendered image) |
| **Seaborn** | Python | Fast statistical plots (heatmap, violin, regression) | **Internal:** PostHog/funnel analysis, skill correlation exploration | ❌ Not in React UI |
| **D3.js** | JavaScript | Bespoke DOM/SVG/CSS; unlimited custom | **Tier C production** when no chart library fits; NYT model | ✅ Yes — via D3, Observable Plot, or Visx |
| **Observable Plot** | JavaScript | Grammar of graphics on D3; journalism | **Ideation + some production** | ✅ Yes |
| **Apache ECharts** | JavaScript | Full chart catalog + theme + interactions | **Primary production engine (recommended)** | ✅ Yes |
| **Highcharts / amCharts** | JavaScript | Commercial polish, a11y, support | **Production upgrade path** | ✅ Yes (license) |

### Plotly (+ Dash)

**What it is:** Plotly.js renders in the browser; Python `plotly` generates figures; **Dash** is a separate Python framework for analytical web apps (Flask-like).

| Use | Verdict |
|-----|---------|
| Brianna exploring diagnostic data in Jupyter | ✅ Excellent |
| Building SOHA portal or `/plan` in this repo | ❌ Wrong stack — site is not Python |
| `react-plotly.js` in Next.js | ⚠️ Possible but **large bundle** (~1MB+), default look reads **scientific/plotly** not observatory editorial; theming is doable but fight-heavy |
| Dash app for internal ops | ✅ If you ever want a separate **internal** analytics app — not the marketing/enrollment product |

**Plotly vs ECharts for Illuminairy:** Both are “real” interactive libraries. ECharts fits better: smaller themed imports, sankey/treemap native, no Python split-brain, better match to branded parent UI. Plotly wins when the team is **Python-first** and already lives in notebooks.

### Matplotlib

**What it is:** Low-level static canvas — the LaTeX of Python plotting.

| Use | Verdict |
|-----|---------|
| Export one perfect static figure (PDF/HTML plan attachment) | ✅ |
| Pixel-perfect control for print | ✅ |
| Interactive SOHA diagnostic | ❌ Not interactive; not in browser without export step |

**Pair with:** export SVG/PNG → embed in `content/soha/` or parent PDF. Do not drive live React components from Matplotlib at runtime.

### Seaborn

**What it is:** Statistical convenience on Matplotlib — heatmaps, violins, pair plots, regression lines.

| Use | Verdict |
|-----|---------|
| “Does accuracy correlate with section?” during analysis | ✅ |
| Heatmap of skill × difficulty for **your** eyes before picking a parent-facing encoding | ✅ |
| Parent-facing chart on site | ❌ Defaults are academic; would need full custom theme anyway |

**Illuminairy fit:** `growth/` funnel analysis, PostHog export notebooks — **research lane**, not product lane.

### D3.js

**What it is:** The gold standard for **custom** visualization — bind data to SVG/HTML/CSS. Steep curve; no chart types included.

| Use | Verdict |
|-----|---------|
| Constellation question field, logo arc, one-off scrollytelling | ✅ When ECharts/Plot cannot express it |
| Default choice for all SAT charts | ❌ Too much engineering — that’s why chart libraries exist |
| Relationship to Visx | Visx **is** React + D3 modules; same tier, less boilerplate |
| Relationship to Observable Plot | Plot **is** D3 with a grammar layer — prefer Plot for 80% of exploratory work, drop to D3 for the rest |

**NYT reality:** They use D3 + **years of internal templates** — not a single npm “chart library.”

### Where Python and JavaScript meet (if you want both)

```
Python (Plotly / Seaborn / Matplotlib)     JavaScript (Next.js product)
─────────────────────────────────────     ────────────────────────────────
Explore SAT item data                      SOHA portal, plan reveal, funnel
Try 20 encodings in a notebook             Ship 2–3 winning encodings
Export SVG/PNG or JSON spec                ECharts + illuminairy theme
PostHog / funnel deep dives                Parent-facing interactive UI
```

No requirement to pick **one** library globally — pick **one per lane**.

### Recommended split for Illuminairy

| Lane | Tool | Why |
|------|------|-----|
| **Your exploration** (notebooks) | **Seaborn + Plotly** | Fast statistical views; interactive hover in Jupyter |
| **Static exports** (print/PDF) | **Matplotlib** | When a chart must be a frozen asset |
| **Encoding ideation** (browser) | **Observable Plot** | JS-native; same repo; many marks quickly |
| **Production UI** (parents) | **Apache ECharts 6** | Catalog + theme + React; not Python |
| **Bespoke hero moments** | **D3** (or Plot low-level) | Logo arc, constellation — after catalog fails |
| **Do not use for product** | Dash, Matplotlib live, Seaborn live, Visx-as-primary | Wrong tool or already failed bar |

---

## Our constraints (Illuminairy-specific)

| Constraint | Implication |
|------------|-------------|
| Next.js 16 App Router | Charts with animation → `'use client'`; static SVG can render in Server Components as JSX |
| No chart deps before Jun 2026 | **Visx v4** installed; `@visx/*` in `package.json` |
| Data volume | Always small (≤98 questions, ≤20 skills, ≤12 week columns) — **SVG is sufficient** |
| Brand | Editorial observatory, not BI dashboard — **defaults from any chart library will fight you** |
| Surfaces | Funnel mobile column, enroll desktop, diagnostic long-scroll, printable HTML plans |
| Copy rules | No tutor-ad comparison bars, no alarm red/green — libraries’ default palettes are wrong |
| Accessibility | Prefer text + `role="img"` + `aria-label` (patterns we already use conceptually) |

---

## Library landscape (2026)

### Tier A — Fits our direction

#### 1. React + inline SVG (no library)

**What it is:** Components return `<svg>` or semantic HTML (ledger lists, constellation dots as `<div>`).

**Pros:** Zero dependency; pixel-match to mockups; SSR-friendly; easy print/PDF; Tailwind/CSS variables for brand tokens.

**Cons:** You own scales, responsive `viewBox`, and animation.

**Best for:** All six Observatory families, especially ledger rank, constellation field, milestone ribbon, tide readout.

**Already proven in mockup:** `09-data-viz-directions.html` — entire board is self-contained.

---

#### 2. D3 modules (à la carte)

**Packages:** `d3-scale`, `d3-shape`, `d3-format`, `d3-array` (~2–8 kB each gzipped).

**What it is:** Math only — no DOM. Use in utilities, return path strings or scale functions to feed React SVG.

**Pros:** Industry standard for domains, curves (`curveMonotoneX` for horizon path), tick formatting.

**Cons:** Not React-aware; easy to over-import if you pull all of `d3`.

**Best for:** Horizon path Y-mapping, spectrum band marker position, responsive tick generation.

**Example use:**

```ts
import { scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";

const y = scaleLinear().domain([1200, 1600]).range([plotBottom, plotTop]);
const path = line<{ week: number; score: number }>()
  .x((d) => x(d.week))
  .y((d) => y(d.score))
  .curve(curveMonotoneX);
```

---

#### 3. Visx (`@visx/*`) — v4 stable (June 2026)

**What it is:** Airbnb’s low-level React + D3 **primitives** (scales, shapes, axes, grids, text measurement).

**Pros:** Modular imports; React 19 support in v4; designed for **custom** design systems; SSR improvements in v4.

**Cons:** Not a chart gallery — you still design every mark; maintenance cadence was slow until v4 (teams have migrated away when blocked on React versions).

**Use if:** You want `@visx/scale` + `@visx/shape` + `@visx/axis` as helpers inside **your** `<HorizonPath />` component, not `@visx/xychart`.

**Skip:** Treating visx as “drop in a BarChart.”

**References:** [visx docs](https://visx.airbnb.tech) · [v4 migration](https://github.com/airbnb/visx/blob/master/MIGRATION.md)

---

#### 4. Observable Plot

**What it is:** Grammar-of-graphics layer from D3’s maintainers — declarative `Plot.plot({ marks: [...] })`.

**Pros:** Excellent for **reports, blog, static HTML**; minimal code for dot/line/area/rule marks; clean defaults closer to journalism than SaaS.

**Cons:** Returns a DOM node — awkward in React (ref + `useEffect`); theming to Illuminairy still manual; not ideal for animated funnel steps.

**Best for:** Batch-generated plan HTML, internal analysis notebooks, one-off research charts.

**Not for:** Primary Plan Builder step components with staged animation.

**References:** [Plot getting started](https://observablehq.com/plot/getting-started) · [Plot in React](https://observablehq.com/plot/getting-started#plot-in-react)

---

### Tier B — Situational / partial borrow

| Library | Consider for | Skip because |
|---------|--------------|--------------|
| **Layer Cake** (Svelte) | Architecture inspiration only | Wrong framework; idea of “layout component + slots for layers” maps well to React compound components |
| **Vega-Lite** | LLM-generated spec → SVG in tooling | JSON spec is not designer-friendly for brand polish |
| **ECharts** | CRM admin with 10k+ points | Canvas default look, large bundle, overkill for SAT |
| **Nivo** | Motion reference only | Pretty defaults ≠ observatory; large bundle; RSC friction |
| **Chart.ts** | SSR-first simple charts | Generic aesthetics; small ecosystem |

---

### Tier C — Do not adopt for customer surfaces

| Library | Why not |
|---------|---------|
| **Recharts** | Default look = startup dashboard; customizing to editorial serif system fights the API |
| **Tremor** | shadcn/SaaS dashboard opinion; zero-config = wrong brand |
| **react-chartjs-2** | Canvas, gamified feel, hard to match aurora stroke/fill |
| **MUI X Charts / Ant Design Charts** | Wrong design system entirely |
| **Plotly** | Scientific/3D; visual noise |
| **Victory** | RN parity not needed; heavy for our chart count |

---

## Editorial design patterns to steal (not code)

These are **pattern libraries** from journalism and editorial UI — use for layout and hierarchy, not npm packages.

### 1. Economist-style chart discipline

Source: [AECharts — Economist style](https://aecharts.com/blog/posts/how-to-create-charts-like-the-economist/)

| Pattern | Apply to Illuminairy |
|---------|---------------------|
| **Title = headline** | “Transitions cost her the most points” not “Skill breakdown” |
| **One chart, one message** | Split horizon path from ledger rank — never one widget doing both |
| **Direct labeling** | Score at path endpoints; +52 on the row — no legend box |
| **Minimal grid** | Dashed goal line only; no y-axis wall of ticks |
| **One accent color** | Forest or aurora for the active series; context at 30–50% opacity |
| **Source / footnote strip** | Mono caption under every graphic: “Diagnostic · Jun 17 · Results vary” |

Illuminairy twist: accent is **aurora gradient**, not Economist red.

---

### 2. Ledgerline editorial systems

Source: [Katagami — Ledgerline](https://katagami.ai/language/ledgerline-editorial-systems)

| Pattern | Apply to Illuminairy |
|---------|---------------------|
| **Paper ground, ink type** | Polar white + navy text — matches brand |
| **Rules as architecture** | Hairline borders between ledger rows, not card-in-card |
| **Tabular mono numbers** | Point values and week labels in DM Mono |
| **One dominant viz per screen** | Hero horizon OR ledger — not six equal widgets |
| **Caption block below chart** | Provenance + plain-language readout |

Maps directly to **Ledger rank** and **Stat strip**.

---

### 3. “Beyond the bar” change visuals

Sources: [Nightingale — beyond the bar](https://nightingaledvs.com/beyond-the-bar-alternative-methods-for-visualizing-two-points-of-change/) · [Domo — slope & dumbbell guides](https://www.domo.com/learn/charts/slope-chart)

| Chart type | SAT use case | Fits Observatory? |
|------------|--------------|-------------------|
| **Dumbbell (horizontal)** | Current score ↔ target on one row | **Yes** — alternative to two vertical bars; celestial dot + forest dot connected by hairline |
| **Slopegraph** | Diagnostic % → practice test % across 5–8 skills | **Maybe** — rank story, not magnitude; use if “what moved up” matters |
| **Small multiples** | RW vs Math tide readout side by side | **Yes** — two tide panels, same scale |
| **Dot plot / unit chart** | 98 questions as dots | **Yes** — our **Constellation field** |
| **Bump chart** | Rank of skills over multiple PTs | **Later** — needs 3+ time points |
| **Diverging bar** | Win/loss vs baseline | **No** — feels tutor-ad / alarm |

**Recommendation:** Prefer **dumbbell** over **grouped bars** for current-vs-target. Prefer **constellation/unit chart** over heatmap for per-question data.

---

### 4. Minimalist maximalism (2025 trend)

Sources: [Venngage 2025 trends](https://venngage.com/blog/graphic-design-trends/) · brand guide “observatory”

- Large serif number + lots of whitespace + **one** aurora accent (underline, arc, or marker).
- Motion on **one** element per graphic (path draw, underline width) — not everything bouncing.

---

### 5. Editorial UI systems (reference implementations)

| Project | Link | Borrow |
|---------|------|--------|
| **editorial-ui** (Tailwind) | [github.com/Liftof/editorial-ui](https://github.com/Liftof/editorial-ui) | Score bar as thin line; data table typography; staggered entrance |
| **AECharts** | Economist theming for ECharts | **Pattern only** — do not adopt ECharts for product |

---

## Mapping patterns → Observatory families

| Family | Primary pattern sources | Library help |
|--------|----------------------|--------------|
| **Horizon path** | Economist line + area restraint; logo arc | `d3-shape` curve + `d3-scale` |
| **Ledger rank** | Ledgerline table; NYT ranked list | Pure HTML/CSS |
| **Constellation field** | Unit chart / dot plot (Gapminder, NYT) | Pure HTML or SVG `<circle>` |
| **Tide readout** | Small multiples + inline bar (Economist lite grid) | CSS width % or `scaleLinear` |
| **Spectrum band** | Gradient band + marker (custom) | `d3-scale` for marker % |
| **Milestone ribbon** | Week cards on a ribbon (vs multi-row Gantt) | CSS grid |
| **Inset hero score** | Dark observatory panel (brand guide) | CSS gradient text |

---

## Next.js / RSC integration patterns

| Approach | When | Pattern |
|----------|------|---------|
| **Server-rendered SVG JSX** | Diagnostic PDF, email, static plan HTML | Pure functions `scorePathSvg(props)` → no client JS |
| **Client chart island** | Funnel animation, hover on constellation | `'use client'` + `dynamic(..., { ssr: false })` only if hydration issues |
| **Skeleton first** | Funnel steps | SSR prose + stat strip; chart island fills in |
| **Reduced motion** | All animated families | `matchMedia('prefers-reduced-motion')` → final state (Plot & visx docs agree) |

**Bundle budget target:** &lt;25 kB gzipped added for entire data-viz layer (excluding d3-scale/shape if tree-shaken).

---

## Suggested internal architecture (when you build)

```
components/data-viz/
  tokens.ts              # --data-* semantic colors (from spec)
  format.ts              # score, range, pp, signed delta formatters
  horizon-path.tsx       # Family 01
  ledger-rank.tsx        # Family 02
  constellation-field.tsx
  tide-readout.tsx
  spectrum-band.tsx
  milestone-ribbon.tsx
  stat-strip.tsx
  chart-caption.tsx      # footnote + source line
  use-reduced-motion.ts
```

**Compound component pattern** (inspired by Layer Cake, without Svelte):

```tsx
<HorizonPath data={...} ariaLabel="...">
  <HorizonPath.GoalLine value={1525} />
  <HorizonPath.Area />
  <HorizonPath.Line />
  <HorizonPath.Milestones />
</HorizonPath>
```

Keeps markup readable; children map to SVG layers.

---

## Inspiration gallery (browse, don’t clone)

| Source | What to look at |
|--------|-----------------|
| [The Economist Graphic Detail](https://www.economist.com/graphic-detail) | Titles, direct labels, sparse axes |
| [NYT Upshot](https://www.nytimes.com/section/upshot) | Unit charts, small multiples, narrative captions |
| [Financial Times Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary) | Chooser for chart type — use dumbbell/slope/dot strip, not marimekko |
| [Observable Plot gallery](https://observablehq.com/@observablehq/plot) | Mark combinations for static exports |
| [Visx gallery](https://visx.airbnb.tech/gallery) | Low-level shapes only — ignore demo styling |

---

## Decision matrix (quick reference)

| Need | First choice | Second choice |
|------|--------------|---------------|
| Custom horizon / constellation / ledger | React SVG/HTML | + d3-scale/shape |
| Animated funnel chart | Client React SVG | visx shape helpers |
| Printable plan HTML | Hand SVG in template | Observable Plot in build script |
| CRM sparkline (internal) | Tiny inline SVG | visx `@visx/shape` `LinePath` |
| “Just need a bar chart” for admin | Still custom editorial bar | Plot, not Recharts |
| 50k+ event analytics | Not SAT product | PostHog / ECharts in admin only |

---

## Anti-patterns (industry defaults that fail our brand)

| Common default | Why it fails | Observatory alternative |
|----------------|--------------|-------------------------|
| Chart.js doughnut | Gamified % ring | Tide readout or serif stat |
| Recharts `<BarChart>` twin bars | Tutor comparison trope | Dumbbell or ledger |
| Red/green conditional formatting | Alarm dashboard | Celestial dim + copy |
| Heavy y-axis grid | Spreadsheet | One dashed goal line |
| Legend box top-right | Wastes space on mobile | Direct labels |
| 3D / drop shadow bars | 2010 edtech | Flat paper card + aurora top rule |
| Pie chart for skills | Angles lie | Ledger rank |

---

## Panel 7 — dumbbell vs two-point horizon

Mockup §7 in [`09-data-viz-directions.html`](../design/mockups/09-data-viz-directions.html) compares the same **1400 → ~1525** readout:

| Option | Emphasis | Best surface |
|--------|----------|--------------|
| **Dumbbell** | Gap size (+125) | Funnel interstitial, narrow column |
| **Horizon (2-point)** | Forward path, aurora arc | LP hero, plan card header |
| **Full horizon (§1)** | Milestones + PT weeks | Personalized plan reveal |

---

## Recommended next steps

1. **React to mockup board** — pick/combine families; **pick dumbbell vs horizon** for current → target (`09-data-viz-directions.html` §7).
2. **Spike one component** — e.g. `<HorizonPath />` with `d3-scale` + plain SVG, no visx yet.
3. **Add formatters** — `formatScore`, `formatRange`, `formatPointDelta` in `lib/data-viz-format.ts`.
4. **Pilot surface** — plan reveal (`v1`) or SOHA plan HTML first; funnel last (mobile constraints).
5. **Defer npm installs** until spike proves D3 math is worth it vs inline math for 4–8 points.

---

## Sources

- [Web Data Visualization Libraries 2026 — deep dive](https://www.youngju.dev/blog/culture/2026-05-14-data-visualization-libraries-2026-d3-plot-visx-recharts-echarts-vega-comparison-deep-dive-2026.en)
- [LogRocket — Best React chart libraries 2026](https://blog.logrocket.com/best-react-chart-libraries-2026/)
- [Observable Plot — getting started](https://observablehq.com/plot/getting-started)
- [Visx v4 release](https://github.com/airbnb/visx/releases/tag/v4.0.0)
- [Economist-style charts](https://aecharts.com/blog/posts/how-to-create-charts-like-the-economist/)
- [Nightingale — beyond the bar](https://nightingaledvs.com/beyond-the-bar-alternative-methods-for-visualizing-two-points-of-change/)
- [Ledgerline editorial systems](https://katagami.ai/language/ledgerline-editorial-systems)

---

*Contact: brianna@illuminairy.com*
