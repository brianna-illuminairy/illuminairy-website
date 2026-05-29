# Production deploy checklist — B3 LP

Run after `npm run build` passes locally.

## Vercel deploy

1. Push branch to GitHub (or `vercel deploy --prod` from linked project)
2. Confirm production deployment succeeds on Vercel dashboard
3. Smoke **`https://illuminairy.com/`**:
   - `/?lp=b3a`, `/?lp=b3b`, `/?lp=b3c` — full 8-section scroll ([viewport QA](./b3-lp-viewport-qa.md))
   - Hero CTA → `/quiz?step=q1`
   - Full funnel: S5 lead → S9 Calendly (staging email)

## Environment parity

Verify Vercel **Production** env matches `.env.local`:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `NEXT_PUBLIC_CALENDLY_URL`
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
- [ ] Meta Test Events: ViewContent + FunnelCTA on LP
- [ ] Lead + Schedule still fire at S5/S9 with `event_id` dedupe
