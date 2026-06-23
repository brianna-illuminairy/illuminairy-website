# SAT visualization ideation matrix

*June 2026 · explore encodings before building anything in code*

**This is the phase you are in.** Not implementation. Not reskinning SOHA.

| Artifact | Purpose |
|----------|---------|
| **[10-sat-viz-ideation-matrix.html](../design/mockups/10-sat-viz-ideation-matrix.html)** | Visual board — many encodings per SAT data type |
| [09-data-viz-directions.html](../design/mockups/09-data-viz-directions.html) | Six *style directions* on a few chosen types (narrow) |
| `/design/data-viz` (Next.js) | **Implementation scratchpad** — rough, overflow-prone; not the ideation source of truth |

---

## Honest reset

### What Visx is (and is not)

| | |
|--|--|
| **Visx** | React wrappers for D3 **primitives** — scales, paths, circles. You still choose the chart type and design every mark. |
| **Not Visx** | A chart gallery like Observable Plot defaults, Recharts, or Tableau. There is no “SAT ranked skills chart” component. |
| **Implication** | Pick the **encoding** first (lollipop vs treemap vs slopegraph). *Then* decide if Visx, plain SVG, or HTML is the best renderer. |

### What we accidentally did

The `/design/data-viz` gallery and most `components/data-viz/*` files **mapped 1:1 to what you already show**:

| Your existing surface | What we rebuilt |
|----------------------|-----------------|
| SOHA question performance grid | `VisxQuestionMap` (same unit matrix) |
| SOHA RW/Math priority list | `LedgerRank` / `VisxSkillLollipop` (same ranked list) |
| SOHA difficulty % readout | `VisxTideReadout` (same E/M/H percentages) |
| Plan reveal score projection | `VisxHorizonPath` (same line path) |
| Current vs goal bars | `VisxScoreDumbbell` (same two-point comparison) |
| Plan schedule Gantt | `MilestoneRibbon` (same week × skill grid) |

That is **visual refresh**, not **visualization ideation**. Different typography and aurora strokes do not change the encoding.

### What ideation means here

For each **SAT data entity**, list **8–15 distinct encodings** from the visual vocabulary (FT, Data Viz Project, Nightingale). Sketch them. Compare. **Then** narrow to 1–2 winners per parent question.

---

## Parent questions (the rows of the matrix)

Every encoding must answer **one** of these:

1. **Where is she today?** (score / range / section split)
2. **Where does she need to be?** (goal / gap)
3. **What is blocking the score?** (ranked skills, magnitude)
4. **What did the test show?** (98 items, misses, difficulty)
5. **Is the plan plausible?** (effort, time, checkpoints, achievability)
6. **What changes over time?** (diagnostic → PT → test day)

---

## Ideation matrix (encoding options)

**Status key:** ✅ in product today · 🎨 in 09 mockup / Visx prototype · 💡 explore · ⛔ likely wrong for brand

### A · Total score & range

*Data: 1380–1430, section bands, adaptive uncertainty*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Serif hero number** (no chart) | Today | ✅ SOHA hero | Often enough alone |
| **Interval band** on a number line | Today | 💡 | Range as shaded segment, point = best estimate |
| **Bullet chart** | Today vs goal | 💡 | Marker in “competitive band” — not speedometer |
| **Dumbbell** (current ↔ goal) | Gap | 🎨 | Two endpoints, one connector |
| **Twin vertical bars** | Gap | ✅ funnel legacy | ⛔ reads edtech / tutor ad |
| **Gap arc** (logo arc metaphor) | Gap | 💡 | Curved bridge, not horizontal bar |
| **Split florence** (two thin bars sharing baseline) | Section split | 💡 | RW vs Math without heavy bars |
| **Small multiples** (RW card + Math card) | Today | 💡 | Two inset panels, same scale |
| **Radial gauge / speedometer** | Today | ⛔ | Banned — implies single truth |
| **3D column** | Any | ⛔ | |

---

### B · Score trajectory over weeks

