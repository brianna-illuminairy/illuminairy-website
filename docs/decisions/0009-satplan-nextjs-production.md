# ADR 0009: SAT plan funnel on Next.js (`/satplan`)

**Status:** Accepted  
**Date:** 2026-05-23

## Context

An HTML + in-browser Babel prototype lived in the sibling `quizfunnel` repo (`prototype/`). It was useful for fast layout review but is **slow**, not SEO-safe, and duplicates work if we later “port” to production.

## Decision

- **Production funnel:** Next.js App Router at **`/satplan`** in this repo.
- **Components:** `components/sat-plan/*` + `lib/sat-plan-funnel/*` (compiled at build time; `next/font`).
- **Specs / copy / screen checklists:** remain in [github.com/brianna-illuminairy/quizfunnel](https://github.com/brianna-illuminairy/quizfunnel).
- **`quizfunnel/prototype/`:** frozen reference — **do not add screens or ship ads to it**.

## Consequences

- Agents and humans default to `npm run dev` → `/satplan`, not `python3 -m http.server` + Babel.
- `quizfunnel/` is gitignored in this repo; eslint/tsc exclude `quizfunnel/**`.
- Launch: remove `noindex` on `app/satplan/layout.tsx` when ready for Meta.
