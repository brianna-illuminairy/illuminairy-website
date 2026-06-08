# Plan Builder quiz layout (`/plan`) — CTA lock

**Every step with a continue action must expose a visible footer CTA.** No dead-end steps.

## Mobile shell pattern (locked)

Three-row CSS grid on `.qf-page` — **not** `position: fixed` on the footer.

| Row | Element | Behavior |
|-----|---------|----------|
| 1 | `.qf-top` | Chrome + progress (fixed height) |
| 2 | `.qf-body` | **Only scroll container** (`overflow-y: auto`, `min-height: 0`) |
| 3 | `.qf-footer` | **Docked CTA** — always visible, never inside the scroll container |

Ancestors (`qf-funnel-root` → `qf-funnel-column` → `qf-funnel-stage` → `qf-page`) use `height: 100%` / `100dvh` and `min-height: 0` so row 2 gets a bounded height and scroll works.

**Forbidden:** `position: fixed` on `.qf-footer` in shell CSS; `overflow: hidden` on `.qf-body` for tall steps; shrinking/removing the footer to fit content.

## Hard rules

1. **Every step** uses `QFScreen` with a `footer` prop. No exceptions.
2. **Single-select** — option tap advances; footer uses `QFSingleSelectFooter` (disabled until a choice; backup Continue).
3. **Multi-select / forms / interstitials** — `QFContinueFooter` or `QFButton`. Disable until valid when required.
4. **Shell owns CTA placement** — `QFShell.tsx` renders `.qf-footer` as grid row 3. Step files must not add custom fixed CTAs.
5. **Tall content** — body scrolls; CTA stays in row 3 on mobile, tablet, and desktop.

## Locked files (layout / shell)

| File | Owns |
|------|------|
| `app/quiz/components/QFShell.tsx` | Header, progress, body slot, **grid-docked footer** |
| `app/quiz-funnel.css` | `.qf-page--has-cta`, `.qf-footer`, `.qf-body` scroll |
| `app/funnel-responsive.css` | Viewport height chain (`qf-funnel-stage` → `.qf-page` at `height: 100%`) |

## Step file rules

| Allowed | Forbidden |
|---------|-----------|
| `headline`, copy, body children, `onContinue` / `onBack`, `footer` prop | Custom footer CSS, `position: fixed` CTAs in step files, omitting `footer` |

## Verify

```bash
npm run funnel:cta-guard   # every QFScreen has footer=; no fixed footer in shell CSS
npm run funnel:step-registry
npm run funnel:e2e         # Playwright — CTA visible + tall-step scroll (needs dev server)
```

`funnel:cta-guard` and `funnel:step-registry` run in `npm run agent:verify`.
