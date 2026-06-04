# B3 LP — analytics verification (prod)

Run after deploy. Pair with [posthog-funnel-dashboard.md](./posthog-funnel-dashboard.md).

**Base:** `https://illuminairy.com/`

## PostHog flags (manual setup)

| Flag | Variants | Rollout |
|------|----------|---------|
| `sat-lp-variant` | `b3a-problem`, `b3b-results`, `b3c-authority` | 33% each, distinct_id sticky |
| `sat-lp-layout` | `full`, `compact` | 50/50, distinct_id sticky |

## Dev overrides (no experiment exposure)

| URL | Expect |
|-----|--------|
| `/?lp=b3a` | b3a hero, layout from flag or `full` default |
| `/?lp_layout=compact` | Compact body, sticky CTA on mobile |
| `/?lp=b3b&lp_layout=compact` | b3b hero + stat proof row |

## Live Events checklist

1. Load `/` — `funnel_landing_view` with `sat_lp_variant`, `sat_lp_layout`, UTMs if present.
2. `experiment_exposure` for `sat-lp-variant` and `sat-lp-layout` (`implemented: true`).
3. Click hero CTA — `funnel_cta_click` with `section_id: hero`, navigate to **`/plan?step=q1`** (UTMs preserved).
4. Compact only: scroll past hero — sticky bar; click — `section_id: sticky_cta`.
5. Complete q1 — `quiz_started` + `quiz_step_viewed` with `sat_lp_variant` + `sat_lp_layout` from localStorage.

## GA4 (DebugView or Realtime)

| Event | Trigger |
|-------|---------|
| `funnel_landing_view` | LP mount |
| `funnel_cta_click` | Any LP CTA |
| `quiz_started` | First q1 |
| `generate_lead` | s5 lead submit |
| `schedule` | Booking confirmed |

Params should include `sat_lp_variant`, `sat_lp_layout`, `funnel: sat_quiz`.

## Meta Events Manager (Test Events)

| Event | Trigger |
|-------|---------|
| `PageView` | Route load |
| `ViewContent` | LP mount (`content_category` = variant) |
| `FunnelCTA` | LP CTA (`section_id`, `sat_lp_layout`) |
| `Lead` | s5 only — **not** on LP |
| `Schedule` | Booked — **not** on LP |

## UTM persistence

Landing URL:

`/?utm_source=facebook&utm_campaign=sat-lp-b3a-problem&utm_content=test`

After CTA, address bar should include same UTMs on `/plan?step=q1`.
