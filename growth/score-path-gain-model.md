# Score Path — gain model (weekly + ranked skills)

Shared logic: `lib/quiz-funnel/score-path-gain.ts`

## Weekly phases (typical)

| Weeks | Pts/week (typical) | Band (low–high) | Story |
|-------|-------------------|-----------------|--------|
| **1–6** | **25** | 18–30 | Top-ranked skills — outsized gains |
| **7–12** | **15** | 10–20 | Next skills on the list |
| **13+** | **5** | 3–8 | Tail skills, polish, harder points |

### Cumulative examples (typical)

| Runway | Calculation | Total |
|--------|-------------|-------|
| 6 wk | 6 × 25 | **150** |
| 12 wk | 6×25 + 6×15 | **240** |
| 18 wk | 240 + 6×5 | **270** |
| 19 wk | 240 + 7×5 | **275** |

Always cap by `target − current` and label **modeled**, not guaranteed.

## Ranked skills (chart)

Same story on the **skill axis**: weights **28 / 24 / 20 / 16 / 12** (≈60% from top 2 skills).

- `i-diag` constellation: bubble size ∝ rank weight (illustrative until diagnostic).
- `v1` chart: prefer **time on X-axis** with phase labels, **or** skill zones sized by `allocateGainToRankedSkills(totalGain)` — not equal widths.

## Chart honesty rules

1. **X-axis = weeks** when showing timeline; mark phase breaks at wk 7 and wk 13.
2. **Step height** = weekly gain (25 → 15 → 5) — curve looks front-loaded, not linear.
3. **Skill labels** = “example rank 1–5” until Skill Diagnostic.
4. **Footnote:** “Gains slow after top skills and after ~12 weeks — diagnostic confirms order and pace.”

## Output screen copy (template)

> **By {test date}** (~{N} weeks): about **{current} → {low}–{high}** (typical **+{typical}**).  
> Early weeks target **~25 pts/wk** on top skills; **~15 pts/wk** in weeks 7–12; **~5 pts/wk** after that.

## Likelihood %

Base **78%** (plan completers who hit target). Adjust down when:

- `projectedGain(weeks) < target − current`
- Short runway (&lt; 8 wk)
- Execution flags on `q6`

Do not show a precise % when target or score band is unknown.