*Data: start → PT checkpoints → test day; phased pts/week (25 → 15 → 5)*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Monotone line + area** | Plausible | 🎨 Horizon path | Standard; risk = stock chart |
| **Step chart** (plateaus at phase breaks) | Plausible | 💡 | **Honest to gain model** — wk 7, 13 breaks |
| **Range band / cone** | Plausible | 💡 | Low–high envelope widening toward test |
| **Milestone-only timeline** (no line) | Plausible | 💡 | Icons + scores at PT dates only |
| **Slopegraph** (2 dates only) | Over time | 💡 | Start score left, goal right, one line |
| **Candlestick-style** (PT range) | Over time | 💡 | If PT reports min/max section scores |
| **Waterfall by week** | Plausible | 💡 | +25, +25… stacked — finance vibe, use carefully |
| **Bump chart** | Over time | 💡 | Needs 3+ PTs — skill *rank* change |
| **Animated stock ticker** | — | ⛔ | |
| **Gantt as score** | — | ⛔ | Wrong metaphor |

---

### C · Ranked skills & recoverable points

*Data: 5–7 skills, modeled +N, rank order*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Numbered ledger table** | Blocking | ✅ SOHA priority | Editorial; magnitude in serif column |
| **Horizontal bar chart** | Blocking | ✅ legacy | ⛔ default edtech |
| **Lollipop / dot plot** | Blocking | 🎨 | Magnitude on x, name on y |
| **Dumbbell per skill** (diag → PT accuracy) | Over time | 💡 | When “did tutoring move this skill?” |
| **Slopegraph** (5 skills, 2 time points) | Over time | 💡 | Rank or % correct change |
| **Treemap** | Blocking | 💡 | Area = points — shows “most of gap is top 2” |
| **Packed bubbles** | Blocking | 💡 | Radius ∝ points — risk: bubble lie |
| **Marimekko** | Blocking | 💡 | Width = section share, height = points — dense |
| **Waffle / icon array** | Blocking | 💡 | “5 of 100 skills drive most movement” |
| **Stacked block tower** | Gap decomposition | 💡 | Vertical blocks summing to gap |
| **Sankey** (misses → skills → pts) | Blocking | 💡 | Shows *why* rank — links miss table to points |
| **Chord / network** | Blocking | 💡 | Skills co-occurring in misses — analyst view |
| **Card deck / priority stack** | Blocking | 💡 | Mobile: swipe rank 1 → 5 |
| **Radial bar / sunburst** | Blocking | ⛔ | Hard to read skill names |
| **Pie / donut** | Blocking | ⛔ | Angles lie |

---

### D · 98 questions & incorrect answers

*Data: per-item correct/miss, E/M/H, module, skill tag*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Module strip grid** (cells Q1–Q27) | Test showed | ✅ SOHA map | Familiar; easy to overflow mobile |
| **Constellation field** (scattered dots, miss = glow) | Test showed | 🎨 09 mockup | Same data, less spreadsheet |
| **Icon array 10×10** (98 icons, 13 highlighted) | Test showed | 💡 | Part-to-whole without grid index |
| **Histogram of miss positions** | Test showed | 💡 | “Clump at end of M2?” — pattern without Q# |
| **Strip plot** (one row per module, tick = miss) | Test showed | 💡 | Compact; loses question number unless labeled |
| **Small multiples** (4 module panels) | Test showed | 💡 | Compare M1 vs M2 density |
| **Heatmap** (skill × difficulty) | Test showed | 💡 | Aggregate, not item-level |
| **Alluvial** (miss → skill bucket) | Test showed | 💡 | Flow from items to skill tags |
| **Calendar / github grid** | — | ⛔ | Wrong metaphor |
| **Red/green cell grid** | Test showed | ✅ legacy | ⛔ traffic light — retiring |
| **Spark strip** (only misses, ordered) | Test showed | 💡 | 13 ticks — minimal |

---

### E · Accuracy by difficulty (E / M / H)

*Data: % correct per band, RW vs Math*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Three big % + underline bar** | Test showed | 🎨 Tide readout | Small multiples |
| **Grouped vertical bars** | Test showed | ✅ legacy | ⛔ dashboard |
| **Dot plot** (one dot per band, shared axis) | Test showed | 💡 | Compare RW vs Math on one axis |
| **Dumbbell** (diag % ↔ PT %) | Over time | 💡 | Per band or per section |
| **Slopegraph** (E/M/H as rows) | Over time | 💡 | All three bands, two columns |
| **Radar / spider** | Test showed | ⛔ | Overstates shape |
| **Traffic-light cells** | Test showed | ✅ legacy | ⛔ retiring |
| **Prose only** + one number | Test showed | 💡 | Sometimes chart is overkill |

---

