# PostHog funnel dashboard — B3 landing experiment

Create one dashboard: **SAT LP → Quiz → Lead → Book**

## Launch checklist (before ad spend)

- [ ] Create multivariate feature flag **`sat-lp-variant`** in PostHog
- [ ] Variants: `b3a-problem`, `b3b-results`, `b3c-authority` — **33% / 33% / 33%**
- [ ] Create feature flag **`sat-lp-layout`** — **`full`** (control) · **`compact`** (treatment) — **50% / 50%**
- [ ] Stickiness: **distinct_id** (same visitor always sees same hero + layout on return)
- [ ] Rollout: **100%** of traffic on `/`
- [ ] Verify Live Events: `experiment_exposure` with `implemented: true` for **both** flags
- [ ] Dev QA only: `?lp=b3a|b3b|b3c` and `?lp_layout=full|compact` — do **not** write to experiment

### Flag slow / fail behavior (code)

- Fallback variant: **`b3a-problem`** after ~2s
- Optional monitoring: `experiment_exposure` with `flag_timeout: true`

## Funnel steps

1. `funnel_landing_view`
2. `funnel_cta_click`
3. `quiz_session_started` (once per browser session — first `quiz_step_viewed` on any step)
4. `quiz_started` (once per browser lifetime — first-ever funnel entry; property `first_start_ever: true`)
5. `quiz_step_viewed` (filter `step = q1-parent-child` for LP → quiz handoff on fresh starts; `step = q1` remains urgency Q3)
6. `quiz_lead_submitted`
7. `quiz_booking_confirmed`
8. `quiz_thank_you_viewed` (`booked` step)

### Step ID aliases (one screen, multiple historical IDs)

Some screens fired under **legacy + canonical** step IDs. Registry: `lib/quiz-funnel/step-aliases.ts`. Print helpers: `node scripts/quiz-step-alias-reference.mjs`.

| Canonical (use going forward) | Legacy aliases (same screen) |
|--------------------------------|------------------------------|
| `q1-parent-child` | `q-who` |
| `achievability` | `reveal`, `s1` (**goal achievability — NOT plan reveal**) |

**Plan reveal** = step **`v1` only** (`QFV1Projection`). Use `properties.step = 'v1'` or `properties.is_plan_reveal = true` (after deploy). Do **not** use `achievability` / `reveal` / `s1` for plan-reveal drop-off.

**Screen role SSOT:** `lib/quiz-funnel/funnel-screen-roles.ts`. New on `quiz_step_viewed`: `funnel_screen_role`, `funnel_screen_component`, `is_plan_reveal`.

**Counting rules (avoid under- and double-count):**

| Mistake | Result |
|---------|--------|
| Filter only `q1-parent-child` on blended window | **Under-count** entry (misses `q-who`) |
| Add `q-who` count + `q1-parent-child` count | **Over-count** users who appear under both |
| `count(DISTINCT person_id)` where `step IN ('q1-parent-child','q-who')` | **Correct** unique viewers of entry screen |
| Post-deploy only | `step = 'q1-parent-child'` is enough (middleware + analytics canonicalize at capture) |

HogQL canonical breakdown (historical + new) — use `hogqlQuizStepCanonical()` from `step-aliases.ts` or explicit IN:

```sql
SELECT count(DISTINCT person_id) AS entry_users
FROM events
WHERE event = 'quiz_step_viewed'
  AND properties.step IN ('q1-parent-child', 'q-who')
```

Goal score achievability (pre-name, NOT plan reveal): `properties.step IN ('achievability', 'reveal', 's1')`.

Plan reveal (Personalized SAT plan, chart): `properties.step = 'v1'` OR `properties.is_plan_reveal = true`.

Legacy URL aliases redirect to canonical `?step=` before the page loads (middleware).

## Event notes

### `quiz_step_viewed` vs `$pageview`

**LP CTA rate:** `funnel_cta_click` / `funnel_landing_view` — breakdown by `utm_content`. Do not use `$pageview` for LP or quiz step funnels.

