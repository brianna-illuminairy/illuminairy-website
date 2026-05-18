# SPEC: SAT conversion funnel

- **PRD:** [PRD.md](./PRD.md)
- **Date:** 2026-05-18

## Acceptance criteria

### Campaign & attribution

- [ ] `funnel/lib/campaigns.ts` resolves `campaign_id`, `tone`, `fear_id` from `utm_campaign`, `?campaign=`, `?tone=`, `?fear_id=`
- [ ] `funnel/lib/utm.ts` persists UTMs to `sessionStorage` on LP view
- [ ] Mismatched legacy `/go/sat` without kit params logs `funnel_landing_view` with `attribution_warning: true` (no block)

### Landing `/go/sat`

- [ ] Hero matches active kit + tone (message-match)
- [ ] Primary CTA → `/get-started` with UTMs preserved
- [ ] `funnel_landing_view`, `funnel_cta_click` fire with `variant`, `utm_campaign`, `campaign_id`, `tone`, `fear_id`
- [ ] Two LP variants: `control`, `pacing-first` via `?v=`

### Intake `/get-started`

- [ ] Reuses `POST /api/intake`; extended optional fields in funnel form
- [ ] Mobile: 48px targets, bottom-fixed primary CTA, step progress
- [ ] `intake_step_view` (parent | student | fit), `intake_completed`
- [ ] On complete → `/get-started/schedule` + sessionStorage prefill

### Schedule & complete

- [ ] Calendly prefill from intake; `schedule_page_view`
- [ ] `/get-started/complete` thank-you after booking (link from schedule page)

### List fit `/tools/georgia-list-fit`

- [ ] SAT vs UGA/GT/Emory bands from `lib/georgia-flagship-scores.ts`
- [ ] Middle 50% ≠ accepted education block; 75th as competitive target
- [ ] CTA → `/get-started?from=list-fit`

### Analytics

- [ ] All events in `lib/analytics-events.ts`; dual-fire via `funnel/lib/track.ts`
- [ ] GA4 `generate_lead` on `intake_completed`

### Copy & brand

- [ ] Banned phrases in `.cursor/rules/banned-copy-phrases.mdc` (score jump, boost, etc.)
- [ ] No score guarantees; tuition from `lib/site.ts` only

### QA (before ads)

- [ ] iPhone Safari one-handed intake complete
- [ ] Android Chrome same
- [ ] `npm run agent:verify` passes

## Files (primary)

| Path | Purpose |
|------|---------|
| `funnel/` | Kits, copy, layout, track |
| `app/(funnel)/` | Routes |
| `lib/list-fit-check.ts` | Gap math, 75th target |
| `components/list-fit-check/*` | Tool UI |
| `growth/experiments/2026-05-funnel-control-vs-pacing.md` | First experiment log |

## Env

- `NEXT_PUBLIC_CALENDLY_URL` — public consult booking
- `NEXT_PUBLIC_POSTHOG_KEY` — events
- Resend for intake email (existing)
