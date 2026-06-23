# SAT data → visualization model (Visx)

*June 2026 · how to communicate scores, gaps, accuracy, and misses*

**Companion docs:** [data-visualization.md](data-visualization.md) · [data-visualization-research.md](data-visualization-research.md)  
**Components:** `components/data-viz/` · **Gallery:** `/design/data-viz` (local)

---

## Core insight

Parents do not want a **dashboard**. They want answers to five questions:

1. **Where is she today?** (score / range)
2. **Where does she need to be?** (goal / gap)
3. **What is blocking the score?** (ranked skills, not “weak areas” fluff)
4. **What did the test actually show?** (misses, difficulty, routing risk)
5. **Is the plan plausible?** (effort, time, checkpoints)

Every graphic should map to **one** of these. Visx handles the **measurable** ones; prose handles **why** she missed Q18.

---

## How the SAT actually produces numbers (read this before picking a chart)

The SAT is not one number. It is a **stack of compressions**:

```
98 items (adaptive, 2 modules × 2 sections)
    ↓ miss patterns grouped by College Board skill tags
~200 tagged skills (Khan breadth — not what parents need)
    ↓ diagnostic ranks by mistake frequency × difficulty × section weight
5–7 highest-impact skills (what tutoring targets)
    ↓ modeled point allocation (weights 28/24/20/16/12 or diagnostic-derived)
Recoverable points per skill (illustrative until Skill Diagnostic)
    ↓ summed, capped, phased over weeks
Projected score path (typical, not guaranteed)
```

**Design rule:** never skip a layer without labeling it. A lollipop of “+52 Transitions” is meaningless if the parent still thinks the problem is “SAT in general.” The question map and accuracy readout **earn the right** to show ranked points.

### Three layers we visualize

| Layer | What it is | Parent mental model | Best Visx family |
|-------|------------|---------------------|------------------|
| **Item** | Q1–Q98, correct/miss, E/M/H | “Show me the test” | `VisxQuestionMap` |
| **Skill** | Transitions, factoring, boundaries… | “What should we fix first?” | `VisxSkillLollipop`, `LedgerRank` |
| **Score** | 1400, 1525, +125 gap, path | “Will she get there?” | `VisxScoreDumbbell`, `VisxHorizonPath`, `VisxGapBridge` |

Accuracy sits **between item and skill**: it is aggregated item outcomes by difficulty band, and it explains *why* a strong total score can still hide routing risk.

---

## Gaps: four different “gaps” (do not conflate)

Parents say “gap.” We mean one of four things:

| Gap type | Definition | Example | Chart |
|----------|------------|---------|-------|
| **Score gap** | `goal − current` | 1525 − 1400 = **+125** | `VisxScoreDumbbell` |
| **Recoverable gap** | Sum of modeled pts from ranked skills | Top 5 ≈ **171 modeled** (cap to score gap) | `VisxSkillLollipop` + footnote |
| **Decomposed gap** | Score gap split across top skills + remainder | Transitions 52 + Factoring 48 + … + polish | `VisxGapBridge` |
| **Routing gap** | Easy/med misses in M1 that cap M2 difficulty | RW M1: Q22 **E**, Q18 **M** | Prose callout on `VisxQuestionMap`, not a bar |

**Critical honesty:** recoverable points **often exceed** score gap on paper because skills overlap and not every miss converts 1:1 to scaled score. The bridge **scales segments to fit** the score gap when needed (`sohaGapBridgeSegments` in `lib/data-viz/adapters/soha-diagnostic.ts`). Caption: “Modeled recoverable · segments scaled to goal gap · Results vary.”

**Never show:** a bridge where segments sum to goal with no remainder and no footnote. That reads as a guarantee.

---

## Incorrect answers: what to show vs what to say

Each miss carries:

- **Question number** (within module)
- **Difficulty** (E / M / H — operational, not psychometric IQ)
- **Skill tag** (Transitions, factor theorem…)
- **Error type** (wrong answer vs blank vs mis-bubble — usually wrong answer)

