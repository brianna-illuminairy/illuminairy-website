# Score Path — edge cases & failure modes

Single resolver: `lib/quiz-funnel/score-path-output.ts`  
Constants: `lib/quiz-funnel/quiz-profile.ts` (`SCORE_PATH_DEFAULT_START`)  
Gain math: `lib/quiz-funnel/score-path-gain.ts`

---

## Baseline assumptions when data is missing

**Rule:** Every default is **labeled illustrative/inferred** in UI — never presented as their answer.

| Missing input | Assumption | Value | Label in copy |
|---------------|------------|-------|---------------|
| **Starting score** (`q4 = na`) | Average / slightly above average first-time or unknown baseline | **1100** (~1100–1200 band) | “Assumed ~1100 until diagnostic” |
| **Target** (`q8 = tbd`) | From **q2 stakes** (default stakes → selective) | See stakes table below | “Typical for your goals — confirm on call” |
| **Test date** (`q5 = tbd`) | Typical prep runway + illustrative gain | **16 weeks**, **~+250 pts** | “Example window — not a deadline” |
| **Test date** (`q5 = 2027`) | Longer far-out runway | **19 weeks** (curve ~275; no +250 cap) | “Spring 2027+ illustrative runway” |
| **Gain curve** (any chart) | 25 / 15 / 5 pts per week phases | `score-path-gain.ts` | “Modeled from plan patterns” |
| **q6 / q7 empty** | Unfocused / no clear prep | Generic breadth copy | (should default `no-plan` / `nothing`) |

### q8 = tbd → inferred target (from q2)

| q2 stakes | Band | Mid used for math |
|-----------|------|-------------------|
| merit, top-choice | 1400–1450 | **1425** |
| selective, app-rounds, early | 1350–1400 | **1375** |
| (default if q2 missing) | 1300–1400 | **1350** |

### When we do **not** assume a number

| Scenario | Behavior |
|----------|----------|
| `q4 = na` **and** `q8 = tbd` | **process_only** — no score chart; playbook + call only |
| Past test date | No gain math |
| Runway &lt; 4 weeks | No gain math (`MIN_WEEKS_FOR_GAIN_MATH`) |
| Personal likelihood % | Hidden unless scheduled date + official baseline (retake w/ band) |

### When parent **did** answer (not missing)

| Input | Assumption |
|-------|------------|
| q4 band | **Band midpoint** (e.g. 1200–1300 → **1250**) |
| q4 band + q3 = none / PSAT | Same midpoint, confidence **estimate** (not official) |
| q8 target | Exact target (1250–1450) |
| q5 Aug–Dec 2026 | Actual weeks until that date |

**We do not use GPA to infer starting score anymore** — missing start is flat **1100**, not 1250 for 4.0 GPA.

---

## Core rule (read this first)

**Never silently pick 1100 or 1350 and present it as *their* score.**

| Mode | Meaning | UI treatment |
|------|---------|--------------|
| **known** | Parent picked a band / target | Show midpoint + band label |
| **inferred** | Derived from GPA + stakes + q3 | Show band + “typical for students like yours” |
| **illustrative** | Chart needs a number; parent skipped | Dashed line, footnote, **not** in recap as fact |
| **missing** | Cannot model honestly | Hide chart block; show playbook + call CTA |

Today’s bugs to fix: `QFV1Projection` uses `current = 1200` and `target = current + 150` when data is missing **without** illustrative labeling — that reads as a lie.

---

## Input fields — opt-outs & empty

| Field | Opt-out value | Empty allowed? | Notes |
|-------|---------------|----------------|-------|
| q1 | — | No (must pick) | Drives tone, not math |
| q2 | — | No | Drives inferred target when q8=tbd |
| q3 | — | No | First sit vs retake; q4 copy changes |
| q4 | `na` | Only if q3 ∉ sat-1/2/3+ | “No official SAT yet — skip” |
| q5 | `tbd`, `2027` | No pick = stuck | No calendar for gain urgency |
| q6 | — | **Yes today** (bug) | Should require ≥1 or default `no-plan` |
| q7 | — | **Yes today** | Generic prep-fail copy |
| q8 | `tbd` | Yes (opt-out) | No promised gap |
| q9 | — | No | Inference + GPA gap screen |

---

---

## q3 = none — never taken the SAT before

**Trigger:** q3 → “None” (first time). q4 shows **best estimate today** + opt-out skip.

This is **not** the same as a retake with a known score. Copy, confidence, and call framing all shift.

### Two paths

