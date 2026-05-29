# PostHog funnel dashboard — B3 landing experiment

Create one dashboard: **SAT LP → Quiz → Lead → Book**

## Launch checklist (before ad spend)

- [ ] Create multivariate feature flag **`sat-lp-variant`** in PostHog
- [ ] Variants: `b3a-problem`, `b3b-results`, `b3c-authority` — **33% / 33% / 33%**
- [ ] Stickiness: **distinct_id** (same visitor always sees same hero on return)
- [ ] Rollout: **100%** of traffic on `/`
- [ ] Verify Live Events: `experiment_exposure` with `implemented: true`
- [ ] Dev QA only: `?lp=b3a|b3b|b3c` — does **not** write to experiment

### Flag slow / fail behavior (code)

- Fallback variant: **`b3a-problem`** after ~2s
- Optional monitoring: `experiment_exposure` with `flag_timeout: true`

## Funnel steps

1. `funnel_landing_view`
2. `funnel_cta_click`
3. `quiz_step_viewed` (filter `step = q1`)
4. `quiz_lead_submitted`
5. `quiz_booking_confirmed`

## Primary experiment metric

- **CTA rate:** `funnel_cta_click` / `funnel_landing_view`
- **Sample:** ~200 views per arm **or** 14 days — whichever comes first
- **Secondary:** LP → q1 rate, lead rate, book rate by `sat_lp_variant`

## Breakdowns

- `sat_lp_variant` (`b3a-problem` / `b3b-results` / `b3c-authority`)
- `section_id` on `funnel_cta_click` (`hero`, `science`, `great_news`, `included`, `reviews`, `how_it_works`, `final_cta`)
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
