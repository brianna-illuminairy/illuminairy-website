# Score projection chart vs goal vs feasibility

Working doc — capture what the Plan Builder funnel actually computes vs what parents see. Fill in decisions and copy later.

**Last updated:** 2026-06-09  
**Status:** Draft for owner review (not a spec; not shipped requirements)

---

## Canonical naming (read this first)

**`v1` = the plan reveal.** PostHog step `v1` · component `QFV1Projection` · parent-facing eyebrow “Personalized SAT plan.”

That is **not** the `achievability` step (`QFSGoalAchievability`), which is the **goal achievability rating** screen earlier in the funnel (headline + tier gauge, no chart).

| Name in docs / PostHog | What it is | Plan reveal? |
|------------------------|------------|--------------|
| **`v1`** | Full plan card + chart + “What’s on the line” + narrative | **Yes — this is plan reveal** |
| `achievability` | Goal score achievability rating (before name) | No |
| `i2` | “Building {name}’s SAT plan” compute animation | No |

**Reported mismatches (Greyson session) were on `v1` / plan reveal**, including:
- Q2 top-choice → **“What’s on the line”** showed merit / “thousands of dollars” copy
- Score chart / projection vs goal vs feasibility reading as one prediction (Part B–D below)

Do not debug stakes or chart issues on `achievability` when the report is about plan reveal.

---

## Funnel order (context only)

`achievability` → (`i-gap` if shown) → `name` → `i2` → **`v1` (plan reveal)**

Greyson session (`distinct_id` `019eaa67-5f43-7a0f-9fd8-796918cce862`, 2026-06-09): PostHog shows `q2: top-choice` through **`v1`**. Issue observed on **plan reveal**, section **“What’s on the line.”**

---

## Part A — Wrong stakes on plan reveal (`v1`) — merit vs top-choice

### Symptom (owner report — plan reveal / `v1` only)

- Q2 answer: **Get into their top-choice school** (`q2 = top-choice`).
- **Plan reveal (`v1`)** section **“What’s on the line”** showed **merit-aid** framing (e.g. “thousands of dollars” / merit scholarships).
- That is **wrong goal**, not a softer top-choice phrase (“competitive for” vs “get into”).
- **Not** on the achievability screen.

### Which code path renders plan reveal stakes?

`QFV1Projection` in `app/quiz/screens/Interstitials.jsx`:

```js
const assessment = buildGoalAchievability(answers);
const stakesLead = assessment.stakesLead;
// … rendered under eyebrow "What's on the line"
```

**Plan reveal (`v1`) does not use** `resolveGoalAchievabilityForDisplay()` or `GoalAchievabilityContent`. It always builds stakes fresh from **`answers.q2`** via `buildGoalAchievability(answers)`.

### What “stale merge” meant (achievability only — fixed 2026-06-09)

**Stale merge does not apply to `v1`.** It only affected the **`achievability`** screen:

1. `QFSGoalAchievability` builds `plan = buildGoalAchievabilityScreenModel(answers)`.
2. `GoalAchievabilityContent` calls `resolveGoalAchievabilityForDisplay(plan, { q2, qWho })`.
3. **Fix:** stakes lines are always recomputed from `plan.q2` / context — partial `stakesLead` no longer overrides current Q2.

That merge path is **not** used on **plan reveal (`v1`)**. Any analysis of the Greyson merit mismatch should focus on **`QFV1Projection` + `answers.q2` at render**, not achievability merge logic.

### So what could cause merit copy on plan reveal with PostHog `q2 = top-choice`?

Open hypotheses — **none confirmed in code for this session**:

| # | Hypothesis | Notes |
|---|------------|--------|
| 1 | **`answers.q2` was `merit` at React render** on v1, while analytics read `q2` from storage/event payload slightly later | Would need session replay or client logging at v1 mount |
| 2 | **Prior localStorage session** with `q2: merit` and a state bug on hydrate/merge | PostHog timeline for Greyson shows top-choice set before v1; still worth checking `qf_answers` shape in replay |
| 3 | **Production build** at time of visit still had old `STAKES_ACHIEVABILITY_LEAD` maps | Old merit line was literally “unlock **thousands of dollars** in merit scholarships” — matches owner description. That map keyed off **`q2`**, so would still require `merit` at render unless another bug |
| 4 | **Different copy block mistaken for stakes** | e.g. prep-failure “thousands of practice problems” on another section — owner pointed at “What’s on the line” specifically |

