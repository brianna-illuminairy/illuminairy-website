# Funnel Eventing and State

## Purpose

Define a durable state and eventing architecture for anonymous, mobile-first quiz funnel traffic.

## Principles

1. Server canonical state wins.
2. Client storage is a cache.
3. Cookies are fallback only.
4. Analytics failures must never block UX.

## Canonical state model

- Identity: `visitors.id` (`visitor_id`)
- Attribution:
  - `visitors.first_touch` for first-touch truth
  - `visitors.last_touch` for latest-touch context
- Audience:
  - `visitors.quiz_who` and `visitors.quiz_answers.qWho`

## Eventing contract

Every write path must enrich from canonical visitor context before persisting events:

- `/api/attribution/touch`
- `/api/funnel/lead`
- `/api/funnel/calendly-book`

Required enrichment fields:

- `utm_source`, `utm_campaign`, `utm_content`
- `hero_hook`
- `qWho`
- `visitor_id`

## Client storage contract

- `sessionStorage` attribution is a short-lived cache.
- `localStorage` quiz progress is primary for client resume.
- `qf_snapshot` cookie is fallback only when localStorage fails.
- `illuminairy_vid` cookie is fallback only when localStorage visitor id is unavailable.

## Payload constraints

- Sanitize attribution fields before persistence.
- Cap known attribution fields by length.
- Avoid large event payload blobs.

## Rollout safety

- Route logic must be backward-compatible while DB migrations roll out.
- Additive columns only for reporting accelerators.
