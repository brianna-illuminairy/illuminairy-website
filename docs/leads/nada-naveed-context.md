# Nada Naveed — lead context + August 22 bootcamp

*Last updated: 2026-06-17*

## Contact

| Field | Value |
|-------|--------|
| Parent | **Nada Naveed** |
| Student | **Soha** |
| Email | nj00@hotmail.com |
| Phone | 818-391-0906 |
| CRM lead ID | `8bf26223-7e80-4497-9eaa-e6596cee7e47` |
| Strategy Call | Missed Jun 15, 2026 (phone tag). Free diagnostic comp'd in follow-up email. |

## Offer (August 22 SAT Bootcamp)

| Item | Value |
|------|--------|
| Page | https://illuminairy.com/enroll/nada-soha-aug22-bootcamp |
| Sessions | 3×/wk, **45 minutes** each, **27 total** |
| Schedule | June 23, 2026 through August 21, 2026 (9 weeks) |
| Weekly | **$198 → $149/wk**, first week free (7-day trial) |
| Diagnostic | **$249 → $0** (complimentary; **already completed**) |
| Display code | NADA-DIAG |

## Positioning

- Mistake-driven tutoring ranked from diagnostic (highest-impact misses first)
- Built for students **already above 1250** with a test **less than 12 weeks away**
- **No** "15 points per week" language on page or FAQs

## Stripe (prod)

| Item | ID |
|------|-----|
| Bootcamp weekly product ($149/wk) | `prod_UisrZC9oUpgzFS` |
| Bootcamp weekly price | `price_1TjR5x2MLg6PnhtQuB21qgLu` |
| Complimentary diagnostic coupon ($249 off) | `zLHxYQCy` |
| Display promo code | `NADA-DIAG` |
| Standard diagnostic product | `prod_UfmBm2GawHFXRA` (unchanged) |

Setup script: `node --env-file=.env.local scripts/setup-nada-stripe.mjs`

## FAQ preset

**`nada-bootcamp`:** paying today, contract, weekly start, tutor credentials, same tutor, progress reports, session length (45-min override).

**Excluded:** score increase, improvement speed, time per week, diag results (diagnostic already done).

## Copy checklist

| Requirement | Page |
|-------------|------|
| 3×/wk, 45 min, 27 sessions | Included list + pay row + session-length FAQ |
| $198 → $149/wk | Pay card weekly promo |
| $249 → $0 diagnostic | Pay card + NADA-DIAG label |
| Diagnostic already done | Success copy + paying-today FAQ |
| Mistake-driven / 1250+ / <12 weeks | `introParagraphs` block |
| No 15 pts/wk | FAQ preset omits score-increase |

## Related docs

- As-sent follow-up: [`nada-naveed-followup-email.md`](./nada-naveed-followup-email.md)

## Owner next steps

1. Send enroll link to Nada
2. CRM: update enrollment page URL + note diagnostic comp + bootcamp terms
3. After enroll: schedule first tutoring session (diagnostic already complete)
