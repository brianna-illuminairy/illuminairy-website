# PostHog funnel dashboard (manual setup)

Create one dashboard: **SAT Conversion Funnel — Georgia**

## Funnel steps

1. `funnel_landing_view`
2. `funnel_cta_click`
3. `intake_step_view` (filter step = parent)
4. `intake_completed`
5. `schedule_page_view`
6. `get_started_intake_submitted` (legacy alias)

## Breakdowns

- `utm_campaign`
- `utm_source` (google vs meta)
- `campaign_id`
- `tone` (aspiration vs fear)
- `fear_id`
- `variant` (control vs pacing-first)

## Guardrail insight

- Bounce: compare `funnel_landing_view` → single-page exit (GA4)

## List fit branch

- `list_fit_completed` → `list_fit_cta_apply` → `intake_completed`
