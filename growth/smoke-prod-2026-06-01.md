# Production smoke test — 2026-06-01

**Command:** `npm run smoke:prod`  
**Base URL:** https://illuminairy.com

## Summary

| Area | Status |
|------|--------|
| Landing `/` | ✓ |
| B3a `/?lp=b3a` | ✓ |
| Plan Builder `/quiz?step=q1` | ✓ |
| Reveal deep link `/quiz?step=reveal` | ✓ |
| Share API POST/GET | ✓ |
| Shared page + UTMs | ✓ |
| `/plan?step=*` direct URL | ✗ **404** |

**Automated:** 8 passed, 1 failed (plan route).

## Browser QA (manual agent)

| Flow | Result |
|------|--------|
| LP hero CTA → Plan Builder | ✓ lands on `/quiz?step=q1` |
| q1 → q2 in funnel | ✓ |
| Deep link reveal + share panel | ✓ "Share this plan" + "Copy share link" visible |
| Copy share link | Inconclusive in automation (no "Link copied" state; API path verified separately) |

## Findings

1. **`/plan` returns 404** on production (rewrite in `next.config.mjs` not effective for direct requests). Funnel must use **`/quiz`** in router + share CTAs until routing is fixed.
2. **Share virality stack is live:** `POST /api/funnel/plan-share` → public page → CTA with `utm_source=shared_plan`.
3. Re-run after deploy: `npm run smoke:prod`

## Sample share URL (from smoke run)

`https://illuminairy.com/quiz/share/8b56c8e0d73bf0ec61`
