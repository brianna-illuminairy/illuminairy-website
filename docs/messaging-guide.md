# Illuminairy — Messaging Guide

*Parent-facing copy for the SAT funnel, landing pages, emails, and ads.*  
*Voice & positioning depth → [brand-voice-and-positioning.md](brand-voice-and-positioning.md). SAT competitive copy bank → [sat-messaging-positioning.md](sat-messaging-positioning.md). Banned phrases → `.cursor/rules/banned-copy-phrases.mdc`.*

**Stats source of truth:** `lib/site.ts` — never hardcode numbers elsewhere.

---

## 1. Audience

**Primary reader:** Parent (often mom) of an ambitious high schooler targeting selective admissions.

- Write to **parents**, not students — unless the surface is explicitly student-facing.
- Assume anxiety, skepticism from past prep that didn't work, and mental math vs school list.
- Warm, clear, honest — not hype, not lecture-hall prep tropes, not "AI tutor" as the headline.

**Never sound like:** a tutoring ad, a Khan stat sheet, a score guarantee, or passive self-study marketing.

---

## 2. Product names (use exactly)

| Term | Meaning |
|------|---------|
| **SAT Score Path** | The free ~2-minute parent questionnaire. **Never call it a "quiz."** |
| **Strategy Call** | Free 15-minute advisory call — timeline, scores, school list. **Not** where the diagnostic happens. |
| **Skill Diagnostic** | Proctored **2 hr 14 min** assessment — separate step, **after** Strategy Call if they move forward. |
| **Personalized weekly plan** | What they get from diagnostic + tutor — not "blueprint," not "structured program." |

**CTA defaults:** "See their Score Path" · "Schedule your Strategy Call" · "Book the Skill Diagnostic"

---

## 3. The core message

Parents need to understand one contrast:

> The SAT covers **everything** in math and reading/writing. Most score movement comes from fixing **a few recurring skills** — not re-teaching the whole test.

Supporting ideas (use as needed, not all at once):

- **Diagnostic ranks 5–6 skills** — teach those first, in order.
- **Mistake-driven tutoring** — tutor finds the miss on a real question, fixes it, assigns practice until it sticks.
- **~5–7 hrs/week** — realistic effort inside the program.
- **Parent visibility** — weekly update on skills worked, practice done, what's next.

---

## 4. Approved stats (Illuminairy only)

Import from `lib/site.ts`. Always pair with **"Results vary"** or an equivalent disclaimer in UI.

### Program completers (`satProgramOutcomes`)

| Stat | Value | Use for |
|------|-------|---------|
| Plans built | **95** | Social proof, comparison charts |
| Avg points gained | **+182** | i-compare bar, landing, reveal |
| Target hit rate | **78%** hit target on next test | Trust surfaces when completer context is clear |
| Program length | **12 weeks** | Program facts |

**Sample line:** "Across 95 completed plans, students averaged +182 points."

### First month (`satFirstMonthOutcomes`)

| Stat | Value | Use for |
|------|-------|---------|
| Hit 100+ in month one | **90%** | After Khan / self-study answers, effort framing |
| Hours in first month | **20–28** | Paired with 90% stat only |
| Weekly effort | **5–7 hrs/week** | Plan reveal, method screens, effort metric |

**Canonical line** (`illuminairyFirstMonthOutcomeLine()`):

> 90% of students who invest 20–28 hours in the first month achieve 100+ in month one — at 5–7 hrs/week.

**Do not** add meta-commentary ("not a Khan stat," "our program outcome vs DIY"). State the fact; let context do the work.

### External benchmarks (use carefully)

| Stat | Value | Use for |
|------|-------|---------|
| Retake without new approach | **~40 pts** | i-compare "on their own" bar — cite College Board retaker research |
| GPA vs SAT mismatch | **~60%** | GPA/SAT gap recognition — cite College Board trend data |

**Footnote pattern:** "Source: College Board retest summaries; Illuminairy completed plans (n=95). Individual results vary."

---

## 5. Stats we do NOT promote

| Do not use | Why |
|------------|-----|
| **~115 pts at ~20 hrs** (College Board OSP / Khan press) | Parents read it as "Khan alone works" — undermines us |
| **250k OSP cohort** as if it proves Illuminairy results | Different population, different intervention |
| **"District-wide"** or DIY caution lines | Awkward, defensive, sounds like we're arguing with Khan |
| Implied guarantees (+100, close the gap, hit Tech) | Legal/trust risk — use "often," "typical," "about" |
| Khan video/skill counts as outcome proof | OK for **breadth contrast** (200+ skills vs 5–6), not as a results claim |

Khan breadth copy (`lib/sat-skills-copy.ts`): **111 math skills**, **260 SAT videos**, **3+ years** curriculum span, **200+** total skills — for "they went broad" framing only.

---

## 6. Locked copy lines

From `lib/quiz-funnel/score-path-copy.ts` — reuse verbatim unless product changes:

```
~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills
```

**Contrast phrase** (plan reveal, insight hits):

```
everything on the SAT instead of the few skills that actually move their score
```

**Diagnostic range:** always **5–6 skills** (examples on screen may show 5).

---

## 7. Tone rules

