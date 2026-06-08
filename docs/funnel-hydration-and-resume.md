# Funnel Hydration and Resume

## Purpose

Prevent hydration and resume regressions for mobile return visitors.

## Rules

1. Hydration must be deterministic (no timer-based gates).
2. Redirect guards run only after hydration state is committed.
3. Resume precedence must be explicit and tested.

## Current contract

- Quiz hydration is reducer-gated (`HYDRATE`) before guard redirects.
- `lastStep` writes occur after hydration readiness.
- Analytics/prefetch hooks run only when hydration is enabled.

## Resume precedence

1. Newer local snapshot (client)
2. Server-provided fallback snapshot (cookie mirror)
3. Guarded route step

## Regression tests

Mandatory coverage includes:

- stale-cookie vs newer-local conflict resolution
- deep-link guard behavior after hydration
- return-visit resume to correct guarded step

Current guard test reference:

- `scripts/quiz-funnel-e2e.mjs` (`checkHydrationResumePriority`)

## Anti-patterns to avoid

- `setTimeout`-based redirect gating
- client/server rendering divergence for guarded content
- pre-hydration state writes that can race redirects
