# Claude / AI context

This repository uses shared agent docs. **Start here:**

- **[AGENTS.md](AGENTS.md)** — rules, conventions, verification
- **[memory-bank/activeContext.md](memory-bank/activeContext.md)** — what we're working on now
- **[specs/ACTIVE.md](specs/ACTIVE.md)** — current spec (if any)

For architecture and decisions: [docs/architecture.md](docs/architecture.md), [docs/decisions/](docs/decisions/README.md).

For agentic workflows: [docs/agentic-development/README.md](docs/agentic-development/README.md).

This is the Illuminairy commercial website repo, not an academic coursework repo.

## Coding with agents

### Every session

1. Read `AGENTS.md` and `memory-bank/activeContext.md`.
2. If `specs/ACTIVE.md` is not `(none)`, read that spec before implementing.
3. Before claiming done: `npm run agent:verify`.

### Claude Code + gstack (optional)

Install [gstack](https://github.com/garrytan/gstack) globally — see [claude-code-and-gstack.md](docs/agentic-development/claude-code-and-gstack.md).

Suggested flow for this repo:

| Step | gstack |
|------|--------|
| Product clarity | `/office-hours` |
| Scope / architecture | `/plan-ceo-review`, `/plan-eng-review` |
| Implement | Follow `specs/` + `specs/ralph/PLAN.md` |
| Review | `/review` |
| QA (staging URL) | `/qa https://…` |
| Ship | `/ship` |

**Illuminairy overrides** always win: no tutor Calendly on public site, facts in `lib/site.ts`, no SAT guarantees, `npm run agent:verify` before done.

### Cursor equivalents

| gstack | Cursor skill |
|--------|----------------|
| `/office-hours` | `illuminairy-plan` |
| `/review` | `illuminairy-review` |
| `/ship` | `illuminairy-ship` |
| `/investigate` | `illuminairy-investigate` |
| Ralph loop | `ralph-iteration` + `npm run ralph:next` |
