# June SAT Score Review analytics playbook

Brief reference for `/june-score-review` LP + `/score-review` funnel.

## Funnel identity

| Property | Value |
|----------|--------|
| PostHog / touch `funnel` | `sat_score_review` |
| `funnel_id` / CAPI custom | `june_score_review` |
| LP path | `/june-score-review` |
| Funnel path | `/score-review` |

## Canonical events

| Stage | PostHog | GA4 | Klaviyo | Meta CAPI |
|-------|---------|-----|---------|-----------|
| LP view | `funnel_landing_view` | `view_item` | — | `ViewContent` |
| LP CTA | `funnel_cta_click` | `select_content` | — | `FunnelCTA` |
| Step view | `score_review_step_viewed` | `score_review_step_view` | — | — |
| Phone verified | `score_review_phone_verified` | same | — | — |
| Lead saved | `score_review_lead_submitted` | same | Score Review Lead Submitted | Lead |
| Booked | `score_review_booked` | same | Score Review Booked | Schedule |
| Link shared | `score_review_link_shared` | — | — | — |
| Thank you | `quiz_thank_you_viewed` | `quiz_thank_you_view` | — | — |

Touch events: `score_review_phone_verified`, `score_review_lead_submitted`, `score_review_booked`, `score_review_link_shared`.

## PostHog filters

- Scope URL: `$current_url ILIKE '%/score-review%'` OR `%/june-score-review%`
- Exclude internal emails (same list as Plan Builder A playbook)
- Break down by `utm_campaign`, `utm_content`, `hero_hook`, `lp_variant`

## Meta ad URL

```bash
npm run marketing:ad-urls
```

Creative id: `ad6_june_score_review` · `utm_content=june_score_review`

Example:

```
https://illuminairy.com/june-score-review?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_june_score_review&utm_content=june_score_review&hook=june_score_review
```

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/score-review/lead` | Lead upsert (`sat_score_review`) |
| `POST /api/score-review/phone/send` | Twilio Verify SMS |
| `POST /api/score-review/phone/verify` | Twilio Verify check |
| `GET /api/score-review/calendly-availability` | Score review slots |
| `POST /api/score-review/calendly-book` | Book + CRM (`call_type=score_review`) |

## Owner setup (before prod)

1. Create Calendly event **June SAT Score Review** (~15–20 min). Slug: `june-sat-score-review`. Enable SMS reminders.
2. Set `NEXT_PUBLIC_SCORE_REVIEW_CALENDLY_URL` in Vercel production.
3. Klaviyo flows: **Score Review Booked** + reminders (CB login prep in copy).
4. Point Meta ad to URL from `npm run marketing:ad-urls`.

## QA

```bash
npm run dev
# LP: http://localhost:3000/june-score-review
# Funnel: http://localhost:3000/score-review
npm run funnel:score-review-analytics-smoke
```