### Question map encoding (`VisxQuestionMap`)

| State | Visual | Visx |
|-------|--------|------|
| Correct | Open circle, aurora stroke | `circle` fill `surface`, stroke `aurora` |
| Miss | Soft fill, accent stroke, **E/M/H label inside** | fill `rgba(accent, 0.22)` |
| Module break | Row label + new `scaleBand` row | nested `Group` per module |

**Why circles, not squares:** constellation field metaphor from `docs/data-visualization.md` — calm, not spreadsheet. **Why E/M/H only on misses:** correct cells do not need difficulty; misses do.

### What the map does *not* do

- Does not show **answer choices** (table does)
- Does not size by **point value per question** (misleading — adaptive weighting is opaque to parents)
- Does not use **red** for misses

### Routing story (prose + map annotation)

Adaptive SAT: misses on **easy/medium** in Module 1 can route to an easier Module 2, which **caps** upside even if Module 2 accuracy looks fine.

**Pattern to call out in copy** (Soha RW): M1 has **E + M** misses → worth one sentence under the map. Do not build a separate “routing chart” unless A/B testing shows parents need it.

---

## Accuracy: percentage vs pattern

`DIFFICULTY_READOUT` shape: per section, **% correct** on easy / medium / hard items attempted.

| Reading | Parent takeaway | Chart |
|---------|-----------------|-------|
| Math easy **100%**, hard **73%** | Strong foundation; upside is hard items | `VisxTideReadout` Math panel |
| RW all bands **~87%** | Consistent but not perfect; misses spread | Tide RW panel |
| Hard ≈ medium << easy | Classic “hard questions cost” | Highlight hard band in copy |

**Visx:** `VisxTideReadout` uses `scaleBand` (E/M/H) × `scaleLinear` (0–100) per section small multiple. Serif number, gradient underline — magnitude without traffic lights.

**Comparing two time points** (diagnostic → practice test): use **dumbbell** or future `VisxAccuracySlope` — two dots per band, connector line. Copy must say **percentage points (pp)**: “Hard RW: 71% → 89% (+18 pp).”

**Do not:** donut chart, pie, red/yellow/green cells (`pctClass` in legacy `diagnostic-visuals.tsx` is exactly what we are replacing).

---

## Ranked points: where the numbers come from

Ranked recoverable points are **not** SAT official data. They are a **model**:

1. Collect misses from diagnostic tables (`RW_MISS_TABLE`, `MATH_MISS_TABLE`)
2. Group by skill tag
3. Weight by difficulty and frequency
4. Allocate share of plausible gain using rank weights (`growth/score-path-gain-model.md`: 28/24/20/16/12 for top 5 illustrative)
5. Label **modeled** until Skill Diagnostic on real items

### Why lollipop (`VisxSkillLollipop`)

| Alternative | Problem | Lollipop wins because |
|-------------|---------|----------------------|
| Horizontal bar race | Feels like SaaS analytics / tutor ad | Thin rule + dot = editorial “forest plot” |
| Ordered table only | No magnitude comparison at a glance | x-axis encodes pts |
| Bubble chart | Area distorts | length ∝ points, one dimension |
| Pie | Angles lie | banned |

**Visx marks:** `scaleBand` on **y** (skill id), `scaleLinear` on **x** (0 → max pts), `@visx/shape` `Line` for stem, `circle` for dot, `@visx/grid` `GridColumns` for faint x reference.

**Label placement:** skill name **left** of y-axis gutter (outside plot); **+N** **right** of dot in serif (`formatSignedDelta`).

**Top N:** show **5–7** rows. Footer: “Already strong · {skills}” — names what we are *not* drilling (positive framing).

### Gap bridge stacks lollipop into one story

After parents see **rank**, they ask: “Does +52 + +48 + … actually equal +125?”

