---
name: illuminairy-ship
description: Pre-merge ship checklist for Illuminairy — agent verify, memory bank, env docs.
---

# Illuminairy ship

## When to use

- User says ready to merge, ship, or deploy
- End of a feature branch

## Steps

1. Run `npm run agent:verify` (or `npm run lint` and `npm run build` if verify unavailable).
2. Confirm CONTRIBUTING checklist: memory-bank updated, ADR if needed, no secrets committed.
3. List new env vars in `.env.example` if any were added.
4. For contact/Stripe/Calendly: note manual QA steps.
5. Summarize what shipped and what to verify in production.

## References

- `CONTRIBUTING.md`
- `docs/agentic-development/vibecoding-checklist.md`
