# Session handoff — Funnel QA, analytics, messaging (2026-05-29)

Use this file to resume work on the Illuminairy SAT funnel without re-reading the full chat.

**Project root:** `/Users/briannazajicek/Documents/Illuminairy`  
**Prior transcript:** `.cursor/projects/Users-briannazajicek-Documents-Illuminairy/agent-transcripts/a048c8c7-bb40-4d20-aa8d-5875faa2e7fe/a048c8c7-bb40-4d20-aa8d-5875faa2e7fe.jsonl`  
**Implementation plan (do not edit unless user asks):** `.cursor/plans/funnel_qa_and_analytics_d046016d.plan.md`

---

## What this session was about

User finalized the **“Funnel instrumentation, QA, and landing refresh”** plan. Main deliverables:

1. **`growth/funnel-strategy.md`** — direct-response strategy doc (ICP, ladder, carrot model, glossary). **This is the strategy deliverable from the plan**, not a follow-up.
2. **P0 copy + vocabulary** across B3 LP, `/quiz`, and docs (retire customer-facing “SAT Score Path” and bare “assessment”).
3. **Analytics fixes** — landing attribution key, enriched PostHog events, step registry script.
4. **Full messaging pass** on all quiz slides, then a **reveal → s3 → s5 → booked** polish pass.

---

## Locked product ladder (do not re-debate)

| Step | Customer-facing name | Notes |
|------|----------------------|--------|
| 1 | **SAT Improvement Plan** (+ free **score projection**) | Parent Plan Builder ~2 min at `/quiz`. **Never** “quiz” or “SAT Score Path” on LP/funnel. |
| 2 | **SAT Strategy Call** (15 min) | Primary end CTA: “Book your free SAT Strategy Call”. **Before** Week 1. Not a row in Week 1 grid. Calendly ~4 days out (ops). |
| 3 | **Skill Diagnostic** | Proctored ~2 hr 14 min; **Part 1 Mon + Part 2 Wed** Week 1. Only proctored test in journey. |
| 4 | **Personalized plan review** | Fri Week 1 — walk diagnostic, activate weekly order. |
| 5 | **Activated Improvement Plan** | Same doc; exact skills, missed Qs, lessons filled in. |

**Carrot model:** Show full weekly structure in starter plan; **gate** exact skills, missed questions, lessons until Skill Diagnostic.

**Banned copy:** bare “assessment,” “Take the assessment,” “if you want to move forward,” student “study plan generator” SEO, customer-facing “SAT Score Path.”

**Parked (user):** Late-funnel carrot UX pass on s3→s9 (visual Week 1/2 plan in quiz); full reveal UI redesign beyond copy.

---

## Conversion path (happy path)

```
B3 / → /quiz?q1 → … → reveal → v1 → s2 → s3 → s5 (lead) → s7 → s9 (Calendly) → booked
```

- **~24 steps** before Calendly on default path (conditional hits for q3=none, q5=tbd/2027, q8=tbd, GPA gap).
- Step routing: `app/quiz/QuizRunner.tsx` (`getSteps` + `switch`).
- Verify registry: `npm run funnel:step-registry`

---

## What shipped this session

### Strategy & docs

| File | Purpose |
|------|---------|
| `growth/funnel-strategy.md` | Master strategy — paste into agents/ads |
| `growth/b3-lp-copy-image-audit.md` | LP section audit; P0 copy marked done |
| `growth/quiz-funnel-qa-log.md` | QA log + messaging alignment notes |
| `growth/posthog-funnel-dashboard.md` | Funnel events, `quiz_started`, client vs webhook booking |
| `docs/messaging-guide.md` | §2 updated to Improvement Plan / SAT Strategy Call |
| `growth/README.md` | Links to above |

### Analytics