`VisxGapBridge`:
- x-axis: `scaleLinear` from `current` to `target`
- Background: full gap bar (`dim`)
- Foreground: `Bar` segments proportional to segment.points / gap
- Remainder label: “Other / polish · ~+N modeled”

Segment colors: aurora gradient family (`SEGMENT_FILLS` in component), not rainbow.

---

## Recommended narrative order (parent-facing pages)

### Skill Diagnostic report (post-proctored test)

1. **Hero range** — HTML serif, not Visx (1380–1430)
2. **Question map** — “what the test showed” (`VisxQuestionMap`)
3. **Accuracy tide** — “pattern by difficulty” (`VisxTideReadout`)
4. **Miss table** — HTML (topic, correct vs marked)
5. **Ranked lollipop** — “what to work first” (`VisxSkillLollipop`)
6. **Prose patterns** — routing, timing, careless vs concept

### Plan reveal (`v1`) — illustrative until diagnostic

1. **Dumbbell OR horizon** — pick one hero (gap vs path)
2. **Spectrum + stat strip** — achievability
3. **Lollipop OR ledger** — ranked skills (same data, different density)
4. **Optional bridge** — if gap skepticism is high
5. **Milestone ribbon** — schedule (exploring vs Gantt)

### Weekly parent email

1. Accuracy dumbbell (one section, one band) OR top skill row highlighted
2. Next PT pin from ribbon excerpt

---

## Data transform recipes (SSOT → Visx props)

| Source | Transform | Output type | Adapter |
|--------|-----------|-------------|---------|
| `RW_PRIORITY`, `MATH_PRIORITY` | parse pts, merge, sort, slice | `SatSkillImpact[]` | `sohaRankedSkills()` |
| ranked skills + current/target | scale segments to fit gap | `SatGapBridgeSegment[]` | `sohaGapBridgeSegments()` |
| `QUESTION_MAP` | strip summary fields | `SatQuestionSection[]` | `sohaQuestionMap()` |
| `DIFFICULTY_READOUT` | map easy/med/hard → bands | `SatAccuracySection[]` | `sohaAccuracyReadout()` |
| `score-path-gain.ts` | weekly phases | horizon points | funnel-specific builder |
| quiz answers q2/q8 | current/target | dumbbell props | plan reveal builder |

Types: `lib/data-viz/sat-types.ts`  
Sample adapter: `lib/data-viz/adapters/soha-diagnostic.ts`  
Gallery: `/design/data-viz` wires all three new Visx charts with Soha data.

---

## Visx library: which primitive for which SAT question

| Parent question | Visx packages | Scales | Shape |
|-----------------|---------------|--------|-------|
| “How far?” | scale, shape, gradient, responsive | `scaleLinear` | Line + circle dumbbell |
| “What path?” | + curve, grid, gradient | `scalePoint`, `scaleLinear` | `LinePath`, `AreaClosed` |
| “Rank skills” | scale, shape, grid, group | `scaleBand` (y), `scaleLinear` (x) | Line, circle |
| “Gap add up?” | scale, shape, group | `scaleLinear` (x) | `Bar` stacked |
| “98 questions” | scale, group | nested `scaleBand` | `circle` + `text` |
| “Accuracy E/M/H” | scale, shape | `scaleBand`, `scaleLinear` | rect underline |

**Always:** `@visx/responsive` `ParentSize` — SAT parents read on phone after the diagnostic email.

**Later:** `@visx/annotation` for callouts on question map (routing arrow to M1 misses); `@visx/motion` for staggered lollipop draw — guard with `prefers-reduced-motion`.

---

## SAT entity catalog

