# Cold traffic perf gate — landing + funnel

Mobile Lighthouse for **both** parts of the cold Meta path:

1. **Landing page** — parent sees the ad message and taps the CTA (`/sat-plan-builder`)
2. **Quiz funnel** — first question after the tap (`/plan-b?step=q1-parent-child`)

Both must pass before scaling ad spend.

## Targets (lab, simulated mobile)

| Surface | ID | URL | Perf | LCP |
|---------|-----|-----|------|-----|
| **Landing** — ad3 LP | `landing-ad3` | `/sat-plan-builder?…&hook=tutor&pb=b` | ≥ 85 | ≤ 2.5s |
| **Funnel** — Plan B step 1 | `funnel-plan-b-entry` | `/plan-b?step=q1-parent-child&pb=b` | ≥ 85 | ≤ 2.5s |

LCP on landing should be **hero or trust copy** in the first HTML response — not footer or content that waits on JavaScript.

**Note:** Live Meta ads use `/sat-plan-builder`, not homepage `/`. Homepage is organic/legacy and is **not** in this gate.

## Automated lab run

```bash
# Production — landing + funnel
LIGHTHOUSE_BASE=https://illuminairy.com npm run perf:cold-funnel

# Local (dev server on :3000)
LIGHTHOUSE_BASE=http://localhost:3000 npm run perf:cold-funnel

# Landing only
LIGHTHOUSE_SCOPE=landing LIGHTHOUSE_BASE=https://illuminairy.com npm run perf:cold-funnel

# Funnel only
LIGHTHOUSE_SCOPE=funnel LIGHTHOUSE_BASE=https://illuminairy.com npm run perf:cold-funnel
```

Output: `exports/lighthouse-ad-funnel/report.json` (includes `summary.landing` and `summary.funnel`) plus per-URL JSON:

- `landing-ad3.json`
- `funnel-plan-b-entry.json`

Legacy filenames `sat-plan-builder.json` / `plan-b-entry.json` are replaced on the next run.

## Real device checklist (do before scaling ad spend)

1. Open the **exact ad URL** in **Instagram in-app browser** on an iPhone.
2. **Landing:** headline readable in ~2s; CTA tappable.
3. Tap CTA → **Funnel:** “Who needs SAT help?” without a blank flash.
4. Tap **My child** → advances on first try.

## PostHog sanity (after deploy)

On `/sat-plan-builder` and `/plan-b?step=q1-parent-child`:

- `landing_viewed` / quiz step events fire **after first scroll or tap** (deferred analytics), not on raw HTML paint.
- Funnel: LP view → Plan B step 1 → first answer. Watch drop before first tap if speed regresses.

## Architecture (what we ship)

| Fix | Landing (`/sat-plan-builder`) | Funnel (`/plan-b`) |
|-----|------------------------------|---------------------|
| Critical CSS | `landing-critical.css` inlined | `quiz-b-critical.css` inlined |
| Deferred CSS | `landing-deferred.css` on idle | `quiz-b-deferred.css` on idle |
| SSR shell | `AdLpHeroShell` | `PlanBEntryShell` |
| Below-fold defer | Trust bar + footer | Booking/post CSS on later steps |
| Minimal JS | `ColdFunnelProviders` + dynamic `LandingPage` | Dynamic `QuizRunner` |

## When lab fails but phone feels fine

Lighthouse uses throttled CPU/network. Still fix lab regressions before scaling — cold Meta traffic skews slower than your test phone.