**Pre-fix code note:** Duplicate maps in `goal-achievability.ts` (removed 2026-06-09) held merit/top-choice/selective strings separately from `stakes-copy.ts`. v1 called `buildGoalAchievability` → those maps. Wrong goal on v1 = **`answers.q2` was not `top-choice` at render**, or old deployed code we have not reproduced locally.

**Post-fix (2026-06-09):** Stakes lead/emphasis SSOT is `stakesAchievabilityLead()` / `stakesAchievabilityEmphasis()` in `lib/quiz-funnel/stakes-copy.ts`, derived from `stakesGoalPhrase(q2, qWho)`.

### Follow-ups to document later

- [ ] Re-watch Greyson replay: exact string under “What’s on the line” on **v1** only
- [ ] Log `{ step: 'v1', q2: answers.q2, stakesLead }` once in PostHog for a week
- [ ] E2E: select top-choice → assert v1 stakes contains “top-choice school”, not “merit” / “thousands”
- [ ] Decide if achievability merge should **always recompute** `stakesLead` from `q2` (separate from v1 issue)

### Student name on stakes (v1)

- **`kidName` is available on v1** (collected on `name` step before `i2` → `v1`).
- Stakes copy today ignores name: “help **them** get into **their** top-choice school.”
- v1 already uses name elsewhere (“**Greyson’s** SAT Plan”, target line).
- **Not implemented:** `stakesAchievabilityLead(q2, qWho, kidName?)` — owner to decide copy pattern (e.g. “help Greyson get into their top-choice school”).

---

## Part B — Score projection on plan reveal (`v1`): three numbers, one page

Parents on **plan reveal** can see **three different “scores”** without labels explaining they answer different questions.

### 1. Stated goal (`q8`)

- Parent-selected target (e.g. **1450**).
- Used in narrative: “plan toward … **1450** target.”

### 2. Modeled typical endpoint (curve math)

- SSOT: `buildScorePathOutput()` → `score-path-gain.ts`.
- Generic **weekly gain template** (not Skill Diagnostic, not tutor-specific):
  - Weeks 1–6: ~25 pts/wk  
  - Weeks 7–12: ~15 pts/wk  
  - Week 13+: ~5 pts/wk  
- `modeledGain = min(gap, projectedGainPoints(weeks))`.
- `scoreRange.typical = start + modeledGain`.
- File comment: *“Modeled from plan patterns, not the Skill Diagnostic.”*

**Greyson example** (1050 start, 1450 goal, Aug 22 ≈ 11 weeks):

| Field | Value |
|-------|-------|
| Gap | 400 |
| Modeled gain | ~225 |
| Modeled typical score | **~1275** |
| Gain band (low / high) | ~+158 / +280 |

### 3. Achievability tier (second math system)

- `buildGoalAchievability()` uses **fixed pts/week tiers** (10–30/wk × weeks).
- Maps gap + timeline → tier label (Effortless … Extreme).
- Greyson: **Extreme** (“Unlikely by test day…”) because 400 pts in 11 weeks exceeds tier ceiling (~330 pts → ~1380).

**Important:** Tier pills and the phase curve are **related but not the same model**. Both appear on v1.

---

## Part C — The plan reveal chart (`QFPlanChart` on `v1`)

Live plan card uses **`QFPlanChart`** (static SVG in `Interstitials.jsx`), **not** `QFV1ProjectionChart` (data-driven, exists but unused on v1).

| Aspect | Reality |
|--------|---------|
| Curve shape | **Fixed** Bezier path — same visual for every user |
| Start / end labels | Uses `current` and `projected` props |
| **`projected` prop today** | `goalNum = projection.goalTarget ?? projection.displayTarget` → often **`q8` goal (1450)**, not modeled endpoint (**1275**) |
| End label text | **“PROJECTED”** |
| X-axis | **Days** to test (`weeks × 7`), not weeks |
| Skill columns | Decorative “SKILL 1…N”; **not** tied to `allocateGainToRankedSkills()` (computed in `buildV1Projection` but **not passed** to this chart) |
| Skill rows below chart | **TBD** until Skill Diagnostic |

