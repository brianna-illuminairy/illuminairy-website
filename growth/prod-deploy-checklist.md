# Production deploy checklist — B3 LP

Run after `npm run build` passes locally.

## Vercel deploy

1. Push branch to GitHub (or `vercel deploy --prod` from linked project)
2. Confirm production deployment succeeds on Vercel dashboard
3. Smoke **`https://illuminairy.com/`**:
   - `/?lp=b3a`, `/?lp=b3b`, `/?lp=b3c` — full 8-section scroll ([viewport QA](./b3-lp-viewport-qa.md))
   - Hero CTA → `/plan?step=q1-parent-child`
   - Full funnel: S5 lead → S9 Calendly (staging email)

## Environment parity

Verify Vercel **Production** env matches `.env.local`:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `NEXT_PUBLIC_CALENDLY_URL` — must equal `PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL` in `lib/site.ts` (`npm run verify:calendly-parity`). After change: `npm run env:sync` then push `main` to rebuild.
- `SUPABASE_SERVICE_ROLE_KEY`
- Klaviyo keys

## Supabase

- Project: `agujbietvwcudihfgkef`
- Lead row after S5 includes `sat_lp_variant` in `quiz_answers` JSON
- `touch_events` still recording

## PostHog

- Flag `sat-lp-variant` live **before** ad spend (see [posthog-funnel-dashboard.md](./posthog-funnel-dashboard.md))

## satprep subdomain

- **No 301** — keep `satprep.illuminairy.com` separate
- New ads → `illuminairy.com/` only

## Sign-off

- [ ] LP viewport + speed QA complete ([b3-lp-viewport-qa.md](./b3-lp-viewport-qa.md))
- [ ] Prod homepage is B3 long-form (not short Variant A)
- [ ] **`npm run funnel:analytics-smoke`** against prod/preview (or manual checklist below)
- [ ] Meta Test Events: ViewContent + FunnelCTA on LP; ParentConfirmed on `q1-parent-child` **My child** only
- [ ] Lead + Schedule still fire at S5 with **`event_id` dedupe** (pixel + CAPI — same id in Events Manager)
- [ ] GA4 DebugView: `lp_variant`, `sat_lp_variant`, UTMs on LP + quiz events
- [ ] PostHog Live Events: no duplicate `funnel_landing_view` per LP load; `quiz_step_viewed` has `lp_variant`

## Analytics verification (post-ship)

**Automated (local or prod URL):**

```bash
npm run dev   # if local
npm run funnel:analytics-smoke
FUNNEL_E2E_BASE=https://illuminairy.com npm run funnel:analytics-smoke   # prod
npm run posthog:verify
```

**Full manual checklist:** [b3-lp-analytics-verify.md](./b3-lp-analytics-verify.md)

### Double-counting rules (must still hold)

| Event | Expected count | Dedupe mechanism |
|-------|----------------|------------------|
| `funnel_landing_view` | 1 per LP load | `trackedRef` in landing-page |
| `quiz_started` | 1 per browser lifetime | `localStorage illuminairy_quiz_started` |
| `quiz_session_started` | 1 per tab session | `sessionStorage illuminairy_quiz_session_started` |
| `parent_confirmed` | 1 per session | `sessionStorage illuminairy_parent_confirmed` |
| `quiz_step_viewed` | 1 per step visit (revisit = new fire) | `useQuizAnalytics` lastStep ref |
| `quiz_booking_error` | 1 per error code / 3s | client dedupe in `captureQuizBookingError` |
| Meta `Lead` / `Schedule` | 1 in Ads Manager | pixel `eventID` = CAPI `event_id` |
| PostHog `$pageview` on `/plan` | **0** on step changes | suppressed in `posthog-provider.tsx` |
| Meta `PageView` | ≤2 on first LP load | init + route effect (watch in Test Events) |
| CRM `touch_events` | 1 step view per step per page session | `recordClientTouch` in-memory dedupe |

### New properties to confirm after message-match deploy

- **`lp_variant`** on `funnel_landing_view`, `funnel_cta_click`, `quiz_step_viewed`, `quiz_lead_submitted`
- **`hero_hook`** on LP events when `hook=` query present
- **`quiz_step_back`** on back navigation within `/plan` (PostHog + GA4 only)
