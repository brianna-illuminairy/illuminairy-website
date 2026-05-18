# ADR-0006: Agentic development workflow

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna (owner), AI-assisted implementation

## Context

Illuminairy already had `AGENTS.md`, memory-bank, ADRs, and Cursor rules. Multi-session AI work (specs, Ralph loops, verify gates, growth experiments, Claude Code / gstack) needed a documented, repeatable structure without vendoring large third-party toolchains.

## Decision

Adopt a lightweight agentic workflow in-repo:

- **`docs/agentic-development/`** — guides for spec-driven, Ralph, engineering autoresearch-lite, growth autoresearch, gstack mapping, vibecoding checklist
- **`specs/`** — PRD/SPEC templates, `ACTIVE.md`, `ralph/PLAN.md`
- **`scripts/agent-verify.mjs`** — immutable lint + build gate; **`scripts/ralph-loop.mjs`** — PLAN status and next-task prompts
- **`agent/program.md`**, **`agent/growth-program.md`** — human-owned direction files
- **`growth/experiments/`** — experiment log template
- **`lib/analytics-events.ts`** — immutable PostHog event name constants (instrumentation follow-up)
- **`.cursor/skills/`** — five Illuminairy-specific skills; **`agentic-workflow.mdc`** rule for `specs/**`
- **Claude Code** — document gstack install in `CLAUDE.md`; do not vendor gstack

## Consequences

### Positive

- Clear entrypoints for humans and agents; one-task Ralph reduces context rot
- Engineering and growth loops separated (verify vs funnel metrics)
- Cursor and Claude Code can share the same specs and PLAN

### Negative / tradeoffs

- More markdown to maintain; agents must update memory-bank for discipline to pay off
- PostHog custom events not yet instrumented — growth autoresearch relies on manual/Stripe/Calendly until follow-up spec
- No CI running `agent:verify` yet (optional follow-up)

## Alternatives considered

1. **Vendor full gstack into repo** — rejected (size, drift, Claude-specific)
2. **Overnight Karpathy-style autoresearch runner** — rejected (cost, risk on production marketing site)
3. **Docs only, no scripts** — rejected; user chose standard automation with verify + Ralph helpers

## References

- [docs/agentic-development/README.md](../agentic-development/README.md)
- [AGENTS.md](../../AGENTS.md)
- [garrytan/gstack](https://github.com/garrytan/gstack)
- [karpathy/autoresearch](https://github.com/karpathy/autoresearch)
