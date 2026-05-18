# Claude Code and gstack

[Garry Tan’s gstack](https://github.com/garrytan/gstack) is an open-source Claude Code setup (slash commands for plan, review, QA, ship). Illuminairy **documents** gstack; we do not vendor the full repo.

## Install gstack (global)

Requires [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Git, and Bun.

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Add a `gstack` section to your user or project `CLAUDE.md` per gstack’s README. Optional team mode: see gstack `setup --team` and `gstack-team-init`.

## Illuminairy overrides (always win over generic gstack)

1. Read [`AGENTS.md`](../../AGENTS.md) and [`memory-bank/activeContext.md`](../../memory-bank/activeContext.md) first.
2. Product facts live in [`lib/site.ts`](../../lib/site.ts) — do not invent tuition, dates, or structure.
3. Never expose `TUTOR_CALENDLY_URL` on public pages or `NEXT_PUBLIC_*` env.
4. No SAT score guarantee language — see brand docs.
5. Before claiming done: `npm run agent:verify` (or `npm run lint` + `npm run build`).

## Suggested gstack flow for this repo

| Step | gstack command | Purpose |
|------|----------------|---------|
| 1 | `/office-hours` | Clarify problem and user |
| 2 | `/plan-ceo-review` or `/plan-eng-review` | Scope and architecture |
| 3 | Implement with spec in `specs/` | — |
| 4 | `/review` | Code + security + brand |
| 5 | `/qa https://…` | Staging smoke (if URL available) |
| 6 | `/ship` | PR / merge checklist |

## Cursor ↔ gstack mapping

| gstack | Cursor (this repo) |
|--------|-------------------|
| `/office-hours` | Skill `illuminairy-plan` |
| `/plan-eng-review` | `illuminairy-plan` + [`architecture.md`](../architecture.md) |
| `/review` | `illuminairy-review` |
| `/ship` | `illuminairy-ship` |
| `/investigate` | `illuminairy-investigate` |
| `/autoplan` | `specs/` PRD + `specs/ralph/PLAN.md` |

## OpenClaw / other agents

If you spawn Claude Code from another agent, prefix prompts with: “Load gstack. Follow Illuminairy AGENTS.md.” See gstack `docs/OPENCLAW.md` for dispatch examples.

## What we did not add to this repo

- Vendored gstack copy (drift, size)
- All 23 slash commands duplicated in Cursor
- Autonomous overnight coding loops
