# Quiz funnel + LP — QA run log

Append-only log for viewport, speed, and integration QA from the funnel instrumentation plan.

**Strategy:** [`funnel-strategy.md`](./funnel-strategy.md) · **Viewport matrix:** [`b3-lp-viewport-qa.md`](./b3-lp-viewport-qa.md)

---

## 2026-05-29 — Instrumentation pass

### Code fixes verified

| Check | Result | Notes |
|-------|--------|-------|
| LP attribution key | ✓ Fixed | `readSessionAttribution()` → `illuminairy_attribution` |
| `quiz_started` on first q1 | ✓ | sessionStorage gate in `useQuizAnalytics.ts` |
| `quiz_lead_submitted` enrichment | ✓ | q1–q9, gap screen, gain props; Finale passes `hasGapScreen` |
| Step registry script | ✓ | `npm run funnel:step-registry` |
| hit-q7 haystack spacing | ✓ | Removed desktop max-height crop; margin on visual |
| LP P0 vocabulary | ✓ | `content.ts`, meta, messaging-guide §2, funnel Finale copy |

### Viewport matrix (manual — pending)

Run at 375, 390, 768, 1024, 1280 on `/` and quiz steps: q6, q7, hit-q7, i-method, v1, s3, s5, s9, booked.

| Step | 375 | 768 | 1280 | Notes |
|------|-----|-----|------|-------|
| `/` b3a | — | — | — | |
| q6/q7 | — | — | — | Continue above fold |
| hit-q7 | — | — | — | Haystack image spacing |
| s5/s9 | — | — | — | Form + Calendly |

### Lighthouse (pending)

Target: mobile performance ≥ 70 on `/` and `/quiz?step=q1`; LCP < 4s throttled 4G.

| URL | Perf | LCP | Notes |
|-----|------|-----|-------|
| `/` | — | — | |
| `/quiz?step=q1` | — | — | |

### Supabase / attribution QA (pending prod)

1. Land with `?utm_source=test&utm_campaign=qa`
2. Complete S5 lead submit
3. Confirm `leads` row: q1–q9, `promised_gain_pts`, UTMs, `visitor_id`
4. Confirm `touch_events` + Calendly webhook `call_booked` on book

**Optional column not added:** `quiz_furthest_step` — defer until dashboard need.

---

## 2026-05-29 — Messaging alignment (all quiz slides)

Audited every customer-facing string in `app/quiz/` + `lib/quiz-funnel/` against [`funnel-strategy.md`](./funnel-strategy.md).

| Rule | Fixes |
|------|-------|
| **SAT Improvement Plan** (not Score Path / bare assessment) | reveal H1, plan-reveal copy, i-steps, testimonials, LP heroes, quiz meta |
| **SAT Strategy Call** on CTAs | s3–s9, thank-you, education slides, Finale subheads |
| **Skill Diagnostic** (capitalized) | prep-failure, insight hits, i-diag, disclaimers, q4 why-we-ask |
| **Journey order** | i-diag no longer "Start with a diagnostic" (wrong step); call → Week 1 diagnostic |
| **Banned phrases** | no "move forward", no "assessment" on reveal |
| **Parent voice** | "your child" not "your kid"; gender-neutral GPA gap |

Reveal panel CSS renamed to `qf-plan-reveal-panel--projection` (was `--assessment`).

---

## Grammar variant matrix (quiz)

Deep-link spot checks — full matrix pass pending:

| Surface | Status | Notes |
|---------|--------|-------|
| stakes-copy q2 is/are | ✓ spot check | top-choice **is**; merit/selective **are** |
| education slides | ✓ | SAT Strategy Call + Skill Diagnostic naming |
| s3 personalize | ✓ | Strategy Call headline + Continue CTA |
| prep-failure q7×q6 | ✓ | Skill Diagnostic naming in all variants |

Use URLs: `/quiz?step=<id>` with localStorage quiz state or walk full path.

---

## 2026-06-01 — UGC alignment + staged LP + show-up ship

### Code shipped

| Area | Result | Notes |
|------|--------|-------|
| LP staged disclosure | ✓ | [`lib/landing/content.ts`](../lib/landing/content.ts), [`b3-lp-staged-disclosure-copy.md`](./b3-lp-staged-disclosure-copy.md) |
| UGC Icon scripts | ✓ | [`icon-fall-sat-2026.md`](./icon-fall-sat-2026.md) — paste into Icon |
| Calendly webhook `strategy_call_at` | ✓ | [`lib/crm/calendly-webhook.ts`](../lib/crm/calendly-webhook.ts), Klaviyo profile + `Quiz Call Canceled` |
| Show-up copy s7/s9/booked | ✓ | [`thank-you-copy.ts`](../lib/quiz-funnel/thank-you-copy.ts), [`Finale.tsx`](../app/quiz/screens/Finale.tsx) |
| LP image slots | ✓ | `stepStrategyCall`, `stepWeeklyPlan` in [`assets.ts`](../lib/landing/assets.ts) |
| Klaviyo nurture doc | ✓ | [`docs/klaviyo-quiz-funnel-nurture.md`](../docs/klaviyo-quiz-funnel-nurture.md) |

### Prod QA (manual — owner)

1. `https://illuminairy.com/quiz?step=q1&utm_source=test&utm_campaign=qa`
2. Complete s5 → Supabase `leads` + Klaviyo `Quiz Lead Submitted`
3. Book Calendly → `call_booked` touch + `Quiz Call Booked` + profile `strategy_call_at`
4. Build Klaviyo Flows B/C/D per nurture doc
5. Calendly: phone required, email + SMS reminders ON

### Viewport matrix (manual — pending)

| Step | 375 | 768 | 1280 | Notes |
|------|-----|-----|------|-------|
| `/` b3a | — | — | — | After staged copy |
| s5/s9/booked | — | — | — | Show-up copy |

### Lighthouse (pending)

| URL | Perf | LCP | Notes |
|-----|------|-----|-------|
| `/` | — | — | Run `npx lighthouse` locally |
| `/quiz?step=q1` | — | — | |