| Change | Where |
|--------|--------|
| Fix `ia_attribution` → `illuminairy_attribution` | `lib/attribution.ts` (`readSessionAttribution`), `lib/landing/analytics.ts` |
| `quiz_started` once on first q1 | `lib/quiz-funnel/analytics.ts`, `app/quiz/useQuizAnalytics.ts` |
| Enriched `quiz_lead_submitted` (q1–q9, gap, gain, variant) | `lib/quiz-funnel/analytics.ts` |
| `hasGapScreen` on lead submit | `app/quiz/screens/Finale.tsx` → `captureQuizLeadSubmitted(..., { hasGapScreen })` |
| Step registry guard | `scripts/verify-quiz-step-registry.mjs`, `npm run funnel:step-registry` |

**Authoritative booking for CRM:** `lib/crm/calendly-webhook.ts` (`call_booked`). Client: `quiz_booking_confirmed` with `booking_source: client`.

### LP (B3)

- `lib/landing/content.ts` — Improvement Plan product, CTAs, how-it-works (Plan Builder → Strategy Call → Skill Diagnostic → weekly plan).
- `app/page.tsx` — meta titles/descriptions.
- `components/landing/b3/b3-body.tsx` — how-it-works image order aligned to new steps.

### Quiz copy (all slides + late funnel)

Key surfaces touched:

- `lib/quiz-funnel/plan-reveal.ts` — projection panel, Week 1 next steps, Skill Diagnostic naming.
- `lib/quiz-funnel/score-path-copy.ts` — s3 headline, `REVEAL_CTA`, `REVEAL_SCORE_PROJECTION_NOTE`, s3 CTA.
- `lib/quiz-funnel/thank-you-copy.ts`, `prep-failure-copy.ts`, `education-slides.ts`, `insight-hits.ts`, `testimonials.ts`, `score-path-output.ts`.
- `app/quiz/screens/Results.jsx` — reveal H1, projection panel, CTAs.
- `app/quiz/screens/Interstitials.jsx`, `Questions.jsx`, `Finale.tsx` (s5/s7/s9/booked).
- `app/quiz-funnel.css` — `.qf-plan-reveal-panel--projection` (was `--assessment`).
- `app/quiz/layout.tsx` — quiz meta.

### Reveal → booked polish (last pass)

| Step | Headline / CTA highlights |
|------|---------------------------|
| **reveal** | H1: Your SAT *Improvement Plan*; note on starter vs activated; panel: “Your score projection”; CTA: “Continue to your SAT Strategy Call”; next steps = full Week 1 ladder |
| **s3** | “Next: your free SAT Strategy Call”; CTA: “Continue to book your call” |
| **s5** | “Step 1 of 2 · Your details”; “Book my SAT Strategy Call” |
| **s7** | Full call bullets + Step 2 After Skill Diagnostic card |
| **s9** | “Step 2 of 2”; “Pick a time for your free SAT Strategy Call” |
| **booked** | SAT Strategy Call confirmed; Week 1 line in before-call checklist |

### CSS / internal names (OK to leave)

- Code modules still named `score-path-*` internally — not customer-visible.
- `buildProjectionVerdict` (renamed from `buildAssessmentVerdict`); model fields `projectionHeadline` / `projectionVerdict`.

---

## Still pending (from plan)

| Item | Notes |
|------|--------|
| **Prod Supabase/UTM QA** | Land with `?utm_source=test&utm_campaign=qa`, complete s5, verify `leads` + `touch_events` + webhook on book. Confirm `SUPABASE_SERVICE_ROLE_KEY` on Vercel prod. |
| **Lighthouse + viewport matrix** | `/` and `/quiz?step=q1`; log in `growth/quiz-funnel-qa-log.md`. Targets: mobile perf ≥70, LCP &lt;4s throttled. |
| **LP photos** | P1 per `growth/b3-lp-photo-shot-list.md`; dedicated `lp-step-strategy-call.jpg` |
| **P2 LP micro-copy** | b3b “PATHS BUILT” → “PLANS BUILT”; minor hero bullets |
| **Optional DB** | `quiz_furthest_step` column — deferred |
| **Late-funnel carrot UI** | Parked — s3→s9 visual Week 1/2 plan in quiz |