| Entity | Example | Unit | Typical source |
|--------|---------|------|----------------|
| **Total score** | 1420 | 400–1600 | Diagnostic, PT |
| **Score range** | 1380–1430 | band | Diagnostic (adaptive uncertainty) |
| **Section score** | RW 680, Math 740 | 200–800 | Diagnostic |
| **Goal score** | 1525 | 400–1600 | Strategy call + plan |
| **Score gap** | +125 | points | goal − current |
| **Recoverable points (skill)** | Transitions +52 | points (modeled) | Diagnostic miss analysis |
| **Skill rank** | 1–7 | ordinal | Impact sort |
| **Question outcome** | Q18 missed | boolean | Item-level |
| **Miss difficulty** | E / M / H | category | Per miss |
| **Accuracy (band)** | 82% medium RW | 0–100% | Aggregated misses |
| **Accuracy delta** | 67% → 89% | pp | Diagnostic vs practice |
| **Module routing risk** | 4 easy/med misses M1 | count / prose | Adaptive SAT mechanic |
| **Pts / week (plan)** | ~14 | points/week | Plan model |
| **Week milestone** | Wk 4 PT | week index | Schedule |

**Illustrative vs measured:** Ranked skill points and projections are **modeled** until Skill Diagnostic confirms. Label them. Footnote **Results vary.**

---

## Entity → parent question → Visx pattern

### Scores & trajectory

| Entity | Parent question | Visx pattern | Component |
|--------|-----------------|--------------|-----------|
| Score over time | “Where is she headed?” | `LinePath` + `AreaClosed`, `curveMonotoneX`, `scalePoint` on weeks | `VisxHorizonPath` |
| Current ↔ goal (2 points) | “How far is the gap?” | `scaleLinear` + dumbbell marks | `VisxScoreDumbbell` |
| Goal effort | “Is this realistic?” | Band + marker, `scaleLinear` 0–1 | `VisxSpectrumBand` |

**Avoid:** twin vertical bars, speedometer gauges, 3D columns.

---

### Gap & ranked impact (the product story)

| Entity | Parent question | Visx pattern | Component |
|--------|-----------------|--------------|-----------|
| **Ranked recoverable pts** | “What should we work on first?” | **Lollipop chart** — `scaleBand` (skill) × `scaleLinear` (pts); forest dots; thin rules | `VisxSkillLollipop` |
| **Gap decomposition** | “Does the gap add up?” | **Goal bridge** — horizontal bar from `current` to `target`; stacked segments = top skills; remainder = “other / polish” | `VisxGapBridge` |
| **Top 5 vs rest** | “Is it really 5–6 skills?” | Bridge shows 5 segments + gray tail; caption: “200+ skills on the SAT; movement usually concentrates here” | same |

**Why lollipop over horizontal bar race:** Same magnitude encoding, less “analytics dashboard.” Dots align to a baseline; labels sit left (skill) right (pts) like FT Visual Vocabulary **dot strip**.

**Why gap bridge over waterfall:** Waterfall screams finance. Bridge reads as “these blocks close the distance to goal” without red/green step columns.

**Visx marks:** `@visx/shape` `Bar` / `BarStackHorizontal`, `@visx/scale` `scaleLinear`, `@visx/group`, optional `@visx/text`.

---

### Accuracy & difficulty

| Entity | Parent question | Visx pattern | Component |
|--------|-----------------|--------------|-----------|
| **Accuracy by E/M/H** | “Is she solid on hard questions?” | **Small multiples** — two panels (RW, Math); serif % + gradient underline (`scaleLinear` 0–100) | `VisxTideReadout` |
| **Diagnostic → practice** | “Is tutoring moving accuracy?” | **Dumbbell or slope** per skill or section — two time points only | extend `VisxScoreDumbbell` or `VisxAccuracySlope` |
| **Section split** | “Which section is weaker?” | **Dumbbell** RW vs Math section scores, or paired stat strip | `VisxScoreDumbbell` |

**Avoid:** traffic-light red/yellow/green; donut “78%”; pie charts.

**Copy:** Say **percentage points (pp)** when comparing two percentages: “67% → 89% (+22 pp).”

---

### Question-level & misses