**Greyson chart mismatch:** Label says PROJECTED **1450**; modeled typical is **1275**; tier extreme says goal is unlikely by test day. Headline on achievability was ~**+230 pts** (rounded gain, not final score).

### Disclaimers exist in code but are not shown on plan reveal

`buildScorePathOutput()` can push e.g.:

> Modeled gain may not reach 1450 by test day. Your SAT Strategy Call can adjust target or timeline.

`QFV1Projection` receives `projection.disclaimers` but **does not render them** on plan reveal.

---

## Part D — Copy layers on plan reveal (`v1`)

| UI block | What it communicates | Greyson-ish |
|----------|----------------------|-------------|
| Chart PROJECTED | Reads like forecast to **goal** | 1450 |
| Achievability pills | Feasibility / effort tiers | Extreme (~1380 at +30/wk) |
| “What score is reasonable…” | Tier word + **goal** + cohort **point band** | “extreme plan toward 1450” + “+160–+260” |
| Achievability headline (earlier step) | **+pts by date** + tier verdict | “+230 by Aug 22”, unlikely |

Parents must infer which number is “the prediction.” We do not currently label them as: **goal** vs **modeled outcome** vs **effort scenario**.

---

## Part E — What we are / are not claiming

| Parent might think | Actual |
|--------------------|--------|
| Chart predicts score with Illuminairy program | Generic template + decorative curve; skills TBD |
| PROJECTED = likely score | Often = **stated goal** (`q8`) |
| Chart skills = diagnostic ranking | Placeholders |
| Starting score is measured | Band midpoint from q4 (or GPA inference if no score) |
| One consistent projection | Up to three framings on one scroll |

**Closer to truth:** A **feasibility sketch** from quiz bands + timeline template, pending Strategy Call + Skill Diagnostic.

---

## Part F — Code map (for later deep dives)

| Concern | Primary files |
|---------|----------------|
| Start / goal / gap / modeled gain | `lib/quiz-funnel/score-path-output.ts` |
| Weekly gain curve | `lib/quiz-funnel/score-path-gain.ts` |
| Tier / headline / stakes lead | `lib/quiz-funnel/goal-achievability.ts` |
| v1 projection bundle | `lib/quiz-funnel/v1-projection.ts` |
| v1 UI | Component |
|-------|-----------|
| Plan reveal UI + static chart | `app/quiz/screens/Interstitials.jsx` (`QFV1Projection`, `QFPlanChart`) |
| Achievability UI (earlier step, not plan reveal) | `app/quiz/screens/Results.jsx`, `GoalAchievabilityContent.jsx` |
| Stakes copy SSOT | `lib/quiz-funnel/stakes-copy.ts` |
| Achievability merge (achievability only) | `resolveGoalAchievabilityForDisplay()` in `goal-achievability.ts` |
| Cohort stats | `lib/site.ts` (`satProgramOutcomes`) |

---

## Part G — Open product questions (owner)

- [ ] Chart endpoint: show **goal**, **modeled typical**, or both (goal as dashed line)?
- [ ] Rename “PROJECTED” → “Your goal” / “Modeled range” / split labels?
- [ ] Surface disclaimers on v1 (and achievability)?
- [ ] One math system or clearly label two (curve vs tier)?
- [ ] Wire `QFV1ProjectionChart` or fix `QFPlanChart` to use real gain + skill split?
- [ ] Personalize v1 stakes with `kidName` after `name` step?
- [ ] Root-cause plan reveal merit copy with replay + logging (Part A — **`v1` only**)

---

## Related docs

- `growth/funnel-analysis-playbook.md` — step order; **`v1` = plan reveal**, `achievability` = rating screen before name
- `growth/plan-reveal-drop-playbook.md` — drop-off context (names `v1` as plan reveal)
- `.cursor/rules/funnel-flow-canonical.mdc` — **`v1` = THE PLAN REVEAL** (“Personalized SAT plan”); `achievability` is goal-achievability projection, shown **before** `name`
