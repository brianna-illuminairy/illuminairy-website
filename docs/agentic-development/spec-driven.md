# Spec-driven development

Non-trivial work starts with a written spec so agents and humans share the same definition of done.

## Flow

1. Copy [`specs/_templates/PRD.md`](../../specs/_templates/PRD.md) → `specs/YYYY-MM-slug/PRD.md` (problem, audience, success metrics).
2. Copy [`specs/_templates/SPEC.md`](../../specs/_templates/SPEC.md) → `specs/YYYY-MM-slug/SPEC.md` (acceptance criteria, files, QA).
3. Set [`specs/ACTIVE.md`](../../specs/ACTIVE.md) to the active `SPEC.md` path (one line).
4. For multi-session implementation, break tasks into [`specs/ralph/PLAN.md`](../../specs/ralph/PLAN.md) and use the [Ralph loop](ralph-loop.md).
5. When done: check off PLAN, run `npm run agent:verify`, update `memory-bank/`, add an ADR if the decision is durable.

## When you need a spec

| Do | Skip |
|----|------|
| New page, API route, or integration | Typo, dependency patch |
| Funnel or copy experiment with metrics | One-line CSS tweak |
| Security or payment flow change | Comment-only edits |

## ACTIVE.md

`specs/ACTIVE.md` holds a single relative path, for example:

```
specs/2026-05-enroll-ux/SPEC.md
```

Agents should read that file before implementing when `specs/` is in scope. Clear `ACTIVE.md` or point to `(none)` when no spec is active.

## Example

See [`specs/_examples/contact-form-hardening/SPEC.md`](../../specs/_examples/contact-form-hardening/SPEC.md) for format only — not a committed product task.
