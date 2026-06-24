# Cold funnel performance

Two separate funnels — do not mix Quiz 1 and Quiz 2 paths.

| Surface | LP | Funnel | CSS |
|---------|-----|--------|-----|
| Quiz 1 | `/` | `/plan` | Sync: `landing-v4.css` + funnel stack |
| Quiz 2 (ad3 HD) | `/sat-plan-builder` | `/plan-b` | Sync: `landing-v4.css` + ad3 shell overrides + critical/deferred Plan B |

## Targets (`npm run perf:cold-funnel`)

| URL | Perf | LCP |
|-----|------|-----|
| `/sat-plan-builder?utm_content=ad3_before_tutoring_hd1080` | ≥ 85 | ≤ 2.5s |
| `/plan-b?step=q1-parent-child&pb=b` | ≥ 85 | ≤ 2.5s |

Artifacts: `exports/lighthouse-ad-funnel/`. See `growth/prod-deploy-checklist.md` for iPhone IG in-app QA.

## Ad3 LP (`/sat-plan-builder`)

- **One server HTML response:** `Ad3HdLandingPage` (navbar, hero, trust, footer)
- **CSS:** shared `landing-v4.css` + thin `sat-plan-builder.css` (scroll shell + system fonts)
- **CTA:** `<Link href={ctaHref}>` to `/plan-b` (works without JS)
- **Analytics:** `funnel_landing_view` via `lib/marketing/ad3-landing-analytics.ts` after defer gate

## Quiz 1 LP (`/`)

- **CTA:** `<Link>` with `planBuilderLandingCtaHref()` — prefetch + middle-click; funnel resumes after hydrate
- **SSR entry shell on `/plan`:** `PlanAEntryShell` mirrors Plan B (no double “Loading your plan…”)

## Plan B funnel (`/plan-b`)

| Layer | File |
|-------|------|
| Critical (inline) | Concat: `aurora-brand` + `quiz-globals` + `funnel-shell` + `quiz-b-core-chrome` + `quiz-b-entry-critical` |
| Deferred (idle) | `quiz-b-deferred.css` → responsive overrides + `quiz-b-core-rest` + `quiz-b-entry-rest` |
| Step chunks | `quiz-b-booking.css`, `quiz-b-post.css` via `usePlanBDeferredCss` |
| SSR entry shell | `PlanBEntryShell` (step 1 only) |

## Analytics deferral

Marketing paths (`/sat-plan-builder`, `/plan-b` entry) defer third-party scripts until LCP or first interaction.

**SSOT:** `AnalyticsReadyProvider` + `useAnalyticsReady()` — one listener set for PostHog, Attribution, GA/Meta, and session replay.

Measure: `npm run perf:cold-funnel`
