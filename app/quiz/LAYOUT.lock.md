# Plan Builder quiz layout (`/plan`) — step actions lock

**Terminology:** The site **footer** is legal only (Privacy · Terms in `QFFunnelLegal`). Step **Continue** buttons live in **`.qf-step-actions`**, not the footer.

## Shell layout (locked)

| Region | Class | Contents |
|--------|-------|----------|
| Chrome | `.qf-top` | Back, logo, progress |
| Content | `.qf-body` | Step copy, options, cards — **scrolls** when tall |
| Step actions | `.qf-step-actions` | Pinned Continue / step CTA — **not** legal links |
| Legal footer | `.qf-funnel-legal` | Privacy · Terms only (`layout.tsx`) |

Three-row grid on `.qf-page` when `actions` is set. Row 2 scrolls; row 3 stays visible.

**Forbidden:** Putting step CTAs in `.qf-funnel-legal`; `position: fixed` on `.qf-step-actions`; `overflow: hidden` on `.qf-body` for tall steps; using `footer=` on `QFScreen` (renamed to `actions=`).

## Hard rules

1. **Every step** passes `actions` to `QFScreen`. No dead-end screens.
2. **Single-select** — option tap advances; `QFSingleSelectFooter` in `actions` as backup.
3. **Multi-select / forms** — `QFButton` or `QFContinueFooter` in `actions`.
4. **Shell owns step actions** — `QFShell.tsx` renders `.qf-step-actions` as grid row 3. Step files do not add fixed CTAs.

## Locked files

| File | Owns |
|------|------|
| `app/quiz/components/QFShell.tsx` | Chrome, body, **step actions** |
| `app/quiz/components/QFFunnelLegal.tsx` | Privacy · Terms |
| `app/quiz/layout.tsx` | Legal strip below step shell |
| `app/quiz-funnel.css` | `.qf-page--has-actions`, `.qf-step-actions`, `.qf-body` scroll |

## Verify

```bash
npm run funnel:cta-guard
npm run funnel:e2e
```
