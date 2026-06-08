# Funnel Analytics Standards

## Purpose

Standardize funnel measurement so ad and UX decisions are based on complete, comparable data.

## Canonical dimensions

All conversion analysis must use:

- `visitor_id`
- `first_utm_content`
- `first_hero_hook`
- `quiz_who`
- `sat_lp_variant` / `lp_variant` where relevant

## Cohort methodology

For ad dropoff analysis:

1. Anchor cohort on landing event for target creative (`utm_content`).
2. Measure downstream progression on that cohort.
3. Do not rely on global filters on late-step events alone.

## Event completeness monitors

Track daily completeness for key events:

- missing `utm_content`
- missing `hero_hook`
- missing `qWho`

Recommended threshold defaults:

- Warning: < 98% completeness
- Critical: < 95% completeness

Automation:

- Run `npm run funnel:completeness` to evaluate thresholds over recent touch events.
- The script exits non-zero on critical breaches (<95%) to support deploy gates.

## Primary funnel checks

- Landing -> CTA
- CTA -> quiz start
- quiz start -> `s5`
- `s5` -> lead submit
- lead submit -> booking confirmed

Breakdown minimums:

- `first_utm_content`
- `first_hero_hook`
- `quiz_who`

## Replay slice strategy

When diagnosing drops:

- Slice by clear cohort definitions (for example, landed-no-CTA, s5-no-submit).
- Use actor lists from cohort-specific queries.
- Keep replay links in a dated diagnostic note.
