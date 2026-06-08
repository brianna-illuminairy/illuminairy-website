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
4. **Deploy:** commit on `main`, then `npm run release` (git push → Vercel auto-deploy). **Never** `deploy:cli` unless user requests emergency hotfix (`DEPLOY_CLI_OK=1`). See `docs/deploy.md`.
5. For contact/Stripe/Calendly: note manual QA steps.
6. Summarize what shipped and what to verify in production (`npm run smoke:prod`).

## References

- `CONTRIBUTING.md`
- `docs/agentic-development/vibecoding-checklist.md`
