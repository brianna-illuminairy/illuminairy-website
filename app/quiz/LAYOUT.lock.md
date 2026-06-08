# Plan Builder quiz layout (`/plan`) — LOCKED

**Mobile shell spec:** `docs/funnel-mobile-shell.md`  
**Cursor rule:** `.cursor/rules/funnel-mobile-shell.mdc`

**Terminology:** The site **footer** is legal only (Privacy · Terms in `QFFunnelLegal`). Step **Continue** buttons live in **`.qf-step-actions`**, not the footer.

## Shell layout (locked)

| Region | Class | Contents |
|--------|-------|----------|
| Chrome | `.qf-top` | Back, logo, progress |
| Content | `.qf-body` | Step copy, options, cards — **scrolls** when tall |
| Step actions | `.qf-step-actions` | Pinned Continue / step CTA — **not** legal links |
| Legal footer | `.qf-funnel-legal` | Privacy · Terms only (`layout.tsx`) |

**Pattern:** Flex column on `.qf-page`. Viewport height **once** on `.qf-funnel-root` (`FUNNEL-MOBILE-SHELL` block in `funnel-responsive.css`). `min-height: 0` on every flex child in the chain.

**Forbidden:** Per-step `100dvh` heights; `position: fixed` on step CTAs; `display: grid` on `.qf-page`; `overflow: hidden` on `.qf-body` for tall steps; `footer=` on `QFScreen`.

## Hard rules

1. **Match interaction mode** — `lib/quiz-funnel/step-interaction.mjs`. Do not invent CTAs (auto-advance stays auto; option-tap stays tap).
2. **Single-select (`option-tap`)** — option tap advances. **No** pinned Continue / backup footer.
3. **Auto-advance** — `QFInsightHit` progress chrome only; `QFButton` only for reduced-motion fallback.
4. **Multi-select / forms / interstitials** — explicit `QFButton` in `actions` when mode requires it.
5. **Shell owns step chrome** — `QFShell.tsx` renders `.qf-step-actions` when `actions` is set. Step files are **content only**.

## Locked files

| File | Owns |
|------|------|
| `app/funnel-responsive.css` | Viewport anchor + flex height chain |
| `app/quiz-globals.css` | `html`/`body` + `funnel-main` bridge |
| `app/quiz-funnel.css` | `.qf-page`, `.qf-top`, `.qf-body`, `.qf-step-actions` |
| `app/quiz/components/QFShell.tsx` | Chrome, body, **step actions** |
| `app/quiz/layout.tsx` | Root column + legal strip |
| `app/quiz/page.tsx` | Stage wrapper |
| `app/quiz/components/QFProgressContext.tsx` | Step flex bridge |
| `app/quiz/state.tsx` | Provider flex bridge |
| `app/quiz/components/QFFunnelLegal.tsx` | Privacy · Terms |
| `lib/quiz-funnel/step-interaction.mjs` | Per-step interaction mode (guard + e2e) |

## Unlock (humans only)

```bash
FUNNEL_LAYOUT_UNLOCK=1 npm run funnel:cta-guard
```

## Verify

```bash
npm run funnel:cta-guard
npm run funnel:e2e
```

Both run inside `npm run agent:verify`.
