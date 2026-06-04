# Session summary — Compact Meta LP + trust bar (2026-06-02)

Chat export for design, QA, and handoff. **Not deployed** unless explicitly requested after review.

## Goal

National Meta cold traffic to `illuminairy.com/`: **hero + trust strip + legal footer**, message-matched via `utm_content`, no long scroll. Parents (mom ICP) should see believable score proof without tutor-ad ticker vibes or broken mobile layout.

## What shipped in repo (local)

### Compact landing (`/` default)

| Piece | Location |
|-------|----------|
| Layout default `compact` (hero-only) | `lib/quiz-funnel/experiments-layout.ts`, `components/landing/landing-page.tsx` |
| Full LP QA only | `?lp_layout=full` |
| Cold page shell | `components/landing/b3/b3-page.tsx` |
| Text-only hero, hook from UTM | `components/landing/b3/heroes/index.tsx`, `lib/landing/hero-hooks.ts`, `lib/landing/meta-traffic.ts` |
| Legal-only footer | `components/landing/b3/b3-cold-footer.tsx` |
| Sticky mobile CTA | `components/landing/b3/parts/sticky-cta.tsx` |

### Hero copy structure

| Surface | Copy source |
|---------|-------------|
| H1 | `lib/landing/hero-hooks.ts` — default or `utm_content` (e.g. `script_5` → gap hook) |
| Subhead | `satTypicalStudentScoreBands.summaryLine` in `lib/site.ts` only |
| Checklist | `lib/landing/content.ts` → `landingParentChecklist` |
| CTA box | `landingHero.ctaCopy` + `landingCta.hero` |
| Fine print (below CTA) | `landingHero.finePrint` — "Free for parents · about 2 minutes · no test for your child." |
| Hero disclaimer | `landingDisclaimers.heroResults` (+182, n=95, Results vary) |

### Trust bar — score ticker (default)

| Piece | Location |
|-------|----------|
| Marquee score cards + school names | `components/landing/b3/parts/score-trust-bar.tsx` |
| R&W / Math / Total per card | Section rows + total row with +gain, Verified on Ethan |
| Section split rules | `lib/landing/trust-scores.ts` — ~87.5% R&W-stronger, ~12.5% math-stronger (Benjamin, Charlotte); **varied gaps** via `splitTrustScoreTotalIntoSections()` |
| Heritage eyebrow | `tutoringHeritageTrust.eyebrow` in `lib/site.ts` |
| Heading | "Verified score improvements from our customers" |
| Footnote | `landingTrustBarDisclaimer` (no n=95 in trust bar; no ZIP language) |
| Student names | `lib/landing/trust-student-names.ts` |
| Metro schools data | `lib/landing/trust-metro-schools.ts`, `lib/landing/trust-affluent-zips.ts` |

### Trust bar — mom reviews (preview only)

| Piece | Location |
|-------|----------|
| Carousel variant | `components/landing/b3/parts/mom-reviews-trust-bar.tsx` |
| Quotes | `lib/landing/trust-mom-reviews.ts` |
| Switch | `?trust_bar=mom_reviews` (aliases: `reviews`, `moms`) — default remains ticker |
| Router | `components/landing/b3/parts/trust-bar.tsx` |

### Layout fix (broken pages)

**Problem:** `100dvh` + `overflow: hidden` on compact layout squeezed the hero; trust bar overlapped headline; **CTA was off-screen on mobile**.

**Fix:** Removed viewport lock from `.il-layout-hero-only` and `main.funnel-main:has(.il-layout-hero-only)`; hero uses normal flow (`overflow: visible`). Page may scroll slightly on small phones — intentional so nothing is clipped.

CSS: `app/landing/landing-premium.css`, `app/landing/landing-overrides.css`

### Design / QA assets

| Asset | Purpose |
|-------|---------|
| [`public/illuminairy-lp-compact-design.html`](../public/illuminairy-lp-compact-design.html) | Standalone HTML for offline design (gap hook + full ticker) |
| [`scripts/export-lp-compact-design-html.mjs`](../scripts/export-lp-compact-design-html.mjs) | Regenerate export → `~/Downloads/illuminairy-lp-compact-design.html` |
| [`public/lp-review.html`](../public/lp-review.html) | Side-by-side iframes: score ticker vs mom reviews vs full LP |
| [`growth/lp-review-local-desktop.png`](./lp-review-local-desktop.png) | Desktop screenshot reference |
| [`growth/meta-paid-lp-playbook.md`](./meta-paid-lp-playbook.md) | Meta URL + trust bar notes |
| [`growth/trust-bar-suburban-hs-sourcing.md`](./trust-bar-suburban-hs-sourcing.md) | Permissioned HS sourcing rules |

## URLs (local dev)

```text
# Default compact + score ticker
http://localhost:3000/

# Meta script_5 (gap headline)
http://localhost:3000/?utm_source=facebook&utm_content=script_5

# Mom reviews trust bar
http://localhost:3000/?trust_bar=mom_reviews

# Full scroll LP
http://localhost:3000/?lp_layout=full

# Side-by-side review board
http://localhost:3000/lp-review.html

# Offline design file (also in public/)
http://localhost:3000/illuminairy-lp-compact-design.html
```

Regenerate Downloads copy:

```bash
node scripts/export-lp-compact-design-html.mjs
# → ~/Downloads/illuminairy-lp-compact-design.html
```

## Analytics

- `sat_lp_layout`: `compact` | `full` on LP + handoff events
- `hero_hook`, `hero_hook_source`, `traffic_channel`, `preferred_metro` on LP view/CTA
- PostHog flag: `sat-lp-layout` — see `growth/posthog-funnel-dashboard.md`, `growth/meta-lp-events.md`

## Explicit non-goals / constraints from chat

- **Do not deploy** without owner saying so (one deploy happened earlier without ask — do not repeat).
- Keep **stock ticker** as default; mom carousel is preview/compare only.
- No scrollable 16-card grid in trust bar (caused page scroll).
- Stats only from `lib/site.ts`; banned copy per `docs/messaging-guide.md`.

## Open / next

- [ ] Owner design sign-off on compact LP + ticker card density
- [ ] Replace interim LP photos per `growth/b3-lp-image-production-checklist.md`
- [ ] Permissioned real names/schools for ticker per `growth/trust-bar-suburban-hs-sourcing.md`
- [ ] A/B: `trust_bar=mom_reviews` vs ticker (needs PostHog flag or experiment doc)
- [ ] Prod deploy only when requested + `npm run agent:verify`

## Key files touched (this session arc)

```
app/landing/landing-premium.css
app/landing/landing-overrides.css
components/landing/b3/b3-page.tsx
components/landing/b3/heroes/index.tsx
components/landing/b3/parts/score-trust-bar.tsx
components/landing/b3/parts/mom-reviews-trust-bar.tsx
components/landing/b3/parts/trust-bar.tsx
lib/landing/content.ts
lib/landing/trust-scores.ts
lib/landing/trust-bar-variant.ts
lib/landing/trust-mom-reviews.ts
public/illuminairy-lp-compact-design.html
public/lp-review.html
scripts/export-lp-compact-design-html.mjs
```

## Related docs

- [`growth/WHATS-ACTIVE.md`](./WHATS-ACTIVE.md)
- [`growth/b3-lp-viewport-qa.md`](./b3-lp-viewport-qa.md)
- [`docs/messaging-guide.md`](../docs/messaging-guide.md)
