# Funnel sibling architecture

Three parent-facing quiz funnels share infrastructure. Each funnel owns **questions, step order, and route** only. Shell, layout CSS, entry SSR, client bootstrap, and option-tap transitions are shared.

| Funnel | Public route | App dir | Entry step |
|--------|--------------|---------|------------|
| Plan A | `/plan` | `app/quiz/` | `q1-parent-child` |
| Plan B (cold) | `/plan-b` | `app/quiz-b/` | `q1-parent-child` |
| Score Review | `/score-review` | `app/quiz-c/` | `sr-grade` |

## Shared components (`components/funnel-sibling/`)

| Component | Role |
|-----------|------|
| `FunnelLayoutShell` | Root → column → fill (+ optional legal) |
| `FunnelPageStage` | SSR entry shell + client runner wrapper |
| `FunnelWhoEntryShell` | Plan A/B step 1 SSR placeholder |
| `ScoreReviewEntryShell` | Score Review step 1 SSR placeholder |
| `FunnelCriticalCss` | Plan B inline critical (entry chrome only) |
| `DeferredFunnelStylesheet` | Idle-load deep step CSS |
| `funnel-client-root` | `useDismissFunnelEntryShell` |

## Shared libs (`lib/funnel-sibling/`)

| Module | Role |
|--------|------|
| `entry-step.ts` | `isPlanAEntryStep`, `isPlanBEntryStep`, `isScoreReviewEntryStep` |
| `entry-ids.ts` | Stable DOM ids for SSR shells |
| `option-tap-advance.ts` | `commitQuizAnswers` + `scheduleOptionTapAdvance` (flushSync) |
| `critical-css-files.ts` | Plan B critical file list (TS) |
| `css-contract.mjs` | Guard SSOT (Node) |

## Three-tier CSS contract

**Never duplicate layout rules across tiers.** `npm run funnel:css-contract-guard` enforces this in `agent:verify`.

### Tier 1 — Sync layout (every funnel `layout.tsx`)

```tsx
import "../funnel-responsive.css";
```

`funnel-responsive.css` imports:

- `funnel-shell.css` — mobile shell, progress, top bar
- `funnel-column.css` — desktop centered column (not full-bleed)
- `funnel-entry-ssr.css` — SSR entry overlay positioning

Plan A/C also sync-import `quiz-funnel.css` + `quiz-globals.css` for full step styles.

### Tier 2 — Critical inline (Plan B only)

`FunnelCriticalCss` inlines entry chrome (`quiz-b-core-chrome.css`, `quiz-b-entry-critical.css`, brand tokens). **Must not** include shell/column/responsive files.

### Tier 3 — Deferred idle (Plan B only)

`quiz-b-deferred.css` loads deep step styles after idle. **Must not** re-import shell, column, responsive, or `FUNNEL-MOBILE-SHELL` blocks.

## Adding a fourth funnel

1. Create `app/quiz-d/layout.tsx` with `FunnelLayoutShell` + sync `funnel-responsive.css`.
2. Add `page.tsx` with `FunnelPageStage`, optional entry shell, thin `QuizClientRoot` (`dynamic` runner + `useDismissFunnelEntryShell`).
3. Implement funnel-specific `QuizRunner`, `state`, and step libs under `lib/quiz-funnel-d/`.
4. Register layout in `lib/funnel-sibling/css-contract.mjs` → `FUNNEL_LAYOUT_FILES`.
5. If using deferred CSS, register path in `FUNNEL_DEFERRED_CSS_GLOBS` and keep layout CSS out of deferred.
6. Use `commitQuizAnswers` + `scheduleOptionTapAdvance` for auto-advance option taps.

## What each funnel customizes

- Step registry + guards (`lib/*-funnel/`)
- Screen components (`app/quiz-*/screens/`)
- Analytics event names
- LP route + CTA copy
- Optional: critical/deferred CSS split (cold traffic only)

## What stays shared

- Column width and mobile shell
- Client runner hides shell via `.funnel-entry-ssr--dismissed` (never `removeChild`).
- Suspense around `useSearchParams()` in client root
- Error boundaries with resume CTA
- Analytics defer gate (not layout)

See also: `growth/cold-funnel-perf.md`, `docs/funnel-mobile-shell.md`.
