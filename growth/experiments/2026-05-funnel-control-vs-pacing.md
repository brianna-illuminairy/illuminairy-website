# Experiment: Funnel LP control vs pacing-first

- **Date started:** 2026-05-18
- **Date ended:** (running)
- **Status:** running

## Hypothesis

Parents who saw practice scores beat the real test will respond better to a **pacing-first** hero on `/go/sat?v=pacing-first` than the default control hero.

## Primary metric (one only)

`funnel_cta_click` / `funnel_landing_view` by `variant` (PostHog)

## Baseline

- Window: first 7 days after launch
- Variant: `control` (default)

## Variant

`?v=pacing-first` — hero from `funnel/landing/sat-aug-2026/variants/pacing-first/hero.ts`

## Minimum sample

200 `funnel_landing_view` per variant or 14 days

## Guardrails checked

- [x] No banned phrases / no score guarantees
- [x] Tuition/dates from `lib/site.ts`
- [ ] `npm run agent:verify` at deploy

## Result

| Metric | control | pacing-first |
|--------|---------|--------------|
| LP → CTA | — | — |

**Decision:** (pending)

## Notes

Log in PostHog dashboard: breakdown by `variant` and `utm_campaign`.
