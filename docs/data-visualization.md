# Illuminairy — Data visualization & infographics

*June 2026 · exploratory design system*

**Audience:** Brianna, designers, and anyone building SAT score reports, plan reveals, parent updates, or marketing infographics.

**Related:** [visual-identity.md](visual-identity.md) · [messaging-guide.md](messaging-guide.md) · brand guide v3 (`~/Downloads/illuminairy_brand_guide.html`)

**Mockup board (open locally):** [`design/mockups/09-data-viz-directions.html`](../design/mockups/09-data-viz-directions.html)

**Library & pattern research:** [data-visualization-research.md](data-visualization-research.md)

**Visx component gallery (local):** `npm run dev` → [/design/data-viz](http://localhost:3000/design/data-viz) · `components/data-viz/` · blocked on production.

---

## Why this doc exists

SAT work is full of numbers parents care about: total score, section ranges, accuracy by difficulty, skill priority, points recoverable, weeks to test. The **current product charts** (vertical bars, traffic-light cells, donut rings, cramped funnel SVGs) read like generic edtech or tutor ads. They are **not** the design target.

This document defines a **new, cohesive data language** drawn from the brand guide: observatory, constellation, editorial calm. Production code should adopt only what you sign off from the mockup board.

---

## North star

**One sentence:** *Data should feel like a calm reading in a modern observatory — guided, luminous, editorial — not a dashboard shouting at you.*

| Principle | Execute |
|-----------|---------|
| **Narrate, don't compete** | Show *their* path and *their* gaps. Avoid side-by-side bar fights (self-study vs us). |
| **Light by default** | Polar white `#F5F8FA`, paper cards, navy only for one hero readout or inset per view. |
| **Aurora as accent** | Celestial → aurora → glow for *one* emphasis line, fill, or arc per graphic. Never full rainbow charts. |
| **Serif for the number** | Source Serif 4 at display scale for scores and point totals. Hanken for labels. DM Mono for axis/footnotes. |
| **No alarm colors** | No tomato red, amber/yellow/green traffic lights, or "bad = red" cells. Use luminance, weight, and copy instead. |
| **Illustrative honesty** | Label modeled or estimated numbers. Pair outcome stats with "Results vary." |

---

## Semantic data palette

These sit *on top of* the brand palette. Use them consistently across every chart type.

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| **Ink** | `--data-ink` | `#121A2B` | Primary numbers, axis labels |
| **Muted** | `--data-muted` | `rgba(18,26,43,0.55)` | Secondary labels, grid lines |
| **Line** | `--data-line` | `rgba(18,26,43,0.08)` | Rules, baselines, card borders |
| **Surface** | `--data-surface` | `#FFFFFF` | Card fill |
| **Field** | `--data-field` | `#F5F8FA` | Page / inset background |
| **Emphasis** | `--data-em` | `#2F6E47` | Forest — target score, active tier, "on track" |
| **Accent** | `--data-accent` | `#0057A8` | Celestial — secondary series, links, markers |
| **Glow fill** | `--data-glow` | `rgba(184,245,209,0.35)` | Soft highlight band behind a range |
| **Aurora stroke** | `--data-aurora` | `#77C89A` | Path lines, arc under trajectory |
| **Dim** | `--data-dim` | `rgba(18,26,43,0.12)` | Missed items, inactive tiers, de-emphasized series |
| **Silver** | `--data-silver` | `#BCC3CC` | Tick marks, dashed goal lines |

**Gradient (one per graphic max):**

```css
linear-gradient(90deg, #0057A8 0%, #77C89A 55%, #B8F5D1 100%)
```

Use for: trajectory stroke, active tier band, top rule on hover card — not bar fills in a rainbow cluster.

**Do not use for data:** legacy tomato/coral, pure black `#000`, indigo/violet, gold (wordmark only), cream `#F5ECD9`.

---

## Typography for numbers

| Element | Font | Weight | Size (desktop) | Notes |
|---------|------|--------|----------------|-------|
| Hero score / range | Source Serif 4 | 600 | 48–72px | e.g. `1380–1430`, `+182` |
| Section stat | Source Serif 4 | 600 | 28–36px | Subscores, gap readout |
| Inline metric | Hanken Grotesk | 600 | 18–20px | Pts/week, days to test |
| Axis / footnote | DM Mono | 400 | 10–11px | Sentence case preferred; `Aug 22 · Wk 4` |
| Rank index | DM Mono | 400 | 11px | `01`, `02` — not giant badges |
| Body explanation | Hanken Grotesk | 400 | 15–16px | Always adjacent to the graphic |

**Formatting rules**

- SAT totals: no comma in 4-digit scores (`1380`, not `1,380`) in display type.
- Ranges: en dash with spaces (`670 – 690`) or tight (`670–690`) — pick one per surface and keep it.
- Point deltas: always signed (`+52`, `+14/wk`).
- Accuracy: `%` with no space (`89%`); say **percentage points** in copy when comparing two percentages (`67% → 89%` is `+22 pp`).
- Approximations: leading tilde on modeled values (`~1525`, `~+14/wk`).

---

## Chart families (new system)

Six families cover SAT parent/student data. Each has a **metaphor**, not a chart-type name in the UI.

### 1 · Horizon path — score over time

**Metaphor:** The logo arc — a path climbing toward a goal on the horizon.

**Shows:** Current score → milestones (practice tests, test day) → goal or range.

**Visual**

- Thin aurora stroke (2–2.5px), slight curve upward — not a steep stock chart.
- Soft glow fill under the path (15–25% opacity forest or aurora).
- Dashed silver line for stretch goal above modeled target.
- Dots at milestones; serif labels above/below, mono dates on the axis.
- Start and end scores in serif at the ends — no y-axis tick clutter.

**Avoid:** Vertical y-axis grid, area chart to the bottom edge, animating like a stock ticker.

---

### 2 · Ledger rank — skill priority by impact

**Metaphor:** An editorial table of contents — what to read first.

**Shows:** Ranked skills with estimated recoverable points.

**Visual**

- Numbered rows (`01`–`05` in mono).
- Skill name in Hanken semibold; one-line note in muted body.
- Point value right-aligned in serif (`+52`).
- Optional: thin aurora **dot leader** or hairline rule between name and points — not a horizontal bar race.
- "Already strong" and "Skipped" as muted footer rows, not gray bars.

**Avoid:** Horizontal bar chart with width = points; neon bar fills; more than 7 rows above the fold on mobile.

---

### 3 · Constellation field — question-level performance

**Metaphor:** A star field — each question is a point of light; misses are still visible but softer.

**Shows:** 98-question map, module groupings, difficulty on miss only.

**Visual**

- Small circles (8–10px) on a loose grid grouped by module.
- **Correct:** paper fill, aurora border, full opacity.
- **Miss:** celestial fill at 40% opacity, or hollow ring — **not red**.
- Miss difficulty as mono letter under the dot (`E` `M` `H`) only when space allows.
- Legend: "Bright = correct · Soft = missed" — not green/red swatches.

**Avoid:** Spreadsheet heatmap, checkbox grid, traffic-light cells.

---

### 4 · Tide readout — accuracy by difficulty

**Metaphor:** Tide levels on three shorelines — easy, medium, hard.

**Shows:** `%` correct per difficulty band, per section.

**Visual**

- Three columns per section (RW / Math).
- Large serif `%` centered.
- Thin horizontal **underline** below each % — width = value, stroke = aurora gradient — not a vertical bar.
- Section label in mono above the trio.
- Threshold copy in words, not color: "Solid" / "Watch" / "Focus here" — or skip labels and let the parent read the number.

**Avoid:** Red/yellow/green text classes; donut charts; ring progress.

---

### 5 · Spectrum band — goal effort / achievability

**Metaphor:** A band of aurora light; the student's plan is a marker on the spectrum.

**Shows:** Effort tiers (conservative → stretch), pts/week, implied score.

**Visual**

- Horizontal band with soft celestial-to-glow gradient background.
- Four tier labels below; active tier gets forest underline + serif score.
- Marker dot on the band for "This plan" — not pill buttons.
- Stat strip above: gap, days, pts/wk as **four serif numbers in a row** with mono captions.

**Avoid:** Segmented pill toggles that look like filters; implying guaranteed outcomes.

---

### 6 · Milestone ribbon — schedule / week plan

**Metaphor:** A timeline ribbon — one skill per week, milestones pinned.

**Shows:** 9-week plan, practice test weeks, test day.

**Visual**

- Single horizontal ribbon divided into equal week cells (mono `Wk 1` … `Wk 9`).
- One skill name per week in a **floating card** above its cell — not a Gantt bar spanning random columns.
- Milestones (PT 1, PT 2, test day) as small celestial pins below the ribbon.
- Point value as serif `+48` on the card, not inside a bar.
- PT weeks and test day can use a subtle glow highlight on the card — not a separate bar row.

**Early preference:** Milestone ribbon reads clearer than multi-row Gantt (`sg-row` / `sg-bar` in current plan HTML). Not final — keep exploring.

**Avoid:** Multi-row Gantt with competing bar lengths; rainbow row colors for RW vs Math.

---

### 7 · Current → target — dumbbell vs two-point horizon

**Metaphor:** Either the **distance** between two points (dumbbell) or the **arc** toward test day (horizon lite).

**Shows:** Today's score and goal score only — no PT milestones.

**Visual**

- **Dumbbell:** celestial dot (today) + forest dot (goal), aurora connector, serif `+125` centered on the line, faint 1100–1600 axis.
- **Two-point horizon:** same endpoints as §1 but no intermediate dots — curved stroke + soft fill, stretch goal as dashed silver line.

**Mockup:** side-by-side comparison in `09-data-viz-directions.html` §7.

**Choose dumbbell when:** funnel interstitial, narrow column, gap clarity matters most.

**Choose two-point horizon when:** LP hero or plan card header, aurora brand warmth matters most.

**Use full horizon (§1) when:** week 4 / week 8 practice tests appear on the same graphic.

**Avoid:** side-by-side vertical bars (current production pattern).

---

## Supporting patterns

### Stat strip

Four metrics in one row: serif value + mono label. Use above any large graphic. No icons unless necessary.

### Inset hero (one per page)

Optional navy-mid inset (`#1C2A42` → `#121A2B`) for **one** hero score range with glow gradient on the number. Rest of page stays polar white. Diagnostic report hero only — not full-page dark.

### Callout band

Left border 3px aurora + paper fill for "Area of concern" or "First-month checkpoint." Plain language title in mono. No warning icons.

### Footnotes

Always DM Mono 10px, muted: data source, illustrative label, "Results vary."

---

## Interactivity (hover and tap)

**Default pattern:** detail **rail** below the chart, not a cursor-following tooltip. Headline numbers stay visible without interaction.

| Surface | Hover / tap target | Rail shows |
|---------|-------------------|------------|
| Lollipop | Skill row | Note + modeled +N |
| Question map | Missed Q only | Topic, difficulty, marked vs correct |
| Tide readout | E / M / H band | Section + % + plain definition |
| Gap bridge | Segment | Skill + share of gap |
| Horizon | Checkpoint | Score + delta from start |
| Ledger / ribbon | Row / week card | Same as lollipop / schedule |

Desktop: hover to preview, leave to clear. Touch: tap to pin, tap again to dismiss. Keyboard: focusable targets with visible ring.

Dumbbell (2-point gap) stays **non-interactive** — fully labeled already.

Full spec: [data-visualization-sat-model.md](data-visualization-sat-model.md#hover-and-interactivity) · code: `useChartHover`, `ChartDetailRail`.

---

## Motion

| Element | Motion | Duration |
|---------|--------|----------|
| Horizon path | Stroke draw left → right | 800ms ease |
| Underline readout | Width 0 → value | 600ms, stagger 80ms per column |
| Constellation dots | Fade in module groups | 400ms stagger |
| Ledger rows | Fade + 4px rise | 300ms stagger 60ms |

Respect `prefers-reduced-motion`: show final state immediately.

---

## Copy rules (data-specific)

From [messaging-guide.md](messaging-guide.md) — apply inside charts and captions:

- Say **skills they keep missing**, not points leaking / cost points / biggest leaks.
- Say **improve** or **movement**, not gains / boost / score jump.
- No implied guarantees on projected scores or tiers.
- Outcome stats from `lib/site.ts` only; footnote **Results vary.**
- **Skill Diagnostic** and **SAT Score Path** — correct product names in chart titles.

---

## What we are retiring (do not extend)

These patterns exist in production today. **Do not treat them as reference** when building new visuals:

| Pattern | Why it fails brand |
|---------|-------------------|
| Vertical contrast bars (tomato vs green) | Tutor-ad comparison trope; harsh on light editorial pages |
| `%` donut / ring | Gamified; fights serif editorial tone |
| Red/amber/green accuracy cells | Alarm dashboard; parent anxiety |
| Cramped 320px funnel SVG charts | Illegible; doesn't use desktop space |
| Horizontal bar race (width = points) | Generic SaaS analytics |
| Dense question spreadsheet table | Cram-sheet energy |

---

## Choosing a family

| Parent question | Use |
|-----------------|-----|
| "Where is she headed by August?" | Horizon path |
| "What should we work on first?" | Ledger rank |
| "What did she miss on the test?" | Constellation field |
| "Is she solid on hard questions?" | Tide readout |
| "Is this goal realistic?" | Spectrum band |
| "What does the week-by-week plan look like?" | Milestone ribbon |
| "How far is she from the goal?" | Dumbbell **or** two-point horizon (§7) |

One primary graphic per screen. Supporting stat strip + prose below.

---

## Files & next steps

| Asset | Location |
|-------|----------|
| Direction mockups (7 panels + anti-patterns) | `design/mockups/09-data-viz-directions.html` |
| Brand palette | `design/mockups/01-brand-board-palette.html` |
| This spec | `docs/data-visualization.md` |

**Workflow:** React to mockup board → pick or combine families → then wire tokens into `app/aurora-brand.css` or a dedicated `app/aurora-data.css` → replace production charts surface by surface.

**Do not ship to production** until explicit sign-off.

---

*Contact: brianna@illuminairy.com*
