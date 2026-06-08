# PRD: Mobile Cold-Traffic Quiz Funnel

## Problem

Mobile anonymous visitors from paid ads can lose attribution context or audience context across multi-step flows. This creates reporting blind spots and weakens optimization decisions.

## Users

- Primary: Parents arriving from Meta cold traffic on mobile
- Secondary: Internal growth/ops team analyzing dropoff and creative performance

## Goals

1. Preserve canonical attribution (`utm_content`, `hero_hook`) from landing through booking.
2. Preserve audience tag (`qWho`: child vs self) across downstream events.
3. Make ad cohort reporting fast and reliable without brittle joins.
4. Keep mobile flow resilient across in-app browsers and return visits.

## Non-goals

- Redesigning funnel content or layout
- Changing product claims/messaging framework
- Building a new analytics platform

## Success metrics

- >= 98% of downstream funnel events have canonical attribution fields
- >= 98% of downstream funnel events have `qWho` when known
- Zero user-facing failures from analytics/storage fallback paths
- Stable mobile resume/deep-link behavior in e2e and QA

## Requirements

### Functional

- Server canonical visitor enrichment at touch, lead, and booking routes
- Indexed visitor columns:
  - `first_utm_content`
  - `first_hero_hook`
  - `quiz_who`
- Mobile funnel QA checklist and alert thresholds

### Technical

- Additive, idempotent migrations
- Backfill from canonical JSON fields
- Backward-compatible app behavior during rollout

## Risks

- Migration not applied before app deploy
- In-app browser storage edge cases
- Event completeness drops from taxonomy drift

## Mitigations

- Backward-compatible route reads
- Fallback-only cookie strategy with bounded payloads
- Completeness monitors with explicit alert thresholds
