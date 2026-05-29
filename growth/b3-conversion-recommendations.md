# B3 LP — post-launch conversion recommendations (optional)

**Not implemented in code.** Review after ~200 views/arm or 14 days of traffic.

## Experiment winner / scaling

Compare by `sat_lp_variant` in PostHog:

1. Primary: `funnel_cta_click` / `funnel_landing_view`
2. Secondary: `quiz_lead_submitted` rate (downstream quality)
3. Guardrail: bounce on `/`, S9 book rate

**If one arm wins clearly:** set PostHog flag to 100% winner or ask engineering to ship single hero. Update Meta creative to message-match.

**Do not** declare winner on CTA rate alone if lead/book rates diverge.

## Meta optimization

- Stay on **FunnelCTA** until ~50+ **Lead**/week/ad set, then test **Lead** optimization
- See [meta-lp-events.md](./meta-lp-events.md)

## Content / UX ideas (approve before any change)

- Review carousel: real parent photos if available (currently score-report crops)
- Sticky mobile CTA after scroll past hero
- Section order test (reviews before included) — **only via new experiment**

## Post-booking thank-you

Discussed separately — show-up rate page after Calendly book. Out of scope for B3 LP launch.
