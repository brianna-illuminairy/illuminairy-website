# Specs

Spec-driven work for Illuminairy. See [`docs/agentic-development/spec-driven.md`](../docs/agentic-development/spec-driven.md).

## Layout

```
specs/
├── ACTIVE.md           # current SPEC path (one line)
├── _templates/         # PRD + SPEC templates
├── _examples/          # format reference only
└── ralph/PLAN.md       # Ralph task checklist
```

## Quick start

1. `cp specs/_templates/PRD.md specs/2026-05-my-feature/PRD.md`
2. `cp specs/_templates/SPEC.md specs/2026-05-my-feature/SPEC.md`
3. Edit both; set `specs/ACTIVE.md` to `specs/2026-05-my-feature/SPEC.md`
4. Add tasks to `specs/ralph/PLAN.md` if using Ralph
