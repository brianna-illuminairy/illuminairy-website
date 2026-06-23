# Plan B regional target schools

50-state + DC college picker for `/sat-plan-builder` (Plan B funnel). Parents enter zip on `b-target-schools`; we resolve state, show 3–6 named schools (no SAT numbers in UI), and store picks on the lead for CRM + regional unlock discount.

## Modules

| File | Role |
|------|------|
| `lib/plan-b/school-catalog-data.ts` | Master college list (~160 rows): `id`, `name`, `state`, `composite50`, optional 25th/75th, source |
| `lib/plan-b/school-catalog.ts` | Lookup helpers, `SAT_MIN_COMPOSITE = 1200` |
| `lib/plan-b/data/zip3-to-state.json` | USPS-derived zip3 → state (regenerate via `node scripts/generate-zip3-state.mjs`) |
| `lib/plan-b/zip-to-state.ts` | Zip5 → state code |
| `lib/plan-b/state-neighbors.ts` | Bordering states + ring-2 expansion |
| `lib/plan-b/build-regional-market.ts` | Selection algorithm |
| `lib/quiz-funnel-b/regional-schools.ts` | Public API for funnel + CRM |
| `lib/georgia-flagship-scores.ts` | Re-exports UGA / Georgia Tech / Emory bands from catalog (SEO guides) |

## Selection rules (locked)

| Constant | Value |
|----------|-------|
| `SAT_MIN` | 1200 (`composite50` for SAT submitters) |
| Max in-state | 4 |
| Max regional (bordering) | 3 |
| Top schools per neighbor | 2 (before picking best regional) |
| Max total (UI) | 6 |
| Min options | 3 |

1. **In-state:** catalog schools in market state, `composite50 ≥ 1200`, top 4 by score.
2. **Sparse exception:** if fewer than 2 in-state ≥ 1200, force-include the top in-state school even if below 1200 (one exception max).
3. **Regional:** for each bordering state, take that state's top **2** schools with `composite50 ≥ 1200`; merge and pick the **best 3** by score (excluding in-state picks).
4. **Pad to min 3 / max 6:** ring-2 neighbors → national top schools (same ≥ 1200 rule except the single in-state exception).

Out-of-state schools are never marked `inState: true` (fixes legacy national fallback bug).

## Zip → state

Every US zip resolves to a lowercase state slug (`georgia`, `oklahoma`, `dc`). Unknown / invalid zip uses label **your area** with a national-style pad list; region id `unknown`.

Legacy CRM slugs map via `normalizeLegacyRegionId`: `dc-metro` → `dc`, `national` → `unknown`.

## Stripe coupons

Partner cadence coupons (10% off weekly membership at portal checkout):

| Coupon id | Cadence | List → charge |
|-----------|---------|----------------|
| `partner-college2` | 2×45 min/week | $110/wk → $99/wk |
| `partner-college3` | 3×45 min/week | $165/wk → $148/wk |

Create/update products, prices, and coupons:

```bash
node --env-file=.env.local scripts/setup-plan-b-stripe.mjs
```

Coupon id is chosen from `planBRecommendedPackage(q5)` at regional unlock and remapped to the enrolled package at portal checkout (`planBPartnerCouponId()` in `lib/plan-b/membership-pricing.ts`).

Legacy per-state `SAT-*-10` ids on older leads are remapped at portal enroll when `regional_discount_pct` is set.

## Validation + export

```bash
npm run plan-b:validate-regional-schools   # CI — all 51 markets + zip spot-checks
npm run plan-b:export-regional-schools     # writes exports/plan-b-regional-schools.csv
```

`plan-b:validate-regional-schools` runs in `npm run agent:verify`.

Edge states explicitly checked: WY, AK, HI, RI, MS, OK, GA, TX, FL, DC.

## Updating scores each cycle

1. Edit rows in `lib/plan-b/school-catalog-data.ts` (prefer CDS / admissions pages; update `sourceUrl`, `dataAsOf`).
2. For GA flagship SEO pages, UGA / Georgia Tech / Emory bands flow from the same catalog rows via `lib/georgia-flagship-scores.ts`.
3. Run `npm run plan-b:validate-regional-schools` and review CSV export for thin states (WY, AK, MS, etc.).
4. Re-run Stripe setup only if coupon ids change (they should not).

## Edge-case matrix

| Scenario | Behavior |
|----------|----------|
| 4+ in-state ≥ 1200 | Top 4 in-state + up to 2 regional (6 cap) |
| 1 in-state ≥ 1200 | That school + regional/national pad to ≥ 3 |
| 0 in-state ≥ 1200, 1+ in catalog | Force top in-state (may be &lt; 1200) + pad |
| 0 in-state in catalog | Regional + national only |
| DC | In-state = DC schools; regional from MD/VA |
| AK / HI | Thin in-state; heavy regional/national pad |
