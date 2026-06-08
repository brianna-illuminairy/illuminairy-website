# SPEC: Mobile Cold-Traffic Funnel Reliability

## Context

Illuminairy receives mostly anonymous mobile traffic from paid Meta campaigns. The funnel must preserve attribution and audience context (`qWho`) across landing, quiz steps, lead submit, and booking, while remaining resilient in in-app browsers and return visits.

## Scope

This spec defines architecture, instrumentation, and operations for:

1. Canonical attribution and audience persistence
2. Fast reporting columns for visitor analytics
3. Mobile funnel QA and observability guardrails

Out of scope:

- Copy rewrites
- New funnel step designs
- SAT product positioning changes

## Architecture decisions

1. **Server canonical model**
   - Canonical identity: `visitors.id` (`visitor_id`)
   - Canonical attribution: `visitors.first_touch`, `visitors.last_touch`
   - Canonical audience: `visitors.quiz_who` plus `visitors.quiz_answers.qWho`
2. **Client model**
   - `sessionStorage` and `localStorage` are caches only
   - Cookies are fallback only for hostile browser/storage conditions
3. **Event enrichment**
   - Touch, lead, booking, and call-booked events resolve attribution and `qWho` from canonical visitor state before persistence

## Phase plan

### Phase A: Stabilize

#### A1. Canonical enrichment lock
- Ensure `/api/attribution/touch`, `/api/funnel/lead`, `/api/funnel/calendly-book` use canonical visitor enrichment.
- Acceptance:
  - No route persists client attribution directly without canonical merge.
  - `qWho` is present on booking + thank-you analytics where visitor context exists.

#### A2. Completeness monitors
- Add monitor queries/docs for:
  - missing `utm_content`
  - missing `hero_hook`
  - missing `qWho`
- Acceptance:
  - Monitor definitions are documented and runnable.
  - Alert threshold defaults are defined.

### Phase B: Reporting

#### B1. Fast visitor columns
- Add + backfill + index:
  - `visitors.first_utm_content`
  - `visitors.first_hero_hook`
  - `visitors.quiz_who`
- Acceptance:
  - Migration is idempotent and included in migration runner.
  - Visitor upsert keeps columns synchronized.
  - Existing data is backfilled from JSON fields.

#### B2. Query contract
- Update reporting docs to use first-class columns for common cohort queries.
- Acceptance:
  - Cohort query examples exist for ad creative, hook, and audience split.

### Phase C: Ops

#### C1. Mobile QA checklist
- Create standing checklist for:
  - iOS/Android in-app browsers
  - new vs return visitors
  - storage degraded conditions
  - hydration/resume/deep-link behavior
- Acceptance:
  - Checklist exists in docs and is referenced from release workflow.

#### C2. Alert thresholds
- Define and document thresholds for attribution completeness and funnel integrity.
- Acceptance:
  - Thresholds and escalation actions documented.
  - "Deploy blocker" criteria explicitly listed.

## Verification

Required:

- `npm run funnel:e2e`
- `npm run funnel:analytics-smoke`
- `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`

Optional but recommended:

- `npm run smoke:prod` post deploy

## Rollout and rollback

Rollout:

1. Deploy code and DB migration together.
2. Run monitoring queries same day.
3. Confirm no regression in funnel conversion baselines.

Rollback:

1. Revert app changes if enrichment regressions appear.
2. Keep added DB columns (non-destructive additive schema).
3. Continue using JSON canonical fields while patching app layer.