| Path | q4 answer | Starting confidence | Score Path |
|------|-----------|---------------------|------------|
| **A — Estimate** | Picks a band (e.g. 1200–1300) | **estimate** (not `known`) | Chart allowed, dashed / labeled “your estimate” |
| **B — Skip** | `na` | **inferred** from GPA or **missing** | Same as q4=na rules; prefer process-only if q8=tbd too |

**Never** treat path A as an official score. Recap row: **“Best estimate (not official yet)”**, not “Current SAT.”

### Copy rules (first sit)

| Screen | Retake language ❌ | First sit language ✓ |
|--------|-------------------|----------------------|
| i1 | “why they **struggled** on the SAT” | “what to focus on **before their first official SAT**” (already in code) |
| i-diag | “Still scoring **low 1200s**” | “Most students lose points on the **same few skills**” |
| v1 / Score Path | “could **reach** 1380” (implied retest) | “**Before first test:** if they start around **1200–1300**, a focused path could add **+240** by Oct 3” |
| s3 stats | “retake” without caveat | Footnote: “+182 from **completed plans**; first sit and retake paths differ” |
| s5 / call | “Get my diagnostic” only | “**Baseline diagnostic before first SAT** — then build the weekly plan” |

### Do we pick 1100 / 1200 for them?

| Situation | Rule |
|-----------|------|
| Skipped q4 (`na`) | **~1100** (1100–1200 band) — labeled **inferred**, diagnostic replaces |
| Picked band on q4 | Use **band midpoint** — **estimate** if first sit, **known** if retake |
| Never use silent 1200 | v1 / charts use `SCORE_PATH_DEFAULT_START` (= 1100) when no score |

### Likelihood %

**Hide personal %** for q3=none until diagnostic baseline exists. OK to show program stat (“~78% of completers hit target”) with first-sit caveat.

### Why they **should** book the call (stronger, not weaker)

First-timers have **no measured baseline**. The Score Path is explicitly a **preview**; the diagnostic is **required**, not optional polish.

Call hooks:
1. Timed baseline before first official SAT  
2. Real top-5 skills (not examples)  
3. Target + timeline sanity check  
4. Schedule diagnostic + weekly plan  

**Frame:** “You’ve seen what a focused first-sit path looks like. The call gets the real starting point on the calendar.”

### q7 for first sit

Question already switches to “How have they **prepared so far**?” Villain = unfocused breadth or “didn’t prepare much” — not “why last SAT failed.”

### i-gap (GPA paradox)

Today: **does not show** when q4=na. For first sit + high GPA + skip, consider:

> “Strong GPA — SAT not taken yet. Plenty of room to align scores before applications.”

---

## q4 — no starting score (`na`)

**When:** PSAT-only / first sit → skip on q4.

**Do not:** Show “Starting at 1100” or “1200” as fact.

**Do:**

1. **Score Path recap:** `Starting score: TBD — Skill Diagnostic`
2. **Chart:** Illustrative only at **~1100** — label *“Assumed ~1100 until diagnostic”*
3. **i-diag headline:** Already correct — “Most students lose points on the same few skills” (not “still scoring…”)
4. **i-diag skills:** Keep as **example** skills; never +50 as “their” leak
5. **Call hook:** “Diagnostic sets the real starting point”

### Starting score when q4 = na

**Single default:** **1100** (`SCORE_PATH_DEFAULT_START`) — average to slightly above average.  
Band label: **1100–1200**. Always **inferred**, always footnoted.

~~GPA-based inference table removed — use flat 1100.~~

---

## q8 — no goal score (`tbd`)

**Do not:** Default display target to 1350 or 1400 as “their goal.”

**Do:**

1. **Recap:** `Target: TBD — Strategy Call`
2. **Infer aspiration band** from q2 stakes (for copy only):

| q2 stakes | Illustrative target band | Mid anchor |
|-----------|--------------------------|------------|
| merit, top-choice | 1400–1450 | **1425** |
| selective, app-rounds | 1350–1400 | **1375** |
| (default) | 1300–1400 | **1350** |

3. **Headline pattern:**  
   *“Students aiming for [stakes outcome] often target **1350–1400** — we’ll confirm on your Strategy Call.”*
4. **Chart:** Show **gain curve** (+pts over weeks) without a fixed endpoint, **or** dashed target with band label.
5. **Likelihood %:** **Hide** until both q4 band + q8 known (or show only “completers: ~78%” without personal %).

**If q4 known + q8 tbd:** Show current → current + modeled gain only (“+240 by Oct 3”), not “reach 1390.”