| Entity | Parent question | Visx pattern | Component |
|--------|-----------------|--------------|-----------|
| **98-question map** | “What did she miss?” | **Unit matrix** — `scaleBand` per module row; circle marks; miss = celestial fill | `VisxQuestionMap` |
| **Miss difficulty mix** | “Are easy misses costing routing?” | **Stacked dot strip** or annotation on map + callout (prose for routing) | map + `ChartFrame` callout |
| **Miss detail table** | “Show me the question” | **HTML table** (not Visx) — topic, correct vs marked | portal table |

**Avoid:** heatmap grid with alarm colors; spreadsheet density without module breaks.

**Adaptive SAT note:** Module routing (easy/med misses → capped module 2) is often **one sentence + callout**, not a chart — unless you add a simple “M1 accuracy” inline stat.

---

### Schedule & effort

| Entity | Parent question | Visx pattern | Component |
|--------|-----------------|--------------|-----------|
| **Week × skill** | “What happens each week?” | **Milestone ribbon** (HTML/CSS grid) — exploring vs Gantt | `MilestoneRibbon` |
| **PT checkpoints** | “When do we rescore?” | Pins on ribbon | same |

---

## Page recipes (what to combine)

### Plan reveal (`v1`)

| Block | Components |
|-------|------------|
| Hero | `VisxHorizonPath` OR `VisxScoreDumbbell` (pick one) |
| Effort | `VisxSpectrumBand` + stat strip |
| Skills | `VisxSkillLollipop` OR `LedgerRank` |
| Gap sanity | `VisxGapBridge` (optional, below lollipop) |
| Footnote | Results vary · illustrative until Skill Diagnostic |

### Diagnostic report (parent)

| Block | Components |
|-------|------------|
| Hero range | navy inset + serif range (HTML) |
| Question map | `VisxQuestionMap` |
| Accuracy | `VisxTideReadout` |
| Miss table | HTML |
| Pattern cards | prose |

### Weekly parent email

| Block | Components |
|-------|------------|
| Accuracy delta | section dumbbell 67→89 |
| Skill focus | single lollipop row highlighted OR ledger top 1 |
| Next PT | milestone ribbon excerpt |

---

## Visx implementation notes

| Pattern | Packages | Key scales |
|---------|----------|------------|
| Horizon | shape, scale, curve, gradient, grid, responsive | `scalePoint`, `scaleLinear` |
| Dumbbell | shape, scale, gradient, responsive | `scaleLinear` |
| Tide | shape, scale, responsive | `scaleBand`, `scaleLinear` |
| Spectrum | shape, scale, responsive | `scaleLinear` |
| Lollipop | shape, scale, grid, responsive | `scaleBand` (y), `scaleLinear` (x) |
| Gap bridge | shape, scale, responsive | `scaleLinear` (x), stack offsets |
| Question map | shape, scale, group, responsive | nested `scaleBand` |

**Responsive:** always wrap in `@visx/responsive` `ParentSize`.  
**Accessibility:** `role="img"` + descriptive `ariaLabel` with numbers spoken aloud.  
**Animation (later):** stagger lollipop width 0→value; path draw — respect `prefers-reduced-motion`.

---

## Data shapes (TypeScript SSOT)

See `lib/data-viz/sat-types.ts` — import in funnel, SOHA, and plan builders.

---

## Anti-patterns (SAT-specific)

| Trap | Why | Instead |
|------|-----|---------|
| Compare to Khan / self-study bars | Tutor-ad | Illuminairy outcomes in prose + `lib/site.ts` |
| “Points leaking” language | Banned | “Skills they keep missing” |
| Implied guarantee on bridge sum | Legal | “Modeled recoverable · Results vary” |
| 20-skill bar chart | Cram sheet | Top 5–7 lollipop + “already strong” footer |
| Full 98-Q red grid | Anxiety | Constellation soft misses |
| Gantt schedule | PM software | Milestone ribbon |

---

## Next components to build

