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
3. `quiz_started` (once on first `q1` — distinct from step views)
4. `quiz_step_viewed` (filter `step = q1` for LP → quiz handoff)
5. `quiz_lead_submitted`
6. `quiz_booking_confirmed`
7. `quiz_thank_you_viewed` (`booked` step)

## Event notes

### `quiz_step_viewed` vs `$pageview`

Each step also fires a synthetic PostHog `$pageview` with `$current_url=/plan?step=…` (canonical URL; `/quiz` redirects). Funnel dashboards should use **`quiz_step_viewed`** as the step metric; `$pageview` is optional for path-based views.

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
| `quiz_booking_error` (PostHog + GA4) | Lead save fail, invalid phone, slot taken, Calendly API 5xx, availability load fail, network |
| `booking_error` (touch_events, server) | Same failures on `POST /api/funnel/calendly-book` |

Break down `quiz_booking_error` by `error_code`: `invalid_phone`, `lead_save_failed`, `no_slot`, `slot_taken`, `calendly_api`, `availability_load`, `network`.

### Lead submit props

`quiz_lead_submitted` includes `q1–q9`, `sat_lp_variant`, `has_gap_screen`, `showed_gpa_gap`, `promised_gain_pts`, `weeks_until_test`, `booking_source: client`.

## Primary experiment metric

- **CTA rate:** `funnel_cta_click` / `funnel_landing_view`
- **Sample:** ~200 views per arm **or** 14 days — whichever comes first
- **Secondary:** LP → q1 rate, lead rate, book rate by `sat_lp_variant`

## Breakdowns

- `sat_lp_variant` (`b3a-problem` / `b3b-results` / `b3c-authority`)
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

UTMs must persist LP → `/plan?step=q1` → s5 lead row (`sat_lp_variant` on `quiz_lead_submitted`).

## Layout experiment (`sat-lp-layout`)

**Control:** `full` — six body sections (science → great news → included → reviews → how it works → final CTA).

**Treatment:** `compact` — hero + why + proof (stats on b3b, one review on b3a/b3c) + 2-step how it works + final CTA; **sticky mobile CTA** (`section_id: sticky_cta`).

| Metric | Compare |
|--------|---------|
| Primary | `funnel_cta_click` / `funnel_landing_view` by `sat_lp_layout` |
| Handoff | `quiz_started` or `quiz_step_viewed` where `step = q1` |
| Secondary | `quiz_lead_submitted`, `quiz_booking_confirmed` |
| Guardrail | GA4 bounce on `/`; no lead/book regression on compact |

**Sample:** ~200 landing views per layout **or** 14 days. **Scale compact to 100%** only if LP→q1 and lead rate match or beat full.

**Prod QA URLs:**

- `https://illuminairy.com/?lp_layout=compact`
- `https://illuminairy.com/?lp=b3b&lp_layout=compact` (stats proof block)

See [`b3-lp-analytics-verify.md`](./b3-lp-analytics-verify.md) for Live Events checklist.

## Prioritized A/B tests (2026-06)

Full hypotheses: [`2026-06-full-funnel-conversion-plan.md`](./2026-06-full-funnel-conversion-plan.md) § CRO / A/B.

| Priority | Test | Primary metric | Sample | Implementation |
|----------|------|----------------|--------|----------------|
| **1** | `full` vs `compact` layout | LP→q1 + `funnel_cta_click` rate | ~200 views/arm or 14d | PostHog flag `sat-lp-layout` |
| **2** | b3a vs b3b vs b3c hero (within winning layout) | `funnel_cta_click` / `funnel_landing_view` | ~200 views/arm or 14d | PostHog flag `sat-lp-variant` |
| **3** | Hero micro-copy on winner (CTA label or checklist order) | CTA + `quiz_lead_submitted` | ~200 views/arm | After test 2 winner only |

**Do not** scale Meta creative to a new hook until LP variant wins and [`ad-message-match-qa.md`](./ad-message-match-qa.md) is re-signed for that pair.

### UTM + variant breakdown (funnel diagnostics)

On `quiz_lead_submitted` and `funnel_cta_click`, always break down by:

- `sat_lp_variant`
- `utm_campaign` (expect `sat-lp-b3a-problem` | `sat-lp-b3b-results` | `sat-lp-b3c-authority` | `fall_sat_retake` for Icon)
- `utm_source` (e.g. `icon`, `facebook`)

Icon traffic (June 2026, fall retakers): `utm_campaign=fall_sat_retake` + `utm_content=script_1` … `script_6` — compare completion to LP arms.