### F · Gap decomposition (“does +52 + +48 = +125?”)

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Stacked horizontal bar** (current → goal) | Gap | 🎨 Gap bridge | Segments = skills |
| **Waterfall** | Gap | 💡 | Step columns — finance |
| **Treemap to goal** | Gap | 💡 | Nested: gap → skills → remainder |
| **Equation typography** | Gap | 💡 | `1400 + 52 + 48 + … ≈ 1525` — no chart |
| **Waffle** (125 squares = 125 pts) | Gap | 💡 | Theatrical; may help skeptics |
| **Sankey** (gap ← skills) | Gap | 💡 | Flow into goal node |

---

### G · Schedule & effort (weeks, PT, pts/week)

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Gantt** (rows = skills) | Plausible | ✅ plan.html | PM software vibe |
| **Milestone ribbon** (week cards) | Plausible | 🎨 | Exploring vs Gantt |
| **Linear timeline** (horizontal, pins only) | Plausible | 💡 | PT + test day, no skill rows |
| **Calendar strip** | Plausible | 💡 | Aug test date anchored |
| **Phase ladder** (wk 1–6 / 7–12 / 13+) | Plausible | 💡 | Matches gain model phases |
| **Kanban columns** | Plausible | 💡 | To do / in progress / PT — internal? |

---

### H · Goal achievability & effort tier

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Spectrum band + marker** | Plausible | 🎨 | Conservative → stretch |
| **Tier cards** (pick one) | Plausible | 💡 | No continuous band |
| **Likelihood gauge** | Plausible | ✅ funnel | ⛔ if reads as guarantee |
| **Stat strip only** (+125, 66 days, ~14/wk) | Plausible | 🎨 | Chart optional |
| **Scenario table** | Plausible | 💡 | Rows = tiers, cols = pts/wk / outcome |

---

### I · Adaptive routing & “easy misses hurt”

*Often prose, not chart*

| Encoding | Parent Q | Status | Notes |
|----------|----------|--------|-------|
| **Callout + 2 highlighted cells on map** | Test showed | 💡 | M1 E/M misses annotated |
| **Before/after module difficulty** | Test showed | 💡 | M1 accuracy → implied M2 cap |
| **Flow: M1 misses → easier M2** | Test showed | 💡 | Mini sankey, 3 nodes |
| **Separate routing chart** | — | ⛔ | Usually overkill |

---

## How to use this matrix

1. **Open** [10-sat-viz-ideation-matrix.html](../design/mockups/10-sat-viz-ideation-matrix.html) in a browser (no dev server).
2. **Per row**, mark favorites (mentally or in Figma) — aim for **different** encodings, not six variants of a bar chart.
3. **Shortlist** max **2 encodings per parent question** for static mockups (phase 1).
4. **Only then** prototype in code — with proper responsive layout (`viewBox`, overflow, mobile column).
5. **Deprioritize** `/design/data-viz` until winners are chosen; treat it as throwaway engineering.

---

## Recommended explorations (opinionated starting points)

These are **not locked** — they are where to spend sketch time if you want genuinely new visuals:

| Parent question | Try first (unfamiliar) | Keep as fallback |
|-----------------|------------------------|------------------|
| Ranked skills | **Sankey** (misses → skills → pts) or **treemap** | Ledger |
| 98 questions | **Constellation** or **icon array** | Strip plot |
| Trajectory | **Step chart** with phase breaks | Horizon line |
| Gap | **Equation typography** or **waffle** | Dumbbell |
| Accuracy | **Slopegraph** (diag → PT) | Tide readout |
| Schedule | **Phase ladder** | Milestone ribbon |

---

## Responsive & interaction (after encoding is chosen)

Ideation first. Then:

- **Mobile:** prefer vertical encodings (ledger, step chart, phase ladder) over wide lollipops and 9-column ribbons.
- **Interaction:** detail rail below chart; never required to read headline numbers.
- **Library:** Visx only if the winning sketch needs curves/scales; many winners may be **HTML + CSS** (ledger, equation, phase ladder).

---

## Related docs

- [data-visualization.md](data-visualization.md) — Observatory tone & palette
- [data-visualization-research.md](data-visualization-research.md) — library landscape
- [data-visualization-sat-model.md](data-visualization-sat-model.md) — entity mapping (implementation-oriented; read *after* ideation)

---

*Contact: brianna@illuminairy.com*
