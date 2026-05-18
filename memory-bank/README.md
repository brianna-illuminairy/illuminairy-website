# Memory bank

Persistent context for humans and AI working on Illuminairy. Inspired by the [Cursor memory bank](https://docs.cursor.com) pattern: small markdown files that survive chat resets.

## Files

| File | Purpose | Update frequency |
|------|---------|------------------|
| [projectbrief.md](projectbrief.md) | Mission, scope, constraints | Rarely |
| [productContext.md](productContext.md) | Programs, audience, business goals | When offerings change |
| [systemPatterns.md](systemPatterns.md) | Architecture patterns and conventions | When patterns change |
| [techContext.md](techContext.md) | Stack, env vars, deploy, tooling | When stack or ops change |
| [activeContext.md](activeContext.md) | Current focus, recent work, next steps | **Every meaningful session** |
| [progress.md](progress.md) | Done / in progress / backlog | **Every meaningful session** |

## How to use

1. **Start of session** — Skim `activeContext.md` and `progress.md`.
2. **During work** — Follow `AGENTS.md` and `docs/architecture.md`.
3. **End of session** — Update `activeContext.md` and `progress.md`; add an ADR if you made a durable decision.

## Relationship to other docs

- **Brand & copy** → `docs/` (voice, visual, SAT messaging, competitor intel)
- **Decisions (ADRs)** → `docs/decisions/`
- **Agent instructions** → `AGENTS.md` and `.cursor/rules/`
