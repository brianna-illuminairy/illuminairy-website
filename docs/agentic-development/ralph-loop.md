# Ralph loop (Wiggum pattern)

Named after the “try again with a fresh brain” idea: **one task per agent session**, progress in a file, verify before marking done.

## Commands

```bash
npm run ralph:status   # next open task from specs/ralph/PLAN.md
npm run ralph:next     # copy-paste prompt for a new session
```

## Rules

1. **One task** per session — do not batch unrelated work.
2. Read [`specs/ACTIVE.md`](../../specs/ACTIVE.md) and the active PLAN task before coding.
3. Run **`npm run agent:verify`** before marking the task complete.
4. Update PLAN checkboxes when done; output `RALPH_DONE` or `RALPH_BLOCKED` (with reason in PLAN).
5. Commit per completed task when the user asked for commits.

## When not to use Ralph

- Ambiguous brand or positioning copy (needs human judgment, not iteration spam).
- Security boundaries (`TUTOR_CALENDLY_URL`, Stripe webhooks, secrets).
- Single-line fixes — just ship in one session.

## PLAN.md format

```markdown
- [ ] Task title — acceptance: …
- [x] Completed task — acceptance: …
```

Use `- [ ]` / `- [x]` so `ralph-loop.mjs` can parse status.

## Human-triggered only

This repo does not run an overnight agent daemon. You run `ralph:next`, paste into Cursor or Claude Code, implement, verify, update PLAN, repeat.
