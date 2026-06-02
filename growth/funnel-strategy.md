# Illuminairy SAT funnel — strategy doc

**Purpose:** Single source of truth for direct-response positioning, conversion ladder, product vocabulary, and copy guardrails. Paste into other agents, ad briefs, email flows, or onboarding docs.

**Related:** Tactical copy rules → [`docs/messaging-guide.md`](../docs/messaging-guide.md). Stats → `lib/site.ts`. Analytics checklist → [`posthog-funnel-dashboard.md`](posthog-funnel-dashboard.md). LP copy audit → [`b3-lp-copy-image-audit.md`](b3-lp-copy-image-audit.md).

**Last updated:** 2026-05-29

---

## Glossary (copy-paste block)

| Term | One line |
|------|----------|
| **SAT Improvement Plan** | Parent-facing deliverable from Plan Builder (~2 min); evolves Starter → Confirmed → Activated. Includes free **score projection**. |
| **Score projection** | Illustrative start/target band + timeline on reveal — bonus, not the product name. |
| **SAT Strategy Call** | Free 15 min advisory call for parent — targets, schools, timeline; books Week 1 diagnostic. **Not** a test. |
| **Skill Diagnostic** | Proctored student exam (~2 hr, shown as Part 1 + Part 2 in plan). Only proctored test in journey. |
| **Personalized plan review** | Fri Week 1 — advisor walks diagnostic results; activates weekly skill order. |
| **Activated Improvement Plan** | Same document after diagnostic — exact skills, missed questions, lessons filled in. |
| **Session** | Ambiguous in starter plan (self-study / tutoring / 1:1) until activation — intentional. |

**Primary CTA (funnel end):** Book your free SAT Strategy Call

**Banned on LP / step 1:** bare “assessment,” “Take the assessment,” “quiz,” student “study plan generator” positioning, “if you want to move forward”

---

## 1. Executive summary

**Who we sell to:** Parent (often mom) of an ambitious high schooler targeting selective admissions.

**What we sell:** Diagnostic-first SAT tutoring — not content, not a self-serve schedule app.

**Conversion path:**

```
B3 landing → Plan Builder (`/plan`; `/quiz` redirects) → SAT Improvement Plan (reveal)
  → SAT Strategy Call (Calendly, ~4 days out)
  → Week 1: Skill Diagnostic P1 (Mon) + P2 (Wed) + plan review (Fri)
  → Activated plan → ongoing weekly execution with tutor
```

**Strategic bet:** Give parents a **real, shareable plan document** with full weekly structure visible, but **gate execution detail** (exact skills, missed questions, problem sets) behind the Skill Diagnostic. That is the carrot.

---

## 2. ICP (ideal customer profile)

### Primary buyer

- Parent of high schooler aiming at **selective / merit-aid-sensitive** schools
- Often researching on behalf of a student who is not driving the process
- Skeptical from **past prep that didn’t work** (Khan, group class, scattered tutoring)

### Student profile (who the plan is for)

- Has taken or will take the SAT / PSAT
- Possible **GPA–SAT mismatch** (strong grades, weaker score → parent anxiety)
- Needs **focus**, not more breadth

### Psychographic

- Wants **clarity and accountability**, not another app or video library
- Does mental math vs school list and timeline
- Will share artifacts with spouse before committing spend

### Not ICP

- Students searching “SAT study plan generator” (Crackd-style self-serve)
- DIY-only families with no tutoring budget intent
- Casual retake with no list pressure

---

## 3. Problem / pain

| Pain | How parents describe it |
|------|-------------------------|
| **Opacity** | “Is improvement still realistic for *my* kid?” |
| **Wasted effort** | “We did Khan / a class — almost nothing moved.” |
| **Haystack** | “The SAT is everything — where do we even start?” |
| **Decision fatigue** | “Tutor vs class vs self-study — nothing tied to *our* scores.” |
| **Helplessness** | “I need something concrete to show my spouse / my student.” |
| **Stakes** | School list, merit aid, test date approaching |

**Core contrast (messaging):**

> The SAT covers everything in math and R&W. Most score movement comes from fixing **5–6 recurring skills** — not re-teaching the whole test.

---

## 4. Jobs to be done (parent)

1. *When my child’s SAT doesn’t match their potential, tell me if **meaningful improvement is realistic** and **what to focus on first**.*
2. *Give me a **credible plan I can see and share** — not a sales pitch — so I can decide on tutoring.*
3. *Show **transparent next steps** and weekly visibility so I’m not guessing.*
4. *Don’t waste another 3 months on the wrong skills or format.*

---

## 5. Why they take the next step

