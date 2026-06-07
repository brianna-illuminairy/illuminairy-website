# Quiz funnel + LP — QA run log

Append-only log for viewport, speed, and integration QA from the funnel instrumentation plan.

**Strategy:** [`funnel-strategy.md`](./funnel-strategy.md) · **Viewport matrix:** [`b3-lp-viewport-qa.md`](./b3-lp-viewport-qa.md)

---

## 2026-05-29 — Instrumentation pass

### Code fixes verified

| Check | Result | Notes |
|-------|--------|-------|
| LP attribution key | ✓ Fixed | `readSessionAttribution()` → `illuminairy_attribution` |
| `quiz_started` on first q-who | ✓ | sessionStorage gate in `useQuizAnalytics.ts` |
| `quiz_lead_submitted` enrichment | ✓ | qWho, qScoreLower, q1–q9, gap screen, gain props; Finale passes `hasGapScreen` |
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

---

## 2026-06-02 — Funnel finalize QA (full plan run)

Plan: `.cursor/plans/quiz_funnel_final_qa_7d5ef2a6.plan.md`. Baseline `ec2fd46` on `main`, prod https://illuminairy.com.

### Phase 0 — Prod prerequisites

| Gate | Result | Evidence |
|------|--------|----------|
| `CALENDLY_API_TOKEN` in prod | PASS | `GET /api/funnel/calendly-availability?fresh=1` → `ok:true`, 3 days / 18 slots, HTTP 200 (~2.1s) |
| `plan_shares` migration applied | PASS | `smoke:prod` POST/GET plan-share + shared page all pass (writes a real row to prod Supabase) |
| Supabase service role in prod | PASS (implied) | plan-share write path uses `getSupabaseAdmin()`; succeeds in prod |
| `smoke:prod` | PASS 9/9 | landing, plan q1, reveal deep link, b3a, share API POST/GET, shared page, share CTA UTM, `/plan` rewrite |

Note: local `.env.vercel.prod` is a stale/partial snapshot (May 28, `NEXT_PUBLIC_*` + Stripe/build vars only) and does NOT reflect server-only prod secrets. Live endpoint probes are authoritative; Calendly + Supabase confirmed working in prod.

### Phase 1 — Automated gates

| Command | Result | Notes |
|---------|--------|-------|
| `funnel:step-registry` | PASS | 31 routed steps, 33 switch cases. s7/s9 = expected manual-review warning (legacy cases) |
| `funnel:no-em-dash` | PASS (after fix) | Found + fixed 2 em-dash regressions (see below) |
| `funnel:achievability` | PASS (after fix) | 25 variants. Fixed 1 calendar-stale test (see below) |

### Regressions found and fixed (banned-copy em dashes)

1. `app/quiz/components/QFPlanScheduler.jsx` phone hint: `Looks good — we will…` → `Looks good. We will…`
2. `lib/quiz-funnel/booking-feedback.ts` `slotTakenStale`: `…open times below — pick another.` → `…open times below. Pick another.`

Both are customer-facing s5 strings; em dash is banned per `.cursor/rules/banned-copy-phrases.mdc`.

### Time-bomb test fixed (`scripts/verify-goal-achievability-runner.ts`)

Canonical reveal case `q4=1100-1200 (1150) → q8=1400`, `q5=sept12` hardcoded `tier: "ambitious"`. Tier math is `timePressure = gap / expectedGainForWeeks(weeks)`; gap is fixed at 250 but weeks-to-Sept-12 shrinks daily. At 14 weeks out (today) `timePressure = 250/200 = 1.25` → `aggressive`; `ambitious` only holds at >=15 weeks. The funnel logic is correct (an honest "Aggressive" verdict for a 250-pt gap in 14 weeks). Fix: `tier` expectation now accepts `["ambitious","aggressive"]` (runner supports `string | string[]`) so the gate is calendar-robust while still failing on effortless/realistic/extreme.

