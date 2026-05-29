# SAT research — data-driven integration plan

**Status:** Draft for product/engineering review (May 2026)  
**Goal:** Replace mixed marketing stats with cited, role-appropriate numbers in quiz, Score Path, and assessment logic.

---

## Executive summary

We currently say **“built on College Board data from 250,000+ students”** in several places. That headline mostly comes from the **Khan Academy Official SAT Practice (OSP)** observational study — not from “retakers who don’t change approach gain +40.” Those are **different claims** and must not be merged in copy or charts.

**Recommended posture:**

1. **External benchmarks** — College Board growth/OSP/retake literature (with URLs + caveats).
2. **Internal outcomes** — Illuminairy n=95 completers (+182, 78% hit target) — always labeled internal.
3. **Illustrative** — group-class bar, edge-case defaults (+250/16wk/1100) — labeled modeled, not researched.
4. **Mechanism** — Bloom / mastery / 1:1 — explain *why* focused tutoring can beat self-study; don’t imply 2σ = +182 SAT points.

---

## Source library (verified)

### A. College Board + Khan — Official SAT Practice (OSP)

| Claim | Number | Source | Caveats |
|-------|--------|--------|---------|
| Sample (2017 press) | ~**250,000** PSAT→SAT test takers | [CB Newsroom, May 2017](https://newsroom.collegeboard.org/new-data-links-20-hours-personalized-official-sat-practice-khan-academy-115-point-average-score) | Observational; PSAT→SAT interval, not same-day retake |
| 20 hours OSP | **~115 pt** average gain (PSAT→SAT) | Same + [OSP Technical Report](https://research.collegeboard.org/media/pdf/osp-technical-report.pdf) | Not incremental vs counterfactual in raw press release; later reports control for PSAT |
| 6+ hours OSP (2019 cohort, controlled) | **+21 pts** vs non-users on first SAT | OSP Technical Report (class of 2019) | After controlling for PSAT; **+39** with “best practice” behaviors |
| 6–8 hours (2017 early adopters) | **+30 pts** incremental after removing typical growth | OSP Technical Report | 2017 ~250k “early adopter” cohort |
| Digital SAT — full-length tests in Bluebook | **+25.7 / +45.5 / +61.4** for 1 / 2 / 3+ FLTs vs none | [Digital SAT Practice Tests PDF, May 2025](https://research.collegeboard.org/media/pdf/DigitalSATPracticeTests_052025.pdf) | Regression-adjusted; association not RCT |

**Use in product:** Khan / self-study benchmark = **+21 to +61** depending on dose & behaviors — **not +25** (current quiz fiction).

---

### B. College Board — SAT Suite natural growth (not “prep effect”)

| Claim | Number | Source | Caveats |
|-------|--------|--------|---------|
| Typical section growth PSAT→SAT (many cohorts) | **~25–30 pts** per section (ERW/Math) | [Student-Level SAT Suite Growth Estimates](https://research.collegeboard.org/media/pdf/student-level-sat-suite-growth-estimates.pdf) | Expected growth for matched prior score; largest gains at low prior scores |
| Longer interval (fall→fall, spring→spring) | Higher than short spring→fall | Same | Timeline matters |

**Use in product:** Justifies **~25 pts/wk early phase** as *plausible upper band* when work is focused — but this is **year-scale growth**, not weekly literal. Weekly 25/15/5 is our **internal pacing model**, not a CB publication.

---

### C. College Board — retake / coaching (secondary sources — primary PDF TBD)

Widely cited in prep industry (Prep Expert, Manhattan Review, College Reality Check):

| Claim | Number | Attributed source | Our repo status |
|-------|--------|-------------------|-----------------|
| Retake average improvement | **~40 pts** composite | CB analysis of **2M+** test takers (Manhattan Review cites **2019**) | In `satRetakeResearch.avgPointsWithoutNewApproach = 40` — **no primary PDF in repo** |
| Retakers who improve | **~55–63%** | Same cluster of citations | Not in UI |
| Score drops on retake | **~35%** | Same | Defined in `site.ts`, unused |
| Retake with **no** new prep | **~10–20 pts** | Admissions consultants citing CB progression | Conflicts with flat +40 headline |
| Coaching association (2019 CB) | **~33 pts** higher with tutoring/books/courses | Manhattan Review → CB 2019 | Not in `site.ts` |
| 1996 CB coaching study | **~26 pts** | Manhattan Review | Not in repo |

**Action required:** Download and archive primary CB retake bulletin; until then, soften copy to **“published retake averages ~40 pts; many retake with little new prep (~10–20)”** with footnote “industry summaries of College Board retake research.”

**Do not** attribute the **250k** cohort to the +40 retake stat — that conflates OSP with retake baseline.

---

### D. Bloom / “two sigma”

| Claim | Source | SAT-specific? |
|-------|--------|---------------|
| 1:1 tutoring + mastery ≈ **2σ** vs classroom | Bloom, *Educational Researcher*, **1984** | **No** — academic mastery tests, small N lab studies |
| Modern replication | Meta-analyses ~**0.3–0.8σ** tutoring; VanLehn ITS ~0.79σ human tutoring | Not 2σ at scale |
| SAT coaching meta (Kalaian & Hedges 1996) | **~0.14 math / 0.12 verbal** effect sizes | ≈ **30 / 25 pts** rough |
| DerSimonian & Laird (HER 1983) | Matched/RCT coaching ≈ **10 pts** | “Too small to be practically important” in abstract — contested |
| Briggs / Buchmann NELS | Commercial class **~30 pts**, tutor **~26–37 pts** | Observational, self-reported coaching |

**Use in product:** INT8 Bloom block = **mechanism** (“mastery + 1:1 is the strongest alterable variable in learning research”). Do **not** equate 2σ with +182.

---

### E. Independent / test-prep industry (use carefully)

| Source | Finding | Notes |
|--------|---------|-------|
| Prep Expert (blog, cites CB) | **40+ hrs → 100+**, **80+ hrs → 150+**, **150+ hrs → 200+** | Marketing; aligns with our old 80hr→200+ footnote — **not primary CB** |
| ACT R1710 (2018) | Private tutor significant for ACT retest; other activities NS | ACT not SAT; supports “tutor > generic prep” directionally |
| Ohio State / 1996 CB (via Manhattan Review) | Class **+60**, coaching **+26** | Old; SAT format changed |

---

### F. Illuminairy internal (only source for *our* outcomes)

| Metric | Value | Where |
|--------|-------|-------|
| Completed plans | **n = 95** | `satProgramOutcomes.plansBuiltCount` |
| Avg gain | **+182** | Completers, '24–'25 |
| Hit target rate | **78%** | Completers who hit stated target on next test |
| Program length | **12 weeks** | `satProgram.weeks` |

**Missing:** methodology doc (inclusion, pre/post measurement, mean vs median, confidence intervals).

---

## What we get wrong today (repo audit)

| Issue | Detail |
|-------|--------|
| **250k conflation** | LP/quiz imply one CB dataset; it's mostly **Khan OSP ~250k**, not retake control group |
| **Quiz S3 bars** | Self **12**, Khan **25**, CB **40**, Tutor **70**, Us **182** — only 40 & 182 are sourced; **12/25/70 fabricated** |
| **4.5X vs 4.6X** | Results headline vs `guidedVsSelfStudyMultiplier()` |
| **INT13 “20–60”** vs **+40** average | Internal inconsistency |
| **25/15/5 weekly model** | Internal heuristic — not CB weekly literal |
| **+250 / 16wk / 1100 defaults** | Product choice — defensible as “illustrative path,” not research |
| **`v1AvgGainForBand`** | 95–240 hardcoded — not tied to research or n=95 |
| **`buildScorePathOutput`** | Built but not wired; quiz still ad-hoc |
| **78% likelihood** | Spec'd in growth docs, not calculated |

---

## Recommended benchmark ladder (for charts & copy)

Use **one canonical ladder** everywhere (quiz S3, i-compare, landing, satplan INT8):

| Tier | Label | Points | Source tier | Footnote |
|------|-------|--------|-------------|----------|
| 1 | **Retake, little new prep** | **40** | CB retake avg (verify PDF) | “Typical retake improvement” |
| 2 | **Free digital practice (6+ hrs)** | **21–39** | CB/Khan OSP 2019 controlled | “Incremental vs non-users; PSAT controlled” |
| 3 | **Free practice (20 hrs, PSAT→SAT)** | **up to ~115** | CB/Khan 2017 | Only when discussing PSAT-linked OSP |
| 4 | **Group / generic prep** | **30–70** | Meta-analysis + illustrative | Label **“typical class (illustrative)”** unless citing meta ~30 |
| 5 | **Guided 1:1 (Illuminairy completers)** | **182** | Internal n=95 | Always “our students who completed the plan” |

**Drop** Khan **+25** and self-study **+12** unless we add citations.

Multiplier: 182 ÷ 40 = **4.55** → round to **4.5×** or **4.6×** — pick one globally.

---

## Integration map — quiz & Score Path

### 1. `lib/research/sat-evidence.ts` (new — proposed)

Single module exporting:

```ts
export const satEvidence = {
  cbRetake: { avgGain: 40, cohortLabel: "2M+ retakers (verify)", sourceUrl: "TBD" },
  khanOsp: { incremental6hr: 21, incremental6hrBestPractice: 39, hours20Associated: 115, cohort250k: true, sourceUrl: "..." },
  cbSuiteGrowth: { typicalSectionGrowth: "25-30", sourceUrl: "..." },
  bloom: { effectSizeTutorial: 2.0, context: "mastery tests, 1984", notSatPoints: true },
  coachingMeta: { effectSizeMath: 0.14, effectSizeVerbal: 0.12, source: "Kalaian & Hedges 1996" },
  illuminairy: { n: 95, avgGain: 182, hitRate: 0.78, cohort: "plan completers '24-'25" }
};
```

Wire `lib/site.ts` constants to re-export from here with comments linking URLs.

### 2. Score Path gain model — calibrate, don’t pretend

| Parameter | Current | Research anchor | Recommendation |
|-----------|---------|-----------------|----------------|
| Default start (missing q4) | 1100 | National mean ~1050; parent “average” | **Keep 1100**, label inferred |
| Default weeks (no date) | 16 | Prep Expert 40/80/150 hr tiers; CB OSP dose-response | **Keep 16** — ~one semester |
| Default gain cap (no date) | 250 | OSP 115 over PSAT→SAT; structured prep folklore 100–200 | **Keep 250** as illustrative cap; chart math 260, headline ~250 |
| Weekly 25/15/5 | Internal | CB suite ~25–30 *per section per year* (weak analog) | Keep as **pacing heuristic**; footnote “modeled plan pace, not CB weekly stat” |
| Likelihood 78% | Internal | No external equivalent | Keep; hide unless full inputs |

### 3. Quiz screens — specific changes

| Screen | Change |
|--------|--------|
| **QFS3Stats** | Replace bars with canonical ladder; fix multiplier; expand disclaimer with URLs |
| **QFIComparePrep** | Import `satPrepComparison` from site.ts; Khan tier = **21–39 band** not +25 |
| **QFV1Projection** | Import `buildScorePathOutput`; footnote OSP vs our model |
| **PREP_WHY_FAILED (q7)** | Khan copy: cite **breadth** + “OSP helps +21–39 with hours; doesn’t rank your 5 skills” |
| **i-diag skill pts** | Label **example**; optionally scale to `modeledGain` not fixed 200/150 |
| **Finale urgency** | Migrate off legacy 150/200 to `projectedGainPoints(weeks)` |
| **S5/S7** | Split claims: “250k OSP research” ≠ “our +182 on n=95 completers” |

### 4. Assessment / diagnostic (future)

- **Diagnostic output** should never use population defaults — only measured skills.
- **Quiz preview** may use 1100 / 16wk / +250 with `confidence: inferred`.
- **Likelihood engine** (when built): start 78% internal prior; adjust down for short runway, gap > modeled, first sit, no date — document formula in code.

### 5. Copy rules (legal-safe)

| Say | Don’t say |
|-----|-----------|
| “College Board studied ~250k students using Official SAT Practice…” | “250k retakers only gain 40 without us” |
| “Typical retake improvement ~40 pts (College Board retake research)” | “Your child will gain 40” |
| “Our completers averaged +182 (n=95)” | “Students gain 182” |
| “Modeled path ~+250 over ~16 weeks” | “Guaranteed 250 points” |
| “Bloom: strongest learning variable is 1:1 + mastery” | “Bloom proves you’ll gain 182” |

---

## Research backlog (engineering + ops)

- [ ] **Archive primary sources** in `docs/research/sources/` (PDFs + bib entries)
- [ ] **Verify +40 retake** — locate CB 2019 (or latest) retake bulletin; update `satRetakeResearch.sourceUrl`
- [ ] **Create `lib/research/sat-evidence.ts`** and refactor `lib/site.ts`
- [ ] **Wire quiz charts** to evidence module; delete hardcoded 12/25/70
- [ ] **Wire `buildScorePathOutput`** through all post-quiz screens
- [ ] **Methodology doc** for n=95 / +182 / 78%
- [ ] **A/B copy test**: “250k OSP” vs “250k students studied by College Board & Khan Academy” for comprehension
- [ ] **PostHog**: track which evidence footnote users see before lead submit

---

## Quick reference — what each “250k” actually means

```
College Board press (2017) + OSP Technical Report
└── ~250,000 students: PSAT/NMSQT → SAT with Khan OSP usage
    ├── 20 hrs associated → ~115 pt (raw association)
    ├── 6+ hrs controlled → +21 incremental (+39 w/ best practices)
    └── NOT the same as "SAT retake without studying → +40"

College Board retake research (cite TBD primary)
└── ~2M+ retakers (secondary citations)
    ├── ~40 pt average change
    ├── ~35% score lower
    └── ~55% improve

Illuminairy internal
└── n=95 plan completers → +182 avg, 78% hit target
```

---

## Decision for leadership

**Adopt a three-layer messaging stack:**

1. **Evidence layer** — CB/Khan/Bloom/meta (with links, association ≠ guarantee)  
2. **Model layer** — Score Path 1100 / 16wk / +250 / 25-15-5 (illustrative, labeled)  
3. **Proof layer** — Illuminairy outcomes only (n=95, completers)

Quiz payoff = layers 2 + 3 preview. Strategy Call + diagnostic = replace layer 2 with measured layer.
