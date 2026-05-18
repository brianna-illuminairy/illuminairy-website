# ADR-0002: Canonical site config in `lib/site.ts`

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna

## Context

Program facts (tuition, weeks, class structure, SAT date, hero copy) appeared in brand docs and would drift if duplicated across many TSX files.

## Decision

Treat **`lib/site.ts`** (and **`lib/sat-program-schedule.ts`** for calendar tables) as the **single source of truth** for product facts rendered on the site. Brand markdown in `docs/` remains the source for voice, positioning, and design rules; when facts change, update both code and docs.

## Consequences

### Positive

- One place to change tuition, dates, and structure lines
- Agents and humans have an obvious file to search

### Negative / tradeoffs

- Marketing writers must coordinate with code for numeric/factual changes
- Some narrative copy still lives in pages or docs by design

## Alternatives considered

1. **CMS (Contentful, etc.)** — overhead not justified yet
2. **MDX content layer** — adds build complexity for little gain at current size

## References

- [`lib/site.ts`](../../lib/site.ts)
- [`docs/brand-voice-and-positioning.md`](../brand-voice-and-positioning.md)