Plan Builder steps fire **`quiz_step_viewed` only** (no per-step `$pageview`). The global provider still sends one `$pageview` on LP paths (`/`, `/sat-plan-builder`) per navigation; `/plan` step changes do not emit `$pageview`.

### UTM fallback from landing page

When URL UTMs are stripped (Safari ITP, in-app browser), session attribution backfills from the **SAT parent LP path** (`lib/marketing/landing-attribution-infer.ts`, registry in `lib/marketing/meta-live-creatives.ts`):

| LP path | Inference |
|---------|-----------|
| `/` | Maps to ad1 (`utm_content: script_5`) — one ad on this path |
| `/sat-plan-builder` | Uses persisted `hero_hook` from LP load → matching live creative (`fall`, `tutor`, `student_story`) |
| `/sat-plan-builder` (no hook) | Falls back to `utm_content: lp_sat-plan-builder` (shared LP bucket) |

LP view calls `enrichSessionAttributionFromLanding` before quiz navigation so `/plan` events inherit inferred UTMs. Break down LP CTR by `utm_content`; use `hero_hook` when `utm_content` is the shared LP bucket.

### Booking confirmation (API vs webhook)

| Source | Event | When |
|--------|-------|------|
| s5 server book | `quiz_booking_confirmed` with `booking_source: api` | `POST /api/funnel/calendly-book` success |
| Legacy Calendly iframe | `quiz_booking_confirmed` with `booking_source: client` | `calendly.event_scheduled` (deep link only) |
| Webhook | `call_booked` touch + CRM stage | [`lib/crm/calendly-webhook.ts`](../lib/crm/calendly-webhook.ts) |

**Authoritative** booking for CRM/ops is the **Calendly webhook**. Client/API events are for real-time funnel analytics; reconcile drops if webhook fails.

### Booking errors (s5)

| Event | When |
|-------|------|
| `quiz_booking_validation` (PostHog + GA4) | Client s5 validation only: TCPA unchecked, missing name/phone, no slot picked |
| `quiz_booking_error` (PostHog + GA4) | Lead save fail, slot taken, Calendly API 5xx, availability load fail, network |
| `booking_error` (touch_events, server) | Same failures as `quiz_booking_error` on `POST /api/funnel/calendly-book` |

Break down `quiz_booking_validation` by `validation_code` or `field`: `tcpa_required` / `confirmTcpa`, `invalid_contact` / `parentName`, `invalid_phone`, `no_slot`.

Break down `quiz_booking_error` by `error_code`: `lead_save_failed`, `slot_taken`, `calendly_api`, `availability_load`, `network`. Historical rows may include deprecated `booking_paused` (Jun 10, 2026 gate — removed).

### Step back (resume debugging)

| Event | When |
|-------|------|
| `quiz_step_back` (PostHog + GA4) | User taps back within `/plan` (not browser back off `q1-parent-child`) |

Break down by `from_step` → `to_step` to find back loops before **plan reveal (`v1`)** or s5.

### q-doubts

| Event / property | Use |
|------------------|-----|
| `quiz_doubts_answered` | Fires once after q-doubts: on `doubts-insight` (selections) or `q5` (none selected) |
| `qDoubts` | Array of ids on `quiz_step_viewed`, lead submit, person props |
| `qDoubts_count`, `qDoubts_skipped` | Volume and skip rate |
| `doubt_not_test_taker`, `doubt_studied_no_help`, … | Boolean per quote — Trends breakdown |

### Lead submit props

`quiz_lead_submitted` includes `qWho`, `qScoreLower`, `q1–q9`, `sat_lp_variant`, `lp_variant`, `has_gap_screen`, `showed_gpa_gap`, `promised_gain_pts`, `weeks_until_test`, `booking_source: client`. CRM `quiz_trigger` = urgency answer (`q1`: score-low, test-soon, etc.).

## Message-match LP variants (`lp_variant`)

Owner-facing headline IDs on all LP + quiz events (Jun 2026 ad message-match):

