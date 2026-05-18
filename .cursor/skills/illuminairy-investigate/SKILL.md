---
name: illuminairy-investigate
description: Debug Illuminairy bugs systematically — reproduce, hypothesize, minimal fix. No drive-by refactors.
---

# Illuminairy investigate

## When to use

- Bug reports, regressions, unexpected API behavior
- Production or local reproduction

## Steps

1. Reproduce — route, env vars, request/response (redact secrets).
2. Narrow — one hypothesis at a time; read relevant route in `app/api/` or component.
3. Fix minimally — smallest change that fixes root cause.
4. Verify — `npm run agent:verify`.
5. Note in `memory-bank/activeContext.md` if non-trivial.

## Avoid

- Large refactors while debugging
- Changing product facts in `lib/site.ts` unless the bug is wrong facts

## References

- `docs/architecture.md`
- `docs/agentic-development/autoresearch-lite.md`
