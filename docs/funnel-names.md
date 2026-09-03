# Funnel names (discussion language)

Use these names in chat, docs, and agent notes. **Do not rename the URLs.**

| Say this | Live URL(s) | What it is |
|----------|-------------|------------|
| **Landing page** | `/sat-plan-builder` | Cold-ad LP. CTA into the free lesson funnel. |
| **Strategy Call funnel** | `/plan` (`/quiz` rewrite) | Questionnaire → plan → book Strategy Call. |
| **Free lesson funnel** | `/plan-b` | Questionnaire → free lesson → `/portal`. Usually entered from the landing page. |

**Do not say** Plan A / Plan B when talking about these. Code folders (`app/quiz-b/`, `lib/quiz-funnel-b/`) and path strings stay as they are.

## Analytics: always filter on `funnel_id`

Both funnels emit the **same event names** (`quiz_started`, `quiz_step_view`, `parent_confirmed`, `quiz_schedule_view`, `quiz_lead_submitted`, `call_booked`). Filtering by event name alone mixes the two funnels together and produces wrong numbers.

| `funnel_id` | Funnel |
|---|---|
| `sat_quiz` | Strategy Call (`/plan`) |
| `plan_builder_b` | Free lesson (`/plan-b` + `/sat-plan-builder`) |
| `score_review` | Score review |
| `null` | Not a funnel event (homepage, portal, admin) |

SSOT: [`lib/analytics/funnel-id.ts`](../lib/analytics/funnel-id.ts). Resolved from the request path in `appendTouchEvent`, so a screen cannot forget to tag itself, and stored as a real `touch_events.funnel_id` column (backfilled across all history).

In PostHog it is registered as a super property, so it is on every event as `funnel_id`.

Two known gaps, both deliberate:

- Homepage `funnel_cta_click` is `null` — that CTA can route to either funnel, so the destination is genuinely unknown.
- 76 historical `call_booked` rows are `null` — Calendly bookings with no matching lead, unattributable from data we hold. New bookings are tagged from the booked Calendly event type.