### 🔴 P0 BUG FOUND + FIXED — s5 scheduler infinite availability refetch loop

**Symptom (prod, current `ec2fd46`):** On `/plan?step=s5`, `GET /api/funnel/calendly-availability?fresh=1` fires in an endless loop — measured **217 calls in ~134s (~100/min per visitor)**, `document.visibilityState: visible` (not a background-throttle artifact). The scheduler grid never stably renders ("Loading open times…" persists); the page never reaches idle (also why screenshots timed out on prod).

**Root cause:** `QFPlanScheduler` `loadAvailability` was a `useCallback` keyed on `[onAvailabilityReady, onSelectSlot]`, and the fetch effect depended on `loadAvailability`. The parent `QFS5Approved` (`Finale.tsx`) passes a **new inline `onSelectSlot` arrow each render**. Loop: fetch → `onSelectSlot(firstSlot)` → `setSelectedSlot` (parent re-render) → new `onSelectSlot` identity → `loadAvailability` recomputed → fetch effect re-fires → repeat.

**Impact:** Hammers Calendly's API (rate-limit / cost risk) and the scheduler UX is broken at the conversion point.

**Fix:** `app/quiz/components/QFPlanScheduler.jsx` — store parent callbacks in refs (`onSelectSlotRef`, `onAvailabilityReadyRef`, synced each render), use them inside `loadAvailability`, and set `loadAvailability` deps to `[]` so the fetch effect runs only on mount + explicit `reloadKey`.

**Verified (localhost, post-fix, 375/768/1280):** availability fetch count = **1**, grid renders (3 day tabs, 6 slot options), "Loading open times…" clears, slot auto-selects → "Confirm WED · 11:00 AM →".

**ACTION REQUIRED: deploy to prod** — fix is local only; prod still loops until redeployed. Run `npm run agent:verify` first.

### Copy fixes (reveal honesty + banned word)

`lib/quiz-funnel/goal-achievability.ts`:
1. **Verdict date-awareness:** `extreme` tier verdict was always `"Unlikely by test day,"` even when `q5=tbd/2027` (no scheduled date). Now `verdictForTier(tier, hasScheduledTestDate)` returns `"Unlikely in this window,"` when no date. Fixes combos C/D which showed a nonexistent "test day."
2. **Banned word:** reveal eyebrow `achievabilityEyebrow()` was `"Your SAT Score Assessment"` ("assessment" is banned + conflicts with the `/assessment` funnel). Now `"Your SAT score projection"`. Verified live on reveal.

---

## 2026-06-02 — Analytics & Supabase QA

**Method:** Loaded prod LP with full-stack test URL `?lp=b3b&utm_source=facebook&utm_campaign=sat-lp-b3b-results&fbclid=test_fbclid_qa`; inspected client globals + network (CDP). Server-side stores require dashboard access (owner).

| Tracker | Result | Evidence |
|---------|--------|----------|
| GA4 (`G-B1XC1ND9GT`) | PASS | `gtag` loaded; `page_view`, `funnel_landing_view` (`ep.sat_lp_variant=b3b-results`, `ep.funnel=sat_quiz`), `scroll` all sent to `/g/collect` |
| Meta Pixel | PASS | `PageView` + `ViewContent` (`content_name=sat_landing`, `content_category=b3b-results`); `_fbp`/`_fbc` cookies set (`_fbc` from test `fbclid`) |
| PostHog | PASS | `/ia/` reverse proxy live: `config.js` + `/ia/e/` capture endpoint hit. (`window.posthog` not attached in proxied build — expected, not a defect) |
| LP variant | PASS | `localStorage.sat_lp_variant=b3b-results`; hero matches (`+182 points. On a focused path.`) |
| Visitor cookie | PASS | `illuminairy_vid` present |
| Attribution (session) | First-touch confirmed | `sessionStorage.illuminairy_attribution` keeps earliest UTMs (prior `shared_plan` touch persisted; first-touch wins by design) |

