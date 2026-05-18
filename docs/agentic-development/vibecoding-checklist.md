# Vibecoding checklist

Practical habits for AI-assisted work on Illuminairy.

## Start of session

- [ ] Read [`memory-bank/activeContext.md`](../../memory-bank/activeContext.md)
- [ ] Read [`specs/ACTIVE.md`](../../specs/ACTIVE.md) if doing non-trivial work
- [ ] Skim [`AGENTS.md`](../../AGENTS.md) golden rules

## While coding

- [ ] One concern per commit / Ralph task when possible
- [ ] Product facts only in `lib/site.ts` (and schedule in `lib/sat-program-schedule.ts`)
- [ ] No `TUTOR_CALENDLY_URL` in client bundles or sitemaps
- [ ] Customer-facing copy: brand voice + no banned phrases
- [ ] No SAT score guarantees

## Before “done”

- [ ] `npm run agent:verify` (or `lint` + `build`)
- [ ] Env vars documented if you added integrations
- [ ] Update `memory-bank/activeContext.md` and `progress.md` for meaningful work
- [ ] ADR in `docs/decisions/` if architecture or integration changed

## Growth experiments

- [ ] One primary metric per experiment ([growth-autoresearch.md](growth-autoresearch.md))
- [ ] Log in `growth/experiments/`
- [ ] Check guardrails (bounce, brand, verify)

## Do not

- Force-push `main` without explicit request
- Commit `.env.local` or secrets
- Edit `scripts/agent-verify.mjs` or rename analytics events mid-experiment
- Duplicate long copy across TSX files