---

## q4 + q8 both missing

**Score Path becomes non-numeric:**

- ✓ Timeline phases (if q5 has date) or “typical 12-week runway”
- ✓ Why prep failed (q7)
- ✓ Playbook steps (process)
- ✓ Likelihood: omit personal %; optional program stat footnote
- ✗ No “reach X by date” headline
- ✗ No chart with fake 1200→1350

**CTA:** “Save Score Path + book Strategy Call to set starting score and target.”

---

## q5 — no test date (`tbd` or `2027`)

**Trigger:** q5 → “Not sure yet” or “Spring 2027 or later”.

Without a calendar date you **cannot** honestly say “by Oct 3 they could reach 1380.” You **can** show how points accrue over a **labeled prep window**.

### Two opt-outs (different intent)

| q5 | Parent means | Illustrative weeks | Chart X-axis end |
|----|--------------|-------------------|------------------|
| **`tbd`** | No idea when | **12 weeks** | “Wk 12” — not a test date |
| **`2027`** | Far out, not urgent | **19 weeks** | “~19 wk runway” or “Spring 2027+” |

Do **not** use the same 12-week default for both without labeling.

### What to show

| Element | Scheduled date ✓ | No date |
|---------|-------------------|---------|
| Headline | “By **Oct 3**, they could reach **~1380**” | “A focused **12-week** path could add **~+240 pts**” (gain-first) |
| Score endpoint | 1250 → 1380 | **Optional** — if shown, label “if they prep ~12 weeks”, not “by test day” |
| Chart | Time to test date | **Weeks only** — phase bands 25/15/5 |
| WhyNow / urgency | ✓ | **⛔ Hidden** |
| `funnelTimelineGain` (150+/200+) | Used in s5 | **null** — don’t promise +200 without weeks |
| Personal likelihood % | Maybe | **⛔ Hidden** |
| s1 recap row | Aug 22, 2026 | **TBD** or Spring 2027 |

### What **not** to do

- ❌ “By test day they could reach 1380” (implies a date they didn’t give)
- ❌ WhyNow: “8 weeks until the SAT”
- ❌ CRM `promised_gain_pts` as if dated (already null — keep it)
- ❌ Treat 12 weeks as their actual runway without saying “example window”

### Copy templates (no date)

**`tbd`:**
> No test date yet — here’s what **~12 weeks** of focused prep typically looks like on the Score Path. The Strategy Call picks the date and works backwards.

**`2027`:**
> Spring 2027+ gives a **longer runway** — chart shows **~19 weeks** illustrative. Lock the date on the Strategy Call.

### Call hook (stronger when date missing)

1. **Choose test date** (or narrow to Aug/Oct/Nov/Dec)
2. **Backwards-plan** weeks from that date
3. Schedule diagnostic + weekly plan

Frame: “You’ve seen the **shape** of the path. The call **anchors it to a real test day**.”

### Combined with other gaps

| Combo | Score Path |
|-------|------------|
| q5=tbd + q4=na + q8=tbd | **process_only** — timeline phases + playbook only |
| q5=tbd + scores known | Gain chart + “+N over ~12 wk” — no deadline headline |
| q5=2027 + full scores | Longer curve (19 wk) — “room to hit target without cramming” |

---

## q5 — scheduled date edge cases

| q5 | Weeks | Chart | Headline | Urgency | Likelihood |
|----|-------|-------|----------|---------|------------|
| aug22–dec5 | computed | Time-based curve | “By **Oct 3**…” | WhyNow card | If full inputs |
| Past date (weeks ≤ 0) | 0 | **No gain math** | “Date may have passed — set next sit on call” | None | Hide |
| weeks 1–3 | short | Misleading if full promise | Soft copy only | Soft | Hide |

**Rule:** `chartWeeks` from calendar only when `hasScheduledTestDate(q5)`.

---

## Gap & target logic failures

| Condition | Failure | Handling |
|-----------|---------|----------|
| target ≤ current | Zero or negative gap | “Already in range — focus on top skill leaks” · gain = polish band (+30–80) · no “+240” headline |
| gap > modeledGain(weeks) | Can’t reach target in time | “Modeled **+240** toward **1450** — may need more runway or adjusted target on call” |
| gap = 0, target = current | Same | Maintenance mode |
| q8=1450, q4=1400plus | Small gap | Cap gain display; emphasize precision skills |
| q8=1250, q4=u1000 | Huge gap, short runway | Show partial reach + “call to sanity-check timeline” |
| Band mid mismatch | CANCHOR 1450 vs Q4 mid 1430 for 1400+ | **Standardize on band midpoints** in one map |

