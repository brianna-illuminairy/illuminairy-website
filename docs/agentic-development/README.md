# Agentic development

How humans and AI assistants work in this repo: spec-driven delivery, Ralph loops, engineering autoresearch, growth experiments, and optional Claude Code / gstack.

## When to use what

| Situation | Pattern | Start here |
|-----------|---------|------------|
| New feature or multi-file change | Spec-driven | [`spec-driven.md`](spec-driven.md) → `specs/_templates/` |
| Long task list, many agent sessions | Ralph loop | [`ralph-loop.md`](ralph-loop.md) → `npm run ralph:next` |
| Code quality gate before “done” | Engineering autoresearch | [`autoresearch-lite.md`](autoresearch-lite.md) → `npm run agent:verify` |
| Copy/CTA/funnel experiments | Growth autoresearch | [`growth-autoresearch.md`](growth-autoresearch.md) → `agent/growth-program.md` |
| Claude Code with Garry Tan’s stack | gstack | [`claude-code-and-gstack.md`](claude-code-and-gstack.md) |
| Day-to-day habits | Vibecoding checklist | [`vibecoding-checklist.md`](vibecoding-checklist.md) |

## Repo entrypoints

- **[`AGENTS.md`](../../AGENTS.md)** — golden rules, verification, memory bank
- **[`specs/`](../../specs/README.md)** — PRDs, specs, active work pointer
- **[`specs/ralph/PLAN.md`](../../specs/ralph/PLAN.md)** — Ralph task list
- **[`agent/program.md`](../../agent/program.md)** — engineering research directions (human-owned)
- **[`agent/growth-program.md`](../../agent/growth-program.md)** — growth hypotheses (human-owned)
- **[`.cursor/skills/`](../../.cursor/skills/)** — Cursor project skills (plan, review, ship, investigate, ralph)

## Scripts

```bash
npm run agent:verify   # lint + build (immutable gate)
npm run ralph:status   # show next open PLAN task
npm run ralph:next     # print prompt for one Ralph iteration
```

## Related docs

- [Architecture](../architecture.md)
- [ADRs](../decisions/README.md) — add `0006` for workflow adoption
- [Memory bank](../../memory-bank/README.md)
