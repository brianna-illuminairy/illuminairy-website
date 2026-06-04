# Landing page design archive

Reference copies of the offline landing-page designs explored in Claude. Kept for future A/B tests and copy/layout pulls. **Not served** (this folder is outside `public/`).

## Standalone files

Each `*.standalone.html` is a self-contained Claude artifact bundle (in-browser Babel/React + gzipped assets). Open by double-clicking, or drag into a browser. They are **not** production code — the production port lives in `components/landing/v4/` + `app/landing/landing-v4.css`.

| File | Notes |
|------|-------|
| `sat-landing-v4.standalone.html` | **Production baseline** — ported to the live LP at `/` (2026-06-03). |
| `sat-landing-v3.standalone.html` | Prior iteration of the v4 direction. |
| `sat-landing-v2.standalone.html` | Earlier single-promise layout. |
| `sat-landing-v1.standalone.html` | First full direction. |
| `sat-landing-ab.standalone.html` | A/B variants in one file. |
| `illuminairy-lp-compact.standalone.html` | Original compact Meta LP export (gap hook + score ticker), pre-Claude redesign. |

## Decoded v4 (readable source)

Extracted from the v4 bundle for reference:

- `v4-data.decoded.jsx` — content model (headline, bullets, sample plan, scores, reviews, disclaimers).
- `v4-components.decoded.jsx` — React sections (Hero, CTA card, trust bar, footer, plan/score figures).
- `v4-styles.decoded.css` — full `.lp-*` stylesheet + `@font-face` (Schibsted Grotesk / DM Sans / DM Mono).

## Copy risk flags (v4, shipped verbatim per owner)

These are not backed by `lib/site.ts` and are scrutinized by `.cursor/rules/banned-copy-phrases.mdc`:

- "500+ families helped" and "4.8★ avg parent rating" (trust bar) — not in `lib/site.ts`.
- "Backed by College Board data from 250,000+ students." (authority line) — reframes the 250k retaker cohort.
- "+182 avg pts" is backed (n=95).