| Step | Emotional hook | Rational hook |
|------|----------------|---------------|
| **LP → Plan Builder** | Low risk; no child test | Specific answer vs generic blog advice |
| **Reveal → Strategy Call** | They invested time; plan looks **real but incomplete** | Call personalizes + schedules Week 1 |
| **Call → Skill Diagnostic** | Trust advisor | Need **exact** skills + missed questions to execute |
| **Diagnostic → program** | Report proves gaps | Activated plan is executable; tutor loop |

---

## 6. Outsized value (vs alternatives)

| We win on | vs Khan / apps | vs generic tutor |
|-----------|--------------|------------------|
| **Focus** | 5–6 skills ranked, not 200+ | Diagnostic-first, not ad hoc sessions |
| **Artifact** | Shareable **Improvement Plan** doc | Rare in tutor funnels |
| **Honesty** | Projection + effort labeled illustrative until diagnostic | No fake guarantees |
| **Closed loop** | Same plan **activates** after MentoMind-style report | Not a PDF that dies |
| **Parent visibility** | Weekly updates; 1450+ advisors | Black box tutoring |
| **Sharability** | Forward to spouse / show student → household alignment | — |

**Sharability is a feature:** The plan is the “look what we got” object that drives internal buy-in before pay.

---

## 7. Direct-response principles

1. **One job per screen** — one CTA, one idea.
2. **Proof before ask** — insight hits and stats before lead form.
3. **Carrot model** — full **structure** visible; **execution detail** gated by Skill Diagnostic.
4. **Parent voice** — “your student,” “their score”; never student-generator SEO tone on LP.
5. **Urgency without hype** — Strategy Call bookable **~4 days out** (Calendly); Week 1 diagnostic the **following** calendar week.
6. **Illustrative labels** — score projection and starter skills labeled until diagnostic confirms.
7. **Sequential language** — “Next: book the Skill Diagnostic,” not “if you want to move forward.”

---

## 8. Product ladder (locked)

| # | Name | Who | Duration | Outcome |
|---|------|-----|----------|---------|
| 1 | **SAT Improvement Plan** (+ free score projection) | Parent | ~2 min | Starter plan artifact |
| 2 | **SAT Strategy Call** | Parent | 15 min | Targets confirmed; Week 1 scheduled |
| 3 | **Skill Diagnostic** (Part 1 + Part 2) | Student | ~2 hr proctored | MentoMind-style skill map |
| 4 | **Activated Improvement Plan** | Student + tutor | Ongoing | Exact skills, problems, weekly focus |

### Never confuse

| Step | Not this |
|------|----------|
| 1 | Skill Diagnostic; “quiz”; child test on LP; “study plan generator” |
| 2 | Full diagnostic; “assessment call” |
| 3 | Plan Builder; “free assessment” on LP |
| 4 | Starter plan before diagnostic exists |

---

## 9. The Improvement Plan artifact (three phases)

One document evolves — not separate “draft plan” vs “weekly plan” products.

| Phase | Trigger | What changes |
|-------|---------|--------------|
| **Starter** | Plan Builder complete | Template Week 1 + Week 2 preview; illustrative skills; locked rows |
| **Confirmed** | Strategy Call done | Real dates; targets locked; diagnostic scheduled |
| **Activated** | Skill Diagnostic + Fri review | Exact domain/topic skills, missed Q#, lessons, session detail |

### Week 1 on the shared plan (always visible in starter)

| Day | Block (1 hr) | Label on plan |
|-----|--------------|---------------|
| Mon | Skill Diagnostic Part 1 | **Skill Diagnostic — Part 1** |
| Wed | Skill Diagnostic Part 2 | **Skill Diagnostic — Part 2** |
| Fri | Plan review | **Personalized plan review** |

**Before Week 1:** SAT Strategy Call (15 min) — not a row in Week 1 grid; gates scheduling.

### Week 2+ (study weeks)

- **Pattern:** ~1 hr × 5 days (Mon–Fri), one **priority skill** until mastery target
- **Daily steps (template):** Review missed [topic] problems → Work through [N] examples → **Session** (format unspecified)
- **Starter:** placeholders + locked strip — *Exact skills, problems & lessons unlock after Skill Diagnostic*

### Post-diagnostic data (MentoMind-style report)