**Owner / dashboard verification still required (no programmatic access here):**
- Meta Events Manager Test Events: confirm deduped `Lead` (pixel + CAPI share `makeMetaEventId("lead", leadId)`) and `Schedule` (pixel on API book + CAPI on webhook).
- GA4 DebugView: `generate_lead`, `schedule`, `quiz_thank_you_view` in one session; no duplicate `quiz_started` on q1 refresh.
- Supabase `agujbietvwcudihfgkef`: `leads` row columns (q1–q9, `sat_baseline`/`target_score`, `promised_gain_pts` null when q4=na or q8=tbd, `showed_gpa_gap`, `weeks_until_test`, utm/fbclid, `lead_source: meta`, `stage` → `call_booked` after webhook) + `touch_events` timeline.
- Klaviyo: `Quiz Lead Submitted` + `Quiz Call Booked` events on the test email.
- Vercel prod env presence: `NEXT_PUBLIC_POSTHOG_KEY` (confirmed via live `/ia/`), `SUPABASE_SERVICE_ROLE_KEY` + `CALENDLY_API_TOKEN` (confirmed via working endpoints), `NEXT_PUBLIC_META_PIXEL_ID` + `META_CAPI_ACCESS_TOKEN` + `KLAVIYO_PRIVATE_API_KEY` + `CALENDLY_WEBHOOK_SIGNING_KEY` (pixel confirmed loading; CAPI/Klaviyo/webhook need a real booking to verify). The local `.env.vercel.prod` snapshot is partial/stale — do not rely on it.

---

## 2026-06-02 — Defaults / combo matrix (resolver + prod render)

Verified via `lib/quiz-funnel/score-path-output.ts` + `goal-achievability.ts` and prod reveal/v1 render.

| # | Combo | mode | H1 | verdict | Result |
|---|-------|------|----|---------|--------|
| A | full, dated (1150→1400, sept12) | full | +250 pts by Sept 12. | Tight timeline, still possible | PASS |
| B | first sit (q3=none, q8=1400, aug22) | illustrative | +230 pts by Aug 22. (start `~1100` inferred) | Unlikely by test day (date exists → valid) | PASS |
| C | process_only (q4=na, q8=tbd, q5=tbd) | process_only | +250 pts in 16 weeks. | Unlikely in this window (fixed) | PASS* |
| D | 2027 (q4=na, q8=tbd, q5=2027) | process_only | +250 pts in 16 weeks. | Unlikely in this window (fixed) | PASS* |
| E | small gap (1430→1250) | full | +80 pts by Sept 12. | Comfortably achievable | PASS |
| F | past test date | — | — | — | N/A — no past `q5` option until calendar passes; code-guarded (`pastTestDate`→extreme, "in N weeks" when no date) |
| G | gpa gap (1150→1400, q9=4.0+) | full | +250 pts by Sept 12. | Tight timeline, still possible | PASS — i-gap shows |

Per-field defaults confirmed: q4=na → `~1100` inferred (labeled); q8=tbd → stakes-inferred `~1425` band (not a literal goal); q5=tbd/2027 → "in N weeks", no "by date", WhyNow hidden (no scheduled date); target<current (E) → maintenance `+80`, no hype.

\* **Tickets (not blocking):**
- **process_only still shows a concrete `+250 pts in 16 weeks`** headline (`showGainMath` stays true in process_only). Spec wants no fixed numeric endpoint / clearly illustrative. Product decision — left for owner.
- **q5=2027 not differentiated from tbd** (both `default_16` weeks). Spec wanted ~19-week runway for 2027.
- **i-gap suppressed when q4=na + high GPA** (`showGapScreen` requires a low score *band*, excludes `na`). Confirmed known gap in `score-path-edge-cases.md`.

---

## 2026-06-02 — Viewport (programmatic: horizontal overflow + tap targets)