### Band midpoints (canonical — use everywhere)

| q4 | Mid |
|----|-----|
| u1000 | 1050 |
| 1100-1200 | 1150 |
| 1200-1300 | 1250 |
| 1300-1400 | 1350 |
| 1400plus | **1430** |

| q8 | Value |
|----|-------|
| 1250–1450 | numeric |

---

## q3 × q4 consistency

| q3 | q4 allowed | Weird combo |
|----|------------|-------------|
| sat-1/2/3+ | Must pick band (no na opt-out shown) | If stored na → treat as missing |
| psat-only / none | Band or na | If band picked → “estimate” label in recap |
| none + band | OK | “Best estimate today” in recap |

---

## q6 / q7 empty

| Field | Today | Should |
|-------|-------|--------|
| q6 [] | Generic i-diag skills (mixed math/reading) | Require 1 selection **or** default `no-plan` |
| q7 [] | Generic breadth villain | Default `nothing` or “unclear prep history” |

`PREP_WHY_FAILED`: pick first q7 id; if empty → unfocused prep default.

---

## GPA gap screen (`i-gap`)

**Shows when:** high GPA + low q4 band (not `na`).

**Fails when:** q4=na → **never shows** even if GPA 4.0 + first sit (missed emotional beat).

**Fix option:** Trigger on q4=na + high GPA + q3 first sit → different copy (“strong GPA, SAT not yet taken — room to align scores”).

---

## Likelihood % — when to show

**Base:** 78% = plan completers who hit target (program stat).

**Show personal band only when:**

- q4 known or inferred (not missing)
- q8 known or explicit inferred band
- q5 scheduled with weeks ≥ 8
- gap > 0 and modeledGain ≥ 50

**Adjust down for:**

- weeks < 8 (−10 to −20)
- gap > modeledGain (−15)
- q6 includes wont / too-busy (−5 to −10)
- q4=na or q8=tbd → **omit personal %**

**Never:** Show “92%” from 78% base without adjustments documented.

---

## Screen-by-screen behavior matrix

Legend: ✅ show · ⚠️ illustrative · ⛔ hide / alternate copy

| Screen | q4=na | q8=tbd | q5=tbd | Both na+tbd |
|--------|-------|--------|--------|-------------|
| i-diag | ✅ generic headline | — | rescale pts by weeks | — |
| v1 / Score Path chart | ⚠️ inferred or ⛔ | ⚠️ open-ended gain | ⚠️ 12wk default | ⛔ process-only |
| s1 recap | “TBD — diagnostic” | “TBD — call” | date row as TBD | all TBD rows |
| s5 lead | diagnostic sets start | call sets target | — | combined hook |
| WhyNow | if q5 dated | — | ⛔ | ⛔ |
| Klaviyo promised_gain | null | null | partial | null |

---

## CRM / backend

`promisedGainFromQuizAnswers` returns **null** when q4=na or q8=tbd — correct.

Store on lead:

- `score_path_mode`: `full` | `partial` | `illustrative` | `process_only`
- `starting_score_source`: `q4_band` | `inferred_gpa` | `missing`
- `target_score_source`: `q8` | `inferred_stakes` | `missing`
- `chart_weeks_source`: `q5` | `default_12`

Do **not** write inferred 1250/1350 into `target_score` Klaviyo field as if answered.

---

## Implementation checklist

1. [ ] `buildScorePathOutput(answers)` — one resolver, all screens consume it
2. [ ] Remove silent `1200` / `+150` defaults in v1
3. [ ] Align `CANCHOR_SCORES` 1400plus → 1430
4. [ ] q6 require ≥1 selection (or silent default)
5. [ ] i-gap variant for q4=na + high GPA
6. [ ] Wire `PREP_WHY_FAILED` with empty q7 fallback
7. [ ] Migrate `cappedPromisedGain` / urgency to 25/15/5 model
8. [ ] Unit tests: one case per row in matrices above

---

## Quick decision: “Do we use 1100 / 1350?”

| Score | When |
|-------|------|
| **1100** | **Yes** — default start when `q4 = na` (labeled inferred) |
| **1050** | Only as **u1000 band midpoint** when they picked that band |
| **1350** | Only as **inferred target mid** when `q8 = tbd` + default stakes — never as silent goal when they picked a target |

**The parent’s explicit answers always win.** Inference is labeled. Illustration is dashed. Missing data blocks numbers.
