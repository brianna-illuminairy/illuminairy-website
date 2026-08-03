# Ads conversion parity (Strategy Call + free lesson)

Before dual Meta + Google spend, confirm both offers have distinct conversion actions.

## Google Ads (via GA4 import)

| Offer | GA4 event | Funnel tag | Ads setup |
|-------|-----------|------------|-----------|
| Strategy Call | `schedule` | `funnel=sat_quiz` | Primary “Book appointment” — Count **One** |
| Free lesson | `lab_lesson_booked` | `funnel=plan_builder_b` | Separate conversion action — **not** the same as `schedule` |

Do **not** add a site-side `AW-` tag if GA4 import is primary (avoids double-count).

## Meta

| Offer | Lead | Schedule |
|-------|------|----------|
| Strategy Call | `Lead` (pixel + CAPI) | `Schedule` |
| Free lesson | `Lead` (`lab_lead_{id}`) | `Schedule` (`schedule_{inviteeId}`) |

## Smoke

```bash
npm run funnel:analytics-smoke
npm run funnel:b-analytics-smoke
```

Live: PostHog Activity after homepage + each quiz path once post-deploy.