### Do

- Plain sentences. One idea per line on insight cards.
- Name what happens: diagnostic → ranked skills → tutor on misses → weekly plan.
- Use **"your student" / "their score"** — not "your child" overload, not "the learner."
- Positive framing: what **we do**, not what others fail at (see banned-copy rule).
- Label illustrative numbers: "example," "typical," "confirm on Strategy Call."

### Don't

- AI/tutor-ad jargon: "cost points," "points leaking/hiding," "point leak(s)," "gains," "Our read," "broad review," **"generic prep," "prep plan," "generic review/lessons/advice."**
- Tutoring-ad tone: "boost," "supercharge," "close the gap," "score jump."
- Weird meta lines: "not a Khan stat," "our program outcome vs…"
- Negative headlines: "No empty promises," "Not self-study."
- **"Prep"** as a noun — say program, tutoring, practice, or name the step.
- **"Quiz"** for Score Path.
- **"Cohort"** — say students, families, or program.

Full banned list → `.cursor/rules/banned-copy-phrases.mdc`

---

## 8. Funnel copy patterns

### Score Path (questions)

- Short prompts. Parent answers about **their student**.
- **Q2 (stakes):** positive frame — *“What would a higher SAT score help them achieve?”* (not loss framing).
- q8/q9: no progress strips — plan building happens on reveal.

### Insight hits (after q4, q6, q7)

Autoprogress (~6s, scales with copy length) — no manual “Got it” tap. Each hit closes the loop: **stat → why it matters → what we do**.

| Type | Eyebrow | When |
|------|---------|------|
| recognition | Sound familiar? | GPA/SAT mismatch (q1) |
| surprise | Did you know | Section facts — with follow-up |
| mirror | What we noticed | Past prep type (q7) |
| outcome | What we see in month one | **After i-steps** (not q7) |

**Conditional education slides** (also autoprogress):

| Step | When |
|------|------|
| hit-q3-none | q3 = None — ~1100 illustrative start, skip q4 |
| hit-q5-tbd | q5 = Not sure yet — ~16-week default runway |
| hit-q5-timing | q5 = Spring 2027+ — grade/take timing |
| hit-q8-scores | q8 = Not sure yet — score bands vs schools |

### Plan reveal

Two panels:

1. **What you told us** — mirror their inputs.
2. **What this usually looks like** — cohort-based verdict using 95 / +182, their timeline, 5–6 skills.

Metrics row: Start · Target · Likely improvement · Weeks · **Effort: 5–7 hrs/week**

Next steps order: **Strategy Call → Skill Diagnostic → Personal weekly plan**

### i-compare chart

Bars: their past method (~40) · Group class (~70 illustrative) · Illuminairy (**182**).  
Body copy: `iCompareProofBridgeLine()` in `lib/quiz-funnel/i-compare-copy.ts` — plain +182 proof + diagnostic → 5–6 skills.  
Disclaimer required. Do not imply group bar is a cited College Board stat.

---

## 9. Khan & self-study framing

**Goal:** Explain why free tools didn't move the score — without citing Khan success stats.

| OK | Not OK |
|----|--------|
| "Khan walks through the whole course — not the 5–6 skills the diagnostic shows matter most." | "~20 hours on Khan = ~115 points" |
| "200+ skills and 300–500+ videos — most movement comes from 5–6." | "Our program outcome, not a Khan stat" |
| First-month Illuminairy outcome after they pick Khan | Passive-aggressive DIY disclaimers |

---

## 10. Honesty & disclaimers

- **No score or admission guarantees.**
- Illustrative projections → dashed lines, footnotes, "confirm on Strategy Call."
- Before/after photos → "shared by parents," "not independently verified," "results vary."
- College Board trademark footer on SAT pages.
- When showing +182 or 90%: **completers / first-month investors in the program** — not all visitors.

---

## 11. Good vs bad examples

| Bad | Good |
|-----|------|
| "District-wide, 20 hours on Official SAT Practice was linked to 115 points…" | "90% of students who invest 20–28 hours in the first month achieve 100+ in month one — at 5–7 hrs/week." |
| "Take our quiz to see your score boost." | "See their Score Path — free, ~2 minutes." |
| "Khan spans 400 videos — costing them points." | "Khan covers 200+ skills. The diagnostic finds the 5–6 that matter for your student." |
| "Our program outcome, not a Khan stat." | (Delete — just state your stat.) |
| "They'll gain 150 points by August." | "Students with a similar profile often improve 120–180 points over 16 weeks when they work the ranked skills." |
| "See where points are hiding on the SAT." | "The diagnostic ranks the 5–6 skills they keep missing." |
| "A prep plan built around their leaks." | "A personalized weekly plan built from the diagnostic." |

---

## 12. When you change copy

1. Check stats against `lib/site.ts` — update constants first, then UI strings.
2. Run `npm run build` (or `npm run agent:verify`).
3. If positioning shifts, sync `docs/brand-voice-and-positioning.md` or this guide.
4. New customer-facing strings: scan against banned-copy-phrases.

---

*Last updated: May 2026 — reflects Score Path funnel, first-month outcomes, and CB OSP removal from parent copy.*