| `lp_variant` | Hero hook | Primary ads (`utm_content`) |
|--------------|-----------|------------------------------|
| `variant-goodgrades-lowSAT` | default / fall / concerned mom | `concerned_mom_good_grades_low_sat`, `script_5`, fallback |
| `variant-beforetutoringmoney-realistic-score` | `tutor` | `ad3_before_tutoring` |
| `variant-highgpa-ap-lowsat` | `student_story` | `ad4_mom_first_story`, `ad5_high_gpa_student_story` |

**Primary success metrics (after deploy + ~200 LP views/arm or 14d):**

1. **LP CTA rate:** `funnel_cta_click` / `funnel_landing_view` — breakdown by `lp_variant` and `utm_content`
2. **LP → quiz:** `quiz_step_viewed` where `step = q1-parent-child` / `funnel_landing_view`
3. **Lead rate:** `quiz_lead_submitted` / `funnel_landing_view` by `lp_variant`
4. **Book rate:** `quiz_booking_confirmed` / `quiz_lead_submitted` by `lp_variant`

**Rollback trigger:** If `variant-highgpa-ap-lowsat` CTA rate trails `variant-goodgrades-lowSAT` after sample window, remap ad4+ad5 to default hook in `lib/marketing/meta-live-creatives.ts` (keep distinct `utm_content`).

Legacy PostHog flag `sat-lp-variant` (`b3a-problem` / `b3b-results` / `b3c-authority`) is layout-era experiment metadata — use **`lp_variant`** for ad message-match reporting.

## Primary experiment metric

- **CTA rate:** `funnel_cta_click` / `funnel_landing_view`
- **Sample:** ~200 views per arm **or** 14 days — whichever comes first
- **Secondary:** LP → `q1-parent-child` rate, lead rate, book rate by `sat_lp_variant`

## Breakdowns

- `sat_lp_variant` (`b3a-problem` / `b3b-results` / `b3c-authority`) — legacy layout experiment
- `lp_variant` (`variant-goodgrades-lowSAT` / `variant-beforetutoringmoney-realistic-score` / `variant-highgpa-ap-lowsat`) — ad message-match
- `sat_lp_layout` (`full` / `compact`) on all LP events and `quiz_started` / `quiz_lead_submitted`
- `section_id` on `funnel_cta_click` — full: `hero`, `science`, `great_news`, `included`, `reviews`, `how_it_works`, `final_cta` · compact: `hero`, `sticky_cta`, `final_cta`
- `utm_campaign`, `utm_source`
- Device type (mobile vs desktop)

## Guardrails

- Bounce on `/` (GA4)
- Downstream regression: S5 lead + S9 book rates vs pre-LP baseline

## Winner / scaling (manual — not automated)

After ~200 views/arm, compare CTA rate and `quiz_lead_submitted` rate. To scale a winner:

1. Set winning variant to **100%** in PostHog flag (or ship single hero in code)
2. Update Meta ad creative to message-match winning hook
3. Keep `sat_lp_variant` on Supabase/Klaviyo for segment reporting

See also: [meta-lp-events.md](./meta-lp-events.md), [ad-message-match-qa.md](./ad-message-match-qa.md)

## Message-match QA (before scaling spend)

Run [`ad-message-match-qa.md`](./ad-message-match-qa.md) so ad hook = LP hero within ~3s:

| Variant | `utm_campaign` | Hero echo |
|---------|----------------|-----------|
| b3a | `sat-lp-b3a-problem` | High GPA. Low SAT. Fixable. |
| b3b | `sat-lp-b3b-results` | +182 points. On a focused path. |
| b3c | `sat-lp-b3c-authority` | improvement path · 250k+ scores |

UTMs must persist LP → `/plan?step=q1-parent-child` → s5 lead row (`sat_lp_variant` on `quiz_lead_submitted`).

## Layout experiment (`sat-lp-layout`)

**Control:** `full` — six body sections (science → great news → included → reviews → how it works → final CTA).

**Treatment:** `compact` — hero + why + proof (stats on b3b, one review on b3a/b3c) + 2-step how it works + final CTA; **sticky mobile CTA** (`section_id: sticky_cta`).

