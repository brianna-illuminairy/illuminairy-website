# Session — Port SAT Landing v4 to production (2026-06-03)

Ported the offline "SAT Landing v4" design (Claude artifact) into the live LP at `/`, replacing the compact B3 LP. Wired to the quiz funnel, instrumented, QA'd for in-app browsers, and prepped for Vercel deploy.

## What shipped

| Piece | Location |
|-------|----------|
| v4 page shell (funnel logo header, hero, trust bar, footer) | `components/landing/v4/v4-page.tsx` |
| Hero (hook-aware H1 + authority line + navy CTA card) | `components/landing/v4/v4-hero.tsx` |
| 3-stat trust band | `components/landing/v4/v4-trust-bar.tsx` |
| Footer (canonical `policyItems` + `landingDisclaimers.footer`) | `components/landing/v4/v4-footer.tsx` |
| Verbatim v4 copy | `components/landing/v4/v4-content.ts` |
| Styles (scoped `.lp-*`, fonts via next/font vars) | `app/landing/landing-v4.css` (imported in `app/page.tsx`) |
| LP entry renders V4Page | `components/landing/landing-page.tsx` |

## Header / nav
Uses the funnel's `IlluminairyLogoV7` (on-dark) in a navy `.lp-chrome` bar — matches the quiz funnel lockup (per owner request). v4's plain wordmark was dropped.

## CTA → quiz funnel
Hero button calls `onCta("hero")` → `planBuilderEntryFromLanding(search)` → `/plan?step=q1` carrying UTMs + `fbclid`/`gclid`. No funnel changes.

## Sticky CTA — removed
v4 is a compact, minimal/no-scroll page. The hero CTA stays above the fold across the matrix, so the sticky bar was removed (it was redundant and ate vertical space in FB/IG in-app browsers).

## Tracking
- Existing fan-out unchanged: `trackLandingView` (PostHog `funnel_landing_view` + GA4 + Meta `ViewContent`) and `trackLandingCtaClick` (PostHog `funnel_cta_click` + GA4 + Meta `FunnelCTA`). Meta `PageView` via `components/meta-pixel.tsx`.
- **Safari/ITP click-ID capture (new):** `lib/meta-click-ids.ts` reads `_fbp`/`_fbc`, synthesizes `_fbc` from `fbclid`, persists to first-party cookie + the session attribution snapshot. Captured at LP load in `components/attribution-provider.tsx`. `AttributionSnapshot` gained `fbp`/`fbc`. Quiz finale (`app/quiz/screens/Finale.tsx`) now resolves via `resolveMetaClickIds()` with fallback to the persisted snapshot, so the Lead CAPI keeps `fbp`/`fbc` even after ITP expires the pixel cookies.
- Conversion CAPI (Lead/Schedule, `lib/meta-capi.ts`) unchanged — now fed more reliable click IDs.

## Responsive / in-app browsers
- No horizontal overflow at 360–414px.
- CTA above the fold at iPhone (390×844); short-viewport `@media (max-height: 720px)` block compresses hero rhythm so the button fits in FB/IG in-app webview heights (~640px).
- `min-height: 100dvh` on `.lp` (dynamic viewport unit) for in-app chrome.

## Performance
- No images (text + CSS only). Fonts via `next/font` (no extra requests, no CLS). `/` builds as static. `npm run build` green.

## Verify status
- `npm run build`: PASS (`/` static).
- My changed files: lint-clean (0 errors).
- `npm run agent:verify` lint step FAILS on **pre-existing** errors in untouched quiz files (`app/quiz/components/QFV1ProjectionChart.jsx`, `app/quiz/screens/Results.jsx`, `app/quiz/screens/Interstitials.jsx` — React-compiler `setState-in-effect` / unescaped entity). Not introduced here; left for a dedicated funnel-lint cleanup.
- `growth/lp-designs/**` added to eslint ignores (decoded artifact reference, not source).

## Copy risk flags (shipped verbatim per owner)
Not backed by `lib/site.ts`, scrutinized by `.cursor/rules/banned-copy-phrases.mdc`:
- Trust bar "500+ families helped" / "4.8 avg parent rating".
- Authority line "Backed by College Board data from 250,000+ students."
- `+182 avg pts` is backed (n=95).

## Design archive
`growth/lp-designs/` — v1–v4 / AB / compact standalone HTMLs + decoded v4 JSX/CSS + README. v4 = production baseline; others for future A/B tests.

## QA URLs (local)
```
http://localhost:3000/
http://localhost:3000/?utm_source=facebook&utm_medium=paid&utm_content=script_5&fbclid=TEST   # gap hook + click-id capture
```

## Open / next
- [ ] Dedicated cleanup of pre-existing quiz-funnel lint errors so `agent:verify` is green again.
- [ ] Owner decision on the verbatim copy flags above (reconcile to `lib/site.ts` or keep).
- [ ] Post-deploy: confirm `ViewContent` / `FunnelCTA` in Meta Events Manager + Lead CAPI match quality from Safari traffic.
