---
name: ralph-iteration
description: Execute one Ralph PLAN task only — read active spec, implement, verify, update PLAN. Use after npm run ralph:next.
---

# Ralph iteration

## When to use

- User pasted output from `npm run ralph:next`
- Working through `specs/ralph/PLAN.md`

## Rules (strict)

1. **One task** from PLAN — ignore other open tasks this session.
2. Read `specs/ACTIVE.md`, `AGENTS.md`, `memory-bank/activeContext.md`.
3. Implement only what the task acceptance criteria require.
4. Run `npm run agent:verify` before marking done.
5. Mark task `- [x]` in `specs/ralph/PLAN.md` if verify passes.
6. Reply **RALPH_DONE** or **RALPH_BLOCKED** (add reason under the task in PLAN).

## References

- `docs/agentic-development/ralph-loop.md`
- `scripts/ralph-loop.mjs`
