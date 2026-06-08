# Funnel mobile shell — pinned CTA pattern

**Applies to:** Plan Builder (`/plan`), and any future parent funnel that uses `QFScreen`.

This is the **only** approved way to pin step CTAs on mobile. Do not fix tall-step CTAs with per-screen heights, `position: fixed`, or extra wrappers in step files.

## Pattern (flex sticky footer)

One viewport-bound column. Only the **middle** region scrolls.

```
┌─────────────────────────────┐  ← viewport anchor (.qf-funnel-root)
│ chrome (.qf-top)            │  flex-shrink: 0
├─────────────────────────────┤
│ scrollable body (.qf-body)  │  flex: 1; min-height: 0; overflow-y: auto
│   …step content…            │
├─────────────────────────────┤
│ step CTA (.qf-step-actions) │  flex-shrink: 0  (actions= on QFScreen)
├─────────────────────────────┤
│ legal (.qf-funnel-legal)    │  flex-shrink: 0  (layout.tsx only)
└─────────────────────────────┘
```

**Why not `position: fixed` on the CTA?** iOS Safari shifts the layout when the keyboard opens; fixed footers overlap content or disappear. Flex pinning keeps the CTA in document flow while staying visible.

**Why not CSS grid on `.qf-page`?** Mobile Safari has repeatedly dropped the third grid row below the fold when the height chain breaks. Flex column + `min-height: 0` on the scroll child is the reliable pattern.

## Height chain (locked)

Viewport height is set **once** on `.qf-funnel-root`. Every flex child below uses `height: 100%` or `flex: 1` + `min-height: 0`, never another `100dvh`.

| Layer | Class | Role |
|-------|-------|------|
| Site chrome | `main.funnel-main` | Flex bridge from `layout-chrome.tsx` |
| Viewport anchor | `.qf-funnel-root` | **Only** `100dvh` / `100svh` here |
| Column | `.qf-funnel-column` | Step shell + legal strip |
| Fill | `.qf-funnel-fill` | Grows; holds routed page |
| Stage | `.qf-funnel-stage` | `page.tsx` wrapper |
| Provider | `.qf-quiz-provider-fill` | Flex bridge through `QuizProvider` |
| Step | `.qf-funnel-step` | `QFProgressProvider` wrapper |
| Screen | `.qf-page` | Flex column: top / body / actions |

Markers in CSS: `FUNNEL-MOBILE-SHELL-START` … `END` in `app/funnel-responsive.css`.

## Step interaction modes (do not invent CTAs)

Registry: `lib/quiz-funnel/step-interaction.mjs`. Each routed step has **one** mode. Match it; do not add a Continue button to auto-advance or option-tap screens.

| Mode | User action | Step chrome (`actions=`) |
|------|-------------|---------------------------|
| `option-tap` | Tap an option to advance | Optional disabled backup (`QFSingleSelectFooter`) — not required |
| `auto-advance` | Timer advances (`QFInsightHit`) | Progress bar only — **no** `QFButton |
| `multi-continue` | Select options, then Continue | `QFButton` / `QFContinueFooter` |
| `form-continue` | Fill field, then Continue | `QFButton` |
| `explicit-cta` | Tap Continue (or step-specific CTA) | `QFButton` |
| `phased-cta` | Wait for animation, then Continue | Disabled button during phase, then enable (`i2`) |

Reduced motion: auto-advance insight slides fall back to an explicit Continue (accessibility only).

## Step files (content only)

| Allowed | Forbidden |
|---------|-----------|
| Copy, options, cards inside `QFScreen` children | `footer=` on `QFScreen` (use `actions=`) |
| `actions=` matching the step's interaction mode | Inventing `QFButton` on `auto-advance` screens |
| Body components with natural content height | Inline `minHeight` / `height: 100dvh` on step wrappers |
| | `position: fixed` on step buttons |
| | Extra scroll containers around step content |
| | Putting Continue in `.qf-funnel-legal` |

## Locked files

| File | Owns |
|------|------|
| `app/funnel-responsive.css` | Viewport anchor + flex height chain |
| `app/quiz-globals.css` | `html`/`body` overflow + `funnel-main` bridge |
| `app/quiz-funnel.css` | `.qf-page`, `.qf-top`, `.qf-body`, `.qf-step-actions` |
| `app/quiz/components/QFShell.tsx` | Shell DOM + `actions` prop |
| `app/quiz/layout.tsx` | Root column + legal strip |
| `app/quiz/page.tsx` | Stage wrapper (no inline viewport heights) |

Unlock shell edits (humans only):

```bash
FUNNEL_LAYOUT_UNLOCK=1 npm run funnel:cta-guard
```

## Verify

```bash
npm run funnel:cta-guard   # shell pattern + every step has actions=
npm run funnel:e2e         # iPhone 13: CTA in viewport on i-steps, achievability, v1
```

`funnel:cta-guard` runs inside `npm run agent:verify`.