---

## Quick verify commands

```bash
cd /Users/briannazajicek/Documents/Illuminairy
npm run dev                    # http://localhost:3000/quiz?step=reveal
npm run funnel:step-registry   # step switch coverage
npm run build                  # passed 2026-05-29
npm run agent:verify           # layout guard + agent verify
```

**Browser spot-check path:** `reveal` → `s3` → `s5` → `s7` → `s9` → `booked`

**Quiz state:** `localStorage` key `qf_answers`  
**LP variant:** `sat_lp_variant` in localStorage; flag `sat-lp-variant` in PostHog

---

## Key file map

| Area | Paths |
|------|--------|
| Strategy | `growth/funnel-strategy.md` |
| Messaging rules | `docs/messaging-guide.md`, `.cursor/rules/banned-copy-phrases.mdc` |
| LP content | `lib/landing/content.ts`, `components/landing/b3/` |
| Quiz routing | `app/quiz/QuizRunner.tsx`, `app/quiz/state.tsx` |
| Quiz screens | `app/quiz/screens/Questions.jsx`, `Interstitials.jsx`, `Results.jsx`, `Finale.tsx` |
| Copy libs | `lib/quiz-funnel/*.ts` (especially `plan-reveal.ts`, `score-path-copy.ts`, `thank-you-copy.ts`) |
| Analytics | `lib/quiz-funnel/analytics.ts`, `lib/landing/analytics.ts`, `lib/attribution.ts` |
| Lead API | `app/api/funnel/lead/route.ts`, `lib/crm/quiz-leads.ts` |
| Calendly | `lib/crm/calendly-webhook.ts`, `components/calendly-inline-embed` |
| Stats | `lib/site.ts` only — never hardcode n=95, +182, etc. |

---

## PostHog funnel (dashboard)

1. `funnel_landing_view`
2. `funnel_cta_click`
3. `quiz_started`
4. `quiz_step_viewed` (use for step funnel; each step also fires `$pageview`)
5. `quiz_lead_submitted`
6. `quiz_booking_confirmed` (client)
7. `quiz_thank_you_viewed`

See `growth/posthog-funnel-dashboard.md`.

---

## Copy guardrails (cheat sheet)

- **Parent voice** — “your child” / “their score”; not “your kid” on funnel.
- **SAT advisors** on call surfaces (not generic “experts” unless intentional).
- **Skill Diagnostic** — capitalized product name; not bare “diagnostic” or “assessment” on parent UI.
- **Journey order** — Strategy Call books Week 1 diagnostic; don’t say “start with a diagnostic” mid-funnel as if that’s the next click.
- **Effort line:** `~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills` (`SCORE_PATH_EFFORT_LINE`).
- **First-month stat** — only after `hit-outcome-month-one` (post i-steps); use `illuminairyFirstMonthOutcomeParts()` from `lib/site.ts`.

---

## What NOT to do next session unless asked

- Edit `.cursor/plans/funnel_qa_and_analytics_d046016d.plan.md` (user said do not edit plan file).
- Re-open naming (“Score Path” vs Improvement Plan) — locked in `funnel-strategy.md`.
- Commit / push / create PR unless user explicitly asks.
- Scope creep into `/assessment` or `/satplan` funnels (separate products).

---

## Suggested next session prompts

- “Run prod UTM + S5 lead QA and log results in `growth/quiz-funnel-qa-log.md`.”
- “Lighthouse `/` and `/quiz?step=q1`, fill viewport matrix.”
- “Implement parked late-funnel carrot pass (s3→s9 Week 1 plan UI).”
- “Ship P1 LP photos per shot list.”

---

*Generated 2026-05-29 after funnel QA + messaging alignment session.*
