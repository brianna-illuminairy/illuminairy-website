# Experiment: [short title]

- **Date started:** YYYY-MM-DD
- **Date ended:** YYYY-MM-DD or (running)
- **Status:** running | keep | revert | inconclusive

## Hypothesis

What we believe will improve and why.

## Primary metric (one only)

Event or source: e.g. `schedule_cta_click` (PostHog) or Stripe checkout completed.

## Baseline

- Window: e.g. 7 days before deploy
- Value: e.g. 2.1% SAT page → schedule click rate

## Variant

What changed (pages, copy, CTA). Link PR or commit.

## Minimum sample

e.g. 200 SAT pageviews or 14 days — whichever comes first.

## Guardrails checked

- [ ] Bounce rate within band
- [ ] No banned phrases / no score guarantees
- [ ] Tuition/dates unchanged in `lib/site.ts`
- [ ] `npm run agent:verify` passed at deploy

## Result

| Metric | Baseline | Variant |
|--------|----------|---------|
| Primary | | |

**Decision:** keep / revert / inconclusive — reason:

## Notes

Qualitative feedback, segments, next experiment.