| Metric | Compare |
|--------|---------|
| Primary | `funnel_cta_click` / `funnel_landing_view` by `sat_lp_layout` |
| Handoff | `quiz_started` or `quiz_step_viewed` where `step = q1-parent-child` |
| Secondary | `quiz_lead_submitted`, `quiz_booking_confirmed` |
| Guardrail | GA4 bounce on `/`; no lead/book regression on compact |

**Sample:** ~200 landing views per layout **or** 14 days. **Scale compact to 100%** only if LP→`q1-parent-child` and lead rate match or beat full.

**Prod QA URLs:**

- `https://illuminairy.com/?lp_layout=compact`
- `https://illuminairy.com/?lp=b3b&lp_layout=compact` (stats proof block)

See [`b3-lp-analytics-verify.md`](./b3-lp-analytics-verify.md) for Live Events checklist.

## Prioritized A/B tests (2026-06)

Full hypotheses: [`2026-06-full-funnel-conversion-plan.md`](./2026-06-full-funnel-conversion-plan.md) § CRO / A/B.

| Priority | Test | Primary metric | Sample | Implementation |
|----------|------|----------------|--------|----------------|
| **1** | `full` vs `compact` layout | LP→`q1-parent-child` + `funnel_cta_click` rate | ~200 views/arm or 14d | PostHog flag `sat-lp-layout` |
| **2** | b3a vs b3b vs b3c hero (within winning layout) | `funnel_cta_click` / `funnel_landing_view` | ~200 views/arm or 14d | PostHog flag `sat-lp-variant` |
| **3** | Hero micro-copy on winner (CTA label or checklist order) | CTA + `quiz_lead_submitted` | ~200 views/arm | After test 2 winner only |

**Do not** scale Meta creative to a new hook until LP variant wins and [`ad-message-match-qa.md`](./ad-message-match-qa.md) is re-signed for that pair.

### UTM + variant breakdown (funnel diagnostics)

On `quiz_lead_submitted` and `funnel_cta_click`, always break down by:

- `lp_variant` (message-match headline)
- `sat_lp_variant` (legacy b3 flag)
- `utm_campaign` (expect `sat-lp-b3a-problem` | `sat-lp-b3b-results` | `sat-lp-b3c-authority` | `fall_sat_retake` for Icon)
- `utm_source` (e.g. `icon`, `facebook`)

Icon traffic (June 2026, fall retakers): `utm_campaign=fall_sat_retake` + `utm_content=script_1` … `script_6` — compare completion to LP arms.

## Session replay

Recordings help debug LP → quiz drop-off and booking friction. Traffic goes through the `/ia/` reverse proxy (same as events).

### Enable (one time)

1. PostHog → **Settings** → **Personal API keys** → create key with project access (`phx_...`).
2. From repo root:
   ```bash
   POSTHOG_PERSONAL_API_KEY=phx_... npm run posthog:enable-recordings
   ```
   Or in PostHog UI: **Project settings** → **Session replay** → **Enable**.
3. Deploy (client init lives in `instrumentation-client.ts`).
4. Verify: `npm run posthog:verify` should report `sampleRate: 1` (not `null`).
5. Browse `https://illuminairy.com`, then **Session replay** → **Recent recordings**.

### Privacy defaults

- All form inputs masked (email, phone, password) in project settings and client init.
- Do not disable network payload capture at the project level (`recordBody: false` turns off replay in `/decide`).

Break down replays by `utm_campaign`, `utm_content`, and funnel events linked from the recording sidebar.

## Error tracking

Client: `instrumentation-client.ts` + `app/error.tsx` + `app/global-error.tsx` call `posthog.captureException`. Unhandled browser errors autocapture when enabled in PostHog project settings.

Server: `instrumentation.ts` → `onRequestError` → `lib/posthog-server.ts` (`posthog-node`).

Source maps (readable stacks in prod): set on **Vercel Production** only:

- `POSTHOG_PERSONAL_API_KEY` (phx_, error tracking write)
- `POSTHOG_PROJECT_ID=428901`

`next.config.mjs` wraps `@posthog/nextjs-config` when both are present at build time. Verify: PostHog → Error tracking → `$exception` events after a test error.

Web vitals: `capture_performance.web_vitals: true` in `instrumentation-client.ts` → `$web_vitals` events.
