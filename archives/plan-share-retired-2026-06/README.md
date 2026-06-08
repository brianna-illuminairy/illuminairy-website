# Plan share feature — retired 2026-06

Read-only Improvement Plan share links (`/plan/share/{id}`) were an experiment and are **not** part of the product.

**Retired from production:** routes, API, funnel UI, smoke checks.

**Left in Supabase:** `plan_shares` table (orphaned rows OK; no new writes).

**Restore:** copy files from this folder back into their original paths and re-run `npm run release`.

Original paths:

| Archive file | Was at |
|--------------|--------|
| `route.ts` | `app/api/funnel/plan-share/route.ts` |
| `page.tsx` | `app/quiz/share/[id]/page.tsx` |
| `share-plan-view.tsx` | `app/quiz/share/[id]/share-plan-view.tsx` |
| `PlanSharePanel.jsx` | `app/quiz/components/PlanSharePanel.jsx` |
| `plan-shares.ts` | `lib/crm/plan-shares.ts` |
| `share-copy.ts` | `lib/quiz-funnel/share-copy.ts` |
| `plan-share-virality.md` | `growth/plan-share-virality.md` |
