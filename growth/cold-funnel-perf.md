# Cold traffic perf — Plan Builder B (landing + funnel)

**Goal:** Parents on a cold Meta tap see headline, trust quote, and a working CTA fast — then step 1 of `/plan-b` without a blank flash. Lab scores are a regression guard, not the product target.

**Live ad path:** `/sat-plan-builder` (ad3 tutor UTMs + `pb=b`) → `/plan-b?step=q1-parent-child`

**Not in this gate:** Homepage `/`, `/plan`, legacy B3 long-form LPs.

---

## What we ship (fixed contract — no runtime “defer trust” decisions)

| Layer | `/sat-plan-builder` + `/sat-free-lesson` (QA) | `/plan-b` step 1 |
|-------|-----------------------------------------------|------------------|
| **First HTML** | Headline, authority line, trust quote, CTA `<Link>` → `/plan-b` | “Who needs SAT help?” + options |
| **Critical CSS** | `landing-critical.css` inlined (hero + trust + CTA) | `quiz-b-critical.css` inlined |
| **Full CSS** | `landing-deferred.css` on idle | `quiz-b-deferred.css` on idle |
| **SSR shell** | `AdLpHeroShell` | `PlanBEntryShell` |
| **Deferred** | Footer only (below fold) | Booking/post step CSS |
| **Before first tap** | Skip auth, PostHog, attribution replay | Dynamic `QuizRunner`; entry analytics after engage/LCP |

Implementation: `ColdPlanBLanding` + `ColdFunnelProviders`. Shared paths: `COLD_PLAN_B_LANDING_PATHS` in `lib/plan-builder-b-routes.ts`.

**UX principle:** Trust copy is 2–3 sentences — it does not slow the page. Slowness was waiting on JavaScript to mount above-fold content. Trust belongs in the **first response**, same as the headline.

---

## Lab gate (mobile, simulated)

```bash
LIGHTHOUSE_BASE=https://illuminairy.com npm run perf:cold-funnel
```

| Surface | ID | Targets |
|---------|-----|---------|
| Landing | `landing-ad3` | Perf ≥ 85 · LCP ≤ 2.5s |
| Funnel | `funnel-plan-b-entry` | Perf ≥ 85 · LCP ≤ 2.5s |

**Landing LCP:** Must be **hero or on-page trust** in first HTML — fail if footer/legal loads late via JS.

**Funnel LCP:** Must be **“Who needs SAT help?”**

Scope one surface: `LIGHTHOUSE_SCOPE=landing` or `=funnel`.

Output: `exports/lighthouse-ad-funnel/report.json`, `landing-ad3.json`, `funnel-plan-b-entry.json`.

---

## Real acceptance test (do before scaling ad spend)

On an **iPhone, Instagram in-app browser**, open the **exact ad URL**:

1. **~2s:** Headline + trust quote + CTA visible (no pop-in of trust after headline).
2. **Tap CTA before anything else loads** — must navigate to `/plan-b` (SSR link works without JS).
3. **Funnel:** “Who needs SAT help?” visible; **My child** advances on first tap.
4. No white flash between LP and funnel.

If phone feels good but lab fails by &lt;100ms, trust the phone for conversion — but investigate regressions before scaling.

---

## PostHog sanity (after deploy)

On `/sat-plan-builder` and `/plan-b?step=q1-parent-child`:

- `landing_viewed` / quiz events fire **after first scroll or tap** (analytics deferred, not above-fold content).
- Funnel: LP → step 1 → first answer. Watch drop before first tap if speed regresses.

---

## When lab fails

1. Check prod returns **200** on both URLs (Vercel deploy + `outputFileTracingIncludes` for critical CSS).
2. View source: trust quote + CTA `href` to `/plan-b` in HTML without executing JS.
3. Re-run lab; if still failing, profile **TBT / JS weight**, not trust copy length.
