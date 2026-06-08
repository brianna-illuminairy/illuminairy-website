# Plan Builder quiz layout (`/plan`) — CTA lock

**Every continue screen must expose a visible footer CTA.** No dead-end steps.

## Hard rules

1. **Every step** uses `QFScreen` with a `footer` prop. No exceptions.
2. **Single-select questions** — option tap advances; no generic Continue footer unless explicitly required.
3. **Multi-select / forms / interstitials** — `footer={<QFContinueFooter … />}` or `QFButton`. Disable until valid when required.
4. **Shell owns CTA placement** — `QFShell.tsx` docks `.qf-footer` as grid row 3; on phones (`max-width: 599px`) it pins fixed to the viewport (all mobile browsers + in-app WebViews).
5. **Do not remove or hide footer** to fit tall content. Body scrolls; on mobile the CTA stays pinned to the viewport bottom.

## Locked files (layout / shell)

| File | Owns |
|------|------|
| `app/quiz/components/QFShell.tsx` | Header, progress, body slot, **docked footer** |
| `app/quiz-funnel.css` | `.qf-page--has-cta`, `.qf-footer`, body scroll |
| `app/funnel-responsive.css` | Funnel column, `qf-funnel-stage` height chain, **mobile fixed footer** |

## Step file rules

| Allowed | Forbidden |
|---------|-----------|
| `headline`, copy, body children, `onContinue` / `onBack` | Custom footer CSS, `position: fixed` CTAs in step files, omitting `footer` on continue screens |

## Verify

```bash
npm run funnel:cta-guard   # static — every QFScreen has footer=
npm run funnel:step-registry
npm run funnel:e2e         # Playwright — CTA visible on every step (needs dev server)
```

`funnel:cta-guard` and `funnel:step-registry` run in `npm run agent:verify`.