- [x] `VisxHorizonPath`, `VisxScoreDumbbell`, `VisxTideReadout`, `VisxSpectrumBand`
- [x] `VisxSkillLollipop`, `VisxGapBridge`, `VisxQuestionMap`
- [x] Shared hover / detail rail (`useChartHover`, `ChartDetailRail`)
- [ ] `VisxAccuracySlope` (diagnostic vs PT, 2 points × N skills)
- [ ] Cross-chart link (lollipop row highlights ledger row)
- [ ] Wire plan reveal when approved

---

## Hover and interactivity

**Principle:** Interactivity reveals **detail parents do not need on first glance**. Headline numbers stay visible without hover. No bouncing tooltips, no chartjunk animation, no red hover states.

### Pattern: detail rail (not cursor tooltip)

We use a **fixed caption strip** below the plot (`ChartDetailRail`), not a floating black box that follows the mouse. Reads like NYT/Economist annotation: calm, legible on mobile, no layout shift from tooltip overflow.

| Input | Behavior |
|-------|----------|
| **Desktop** (fine pointer + hover) | `mouseenter` sets active item; `mouseleave` on chart clears |
| **Touch** (`pointer: coarse`) | Tap **pins** item; tap again or tap away clears |
| **Keyboard** | Focusable hit targets (`tabIndex={0}`); `focus-visible` ring |

SSOT: `lib/data-viz/use-chart-hover.ts`, `components/data-viz/chart-detail-rail.tsx`.

Pass `interactive={false}` to export static PNGs or email embeds.

### Per-chart interaction map

| Chart | Interactive targets | Default rail (idle) | Active rail reveals |
|-------|---------------------|---------------------|---------------------|
| **`VisxSkillLollipop`** | Each skill row (full-width hit rect) | “Hover or tap a skill…” | Skill name, section note, +N modeled |
| **`VisxQuestionMap`** | **Missed** cells only (28px hit circle) | “Hover or tap a missed question…” | Module, Q#, topic, E/M/H, marked vs correct |
| **`VisxTideReadout`** | Each E/M/H band | “Hover or tap a difficulty band…” | Section, %, definition |
| **`VisxGapBridge`** | Each colored segment | “Hover or tap a segment…” | Skill name, share of gap |
| **`VisxHorizonPath`** | Each checkpoint dot | “Hover or tap a checkpoint…” | Label, score, delta from start |
| **`VisxSpectrumBand`** | Each effort tier column | “Hover or tap a tier…” | Label, pts/wk, projected score |
| **`LedgerRank`** | Each row | Same as lollipop | Rank, note, points |
| **`MilestoneRibbon`** | Each week card | “Hover or tap a week…” | Skill, pts, PT pin if any |
| **`VisxScoreDumbbell`** | **None** | — | Already fully labeled (2 endpoints) |

### Visual feedback on hover

| Effect | Use |
|--------|-----|
| **Dim siblings** (opacity ~0.34) | Lollipop, horizon, tide, bridge, ribbon |
| **Emphasize active** (larger dot, thicker stroke, forest label) | All Visx marks |
| **Row/card background** | Ledger, ribbon (mint wash) |
| **No color meaning change** | Never red on hover; never traffic-light |

### What hover should not do

- Open modals or navigate away (detail rail only; table link is separate CTA)
- Animate path redraw on every mousemove (respect `prefers-reduced-motion`)
- Require hover to see **critical** numbers (gap, top skill, total score stay always visible)
- Work on correct question cells (98-Q map: only misses are tappable — reduces noise)

### Cross-highlighting (future)

When lollipop + ledger appear on the same page, hovering rank 1 should highlight both. Requires shared `hoverGroupId` context — not built yet.

### `@visx/tooltip`

Not used. Editorial detail rail + dim siblings matches observatory tone better than default Visx tooltip chrome. Revisit only if we need cursor-positioned annotations on desktop-only analyst views.

---

*Contact: brianna@illuminairy.com*