| Report layer | Fills in plan |
|--------------|---------------|
| Score summary + section bands | Header; validate projection |
| Domain × topic breakdown | Priority skill 1–5 labels |
| Question table (Q#, miss, topic) | Daily “review missed problems” blocks |
| Difficulty / timing | Pacing notes (optional) |

---

## 10. Quiz / Plan Builder scope

**In funnel (static only):**

- Score projection panel
- Plan overview (weeks to test, 5–6 skills, effort ~5–7 hr/wk)
- Kickoff Week 1 M/W/F template
- Week 2 preview with locked rows
- CTA: **Book your free SAT Strategy Call**

**Not in funnel:**

- Calendly date math
- “Next Monday” computation
- Booking-window logic in `plan-reveal.ts`

**Personalization layer (ops / advisor):** real dates, Calendly ~4-day window, schedule shifts after diagnostic — **outside quiz code**.

---

## 11. Strategy Call scheduling (Calendly)

- **Max advance booking:** ~4 days (current business week + weekend before upcoming Monday)
- **Copy:** “Pick a time this week — we’ll schedule diagnostic sessions for next week.”
- **Why:** Ops can always deliver Week 1 Mon/W/F the following calendar week

---

## 12. Landing page (B3) rules

| Surface | Rule |
|---------|------|
| Hero CTA | Entry to Plan Builder — e.g. **Get their SAT Improvement Plan** or **Build their improvement plan** |
| Subcopy | *For parents · ~2 minutes · your child doesn’t take a test yet* |
| How it works step 1 | **Not** “Take the assessment” — use Plan Builder / answer questions language |
| Step 2 | **SAT Strategy Call** |
| Step 3 | **Skill Diagnostic** (after call) |
| Step 4 | **Personalized weekly plan** (after diagnostic) |
| Meta | No “~2-minute assessment for parents” |
| SEO | Do **not** target `sat study plan generator` — student intent |

Variants: **b3a / b3b / b3c** — full audit in [`b3-lp-copy-image-audit.md`](b3-lp-copy-image-audit.md).

---

## 13. Naming decisions (locked vs parked)

### Locked

- Deliverable: **SAT Improvement Plan**
- Bonus: **Score projection**
- Step 2 CTA: **Book your free SAT Strategy Call**
- Step 3: **Skill Diagnostic** (Part 1 / Part 2 in plan UI only)
- Retire customer-facing **SAT Score Path**

### Rejected for step 1 brand

- **SAT Plan Generator** — student SEO (Crackd cluster)
- **My Child’s SAT Score Assessment** — “assessment” + child-present fear
- Bare **SAT Improvement Plan** as *only* name without phased language — OK as deliverable name with Starter/Activated phases

### Parent vs student search (summary)

- **Generator / schedule / Reddit** → student
- **Help my child / child’s SAT scores** → parent
- **Plan Builder** → weak SEO but OK with “for parents” subcopy

Detail: [`step1-keyword-research.md`](step1-keyword-research.md) (when populated from Ahrefs/GKP).

---

## 14. Proof, stats, disclaimers

- **Source of truth:** `lib/site.ts` — never hardcode elsewhere
- **Illuminairy completers:** 95 plans, +182 avg (always “Results vary”)
- **i-compare footnote:** College Board retaker research; avoid n=95 in chart disclaimer (aligned with quiz)
- **Illustrative vs confirmed:** label all Plan Builder numbers until Strategy Call + diagnostic

---

## 15. Analytics & attribution

| Event | When |
|-------|------|
| `funnel_landing_view` | B3 LP |
| `funnel_cta_click` | LP → `/plan?step=q1` |
| `quiz_started` | First `q1` view (once) |
| `quiz_step_viewed` | Each step |
| `quiz_lead_submitted` | S5 |
| `quiz_booking_confirmed` | Calendly (client); authoritative booking via webhook |
| `quiz_thank_you_viewed` | `booked` |

**Attribution keys:**

- Session: `illuminairy_attribution` (not `ia_attribution`)
- Visitor: `illuminairy_vid` cookie
- Meta: `_fbp`, `_fbc` on lead submit
- LP variant: `sat_lp_variant` in localStorage → lead payload

Dashboard: [`posthog-funnel-dashboard.md`](posthog-funnel-dashboard.md).

---

## 16. Funnel tech map (quick reference)

| Area | Path |
|------|------|
| Quiz routing | `app/quiz/QuizRunner.tsx` |
| Plan reveal | `lib/quiz-funnel/plan-reveal.ts` |
| LP content | `lib/landing/content.ts` |
| Lead API | `app/api/funnel/lead/route.ts` |
| CRM | `lib/crm/quiz-leads.ts` |

Happy path: **24 steps** before Calendly (`q1` → … → `s3` → `s5` → `s7` → `s9`) + `booked`.

---

## 17. Parked / next iteration

| Item | Notes |
|------|-------|
| **Late-funnel carrot pass** | Re-eval s3 → s9 — make incomplete plan + locked rows unmistakable before Strategy Call |
| **Reveal redesign** | Week/day schema in UI matching §9 |
| **Plan PDF export** | Shareable artifact for spouse/student |
| **Messaging guide §2 sync** | Update product table to match this doc |

---

## 18. Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Initial doc — ICP, JTBD, Improvement Plan artifact, Week 1 M/W/F, Calendly window, carrot model, locked vocabulary |