CDP `Emulation.setDeviceMetricsOverride`; `scrollWidth − innerWidth` = page overflow. (Screenshots unavailable in this QA browser; programmatic overflow is more precise.)

| Step | 375 | 768 | 1280 | Notes |
|------|-----|-----|------|-------|
| `/` LP (b3b) | 0px | — | — | CTAs full-size; only footer legal links <40px (minor). Testimonial carousel scrolls within its own container (not page overflow) |
| `q7` (multi-select) | 0px | — | — | Chips full-size; only "←" Back 30h |
| `reveal` | — | — | 0px | Panel fits |
| `s5` (form + scheduler) | 0px | 0px | 0px | **All text inputs 16px** (no iOS zoom-on-focus); grid renders 3 days/6 slots; minor sub-40px: Back arrow, inline Privacy/Terms links, checkbox box |

No horizontal scroll at any tested width. Real-device pass (iPhone Safari) still recommended once by owner.

---

## 2026-06-02 — Speed (Lighthouse mobile, prod)

| URL | Perf | LCP | FCP | TBT | CLS | vs target |
|-----|------|-----|-----|-----|-----|-----------|
| `/?lp=b3a` | 62 | 6.8s | 3.6s | 190ms | 0 | ❌ perf<70, LCP>4s |
| `/plan?step=q1` | 67 | 6.9s | 3.8s | 80ms | 0 | ❌ LCP>4s |

CLS perfect (0), TBT low. **LCP/FCP are the problem** on throttled mobile. Note: Lighthouse lab applies 4× CPU + slow-4G throttling (harsher than typical devices) and ran alongside local dev servers. **Recommend:** confirm with PageSpeed Insights field data, then optimize hero image (`priority`/sizes), font loading, and render-blocking third-party scripts. Not fixed here (out of QA scope; needs field data first).

---

## 2026-06-02 — Booking errors, copy, typography

**Booking (s5) — `app/quiz/screens/Finale.tsx` + `lib/calendly/booking-errors.ts`:**
- Client validation: clicking Confirm with empty fields → all required inputs `[invalid]` + inline alerts ("Enter your name." / email / "Enter your mobile number for confirmation texts." / "Enter your student's name." / "Check the box to agree…"); **0 lead/book POSTs** (validation `return`s before `fetch`). PASS.
- Error codes defined + classified: `invalid_phone`, `no_slot`, `slot_taken`, `calendly_api`, `availability_load`, `lead_save_failed`, `network`. Double-submit guarded by `submitting`. PASS.
- **Live prod booking (real email/phone → confirms API book + `booked` + webhook + Klaviyo + CAPI) = OWNER task** — not performed (would create real Calendly event + Supabase lead).

**Copy / banned-phrases:**
- Funnel (`app/quiz`, `lib/quiz-funnel`): banned-copy scan CLEAN (no `assessment`, user-facing `quiz`, gains/boost/blueprint/cohort/journey/leverage/guarantee). `funnel:no-em-dash` PASS (53 files) after the 2 fixes.
- **LP / meta em dashes (NOT covered by the funnel gate) — 12 found, logged for owner:** `lib/landing/content.ts` lines 71, 76, 88, 93, 103, 113, 162, 164, 174, 198, 201; `app/page.tsx` line 12 (meta description). Recommend either fixing (em dash → comma/period/colon) or extending `funnel:no-em-dash` to `lib/landing` + `components/landing` if the LP must comply.
- Soft note: "prep" appears in q1 option ("Starting prep early") and q7 headline ("How did they prep") — verb/option usage, pre-existing; owner may keep or reword.

**Typography (funnel):** h1 = `Source Serif 4` (display serif), body = `Schibsted Grotesk`, **no Plus Jakarta leak** into funnel root. Consistent with `app/quiz-globals.css`. PASS.

---

## Phase 10 — Integration sign-off

