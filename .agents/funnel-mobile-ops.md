# Funnel Mobile Ops

Internal operating notes for mobile cold-traffic quiz funnel work.

## Always enforce

1. Canonical attribution and audience come from server visitor state.
2. Client storage and cookies are fallbacks, not truth.
3. Funnel analysis uses cohort-anchored methodology.
4. Hydration/resume changes require regression coverage.

## Required references before changes

- `specs/2026-06-mobile-cold-traffic-funnel/SPEC.md`
- `docs/funnel-eventing-and-state.md`
- `docs/funnel-analytics-standards.md`
- `docs/funnel-hydration-and-resume.md`
- `docs/funnel-mobile-ux-responsiveness.md`
- `growth/mobile-funnel-qa-checklist.md`

## Release gate for funnel-impacting changes

- `npm run funnel:e2e`
- `npm run funnel:analytics-smoke`
- `npm run funnel:completeness`
- `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`