```
Funnel finalize QA — date: 2026-06-02  env: prod (ec2fd46) + local fixes pending deploy

Automated:
[x] funnel:step-registry  [x] funnel:achievability  [x] funnel:no-em-dash  [x] smoke:prod  (achievability+no-em-dash fixed)

Analytics env (Vercel prod):
[x] POSTHOG (live /ia/)  [~] META pixel ok / CAPI needs live book  [x] SUPABASE (plan-share+lead paths work)  [~] KLAVIYO needs live book  [x] CALENDLY token (availability live) [~] webhook needs live book

Analytics pipeline (one QA UTMs test):
[x] PostHog + GA4 + Meta client events fire w/ sat_lp_variant  [ ] GA4 DebugView (owner)  [ ] Meta Test Events dedup (owner)
[ ] leads row + touch_events timeline (owner/Supabase)  [ ] Klaviyo Lead + Call Booked (owner)  [x] promised_gain_pts null logic verified in resolver

Viewport (375 / 768 / 1280):
[x] LP b3b  [x] q7  [x] reveal  [x] s5 (16px inputs, grid renders)  [ ] share page (covered by smoke; not re-walked)

Speed:
[~] Lighthouse LP 62 / plan 67 — LCP ~6.8s BELOW target (flag)  [x] s5 availability latency OK (~600ms/call)

Defaults matrix:
[x] A  [x] B  [x] C (fixed)  [x] D (fixed)  [x] E  [n/a] F  [x] G

Booking:
[ ] Live s5 book + booked (OWNER)  [ ] stage call_booked (OWNER)  [x] Error paths + validation + quiz_booking_error codes
[x] 🔴 FIXED infinite availability refetch loop (deploy required)

Meta / in-app:
[x] b3b message-match  [~] In-app webview real-phone test (OWNER)  [x] pixel ViewContent/PageView fire

Copy:
[x] No banned phrases in funnel  [x] Grammar variants OK  [!] 12 LP/meta em dashes logged for owner

Outstanding:
[ ] DEPLOY scheduler loop fix + copy fixes (agent:verify first)
[ ] PostHog flag sat-lp-variant live  [ ] Klaviyo s9 links  [ ] LP em dashes  [ ] process_only concrete number  [ ] q5=2027 runway  [ ] i-gap q4=na+4.0  [ ] reveal hydration mismatch (date/locale)  [ ] mobile LCP
```

---

## 2026-06-05 — Analytics stack + logo refresh

### Code shipped

| Area | Result | Notes |
|------|--------|-------|
| Logo lockup | ✓ | Owner PNG → `public/brand/logo-horizontal.png` (cropped), OG `logo-square.png`; `IlluminairyLogoV7` uses raster on LP + funnel |
| Event registry | ✓ | `lib/analytics-registry.ts` |
| CRM touches | ✓ | Quiz steps + LP CTA → `/api/attribution/touch`; `visitors` migration |
| Booking perf | ✓ | Prefetch v1/s4/s7, route cache 45s, s5 skeleton UI |
| Klaviyo props | ✓ | `lib/klaviyo-quiz-props.ts`, resume URL + UTMs on lead |
| Marketing dashboard | ✓ | `/admin/marketing` + daily cron digest |

### Owner actions

1. Run `npm run crm:migrate:visitors` on prod Supabase (or paste migration SQL)
2. Set Vercel: `CRON_SECRET`, `MARKETING_DIGEST_EMAIL`
3. Build Klaviyo Flows B/C/D per updated `docs/klaviyo-quiz-funnel-nurture.md`
4. PostHog dashboards per `growth/posthog-funnel-dashboard.md`

### Other findings (tickets, non-blocking)
- **Reveal hydration mismatch (dev overlay):** React hydration error on `reveal` referencing locale date formatting / `Date.now()` — date/weeks-to-test derived strings render differently SSR vs client. Prod hides the overlay but the mismatch is real. Recommend deferring date-derived strings to client (`useEffect`) or `suppressHydrationWarning`.
