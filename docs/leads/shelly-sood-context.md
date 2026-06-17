# Shelly Sood — lead context + follow-up plan

*Last updated: 2026-06-16*

## Contact

| Field | Value |
|-------|--------|
| Parent | **Shelly Sood** (public brand; Zoom showed "Arini Kiran" on join — confirm preferred name) |
| Email | shellysood@hotmail.com |
| Phone | (469) 444-0226 |
| Location | Southern California ([shellysood.com](https://www.shellysood.com/)) |
| CRM lead ID | `824ec40f-a4d9-4823-902a-8024740909d2` |
| Strategy Call | 2026-06-16 15:30 EDT — **attended** (CRM may still show `call_booked`; update `attended_at`) |

## Family

- Spouse: Nikhil
- Children: **Aliya**, **Shaun**, **Evan** (site bio; photo suggests age order may not match list order)
- **Working assumption:** Shaun = rising senior (he, 1330, Aug 22 sprint); Aliya = younger (she, 9th/10th, standard 2×/wk). Evan not on this SAT push.
- Quiz captured `kidName: "Shelly"` — duplicate/placeholder; **ignore**. Confirm names in follow-up email.

## Call summary (Jun 16)

- Two kids need SAT support; asked for **written cost breakdown** + email after call.
- **Younger:** standard plan, **2 sessions/week**, open-ended timeline; math-only tutoring + math-only diagnostic (confirm which child in email).
- **Senior:** **bootcamp / crash course**, **4 sessions/week**, backward from **Aug 22, 2026** SAT; 1330 current, ~1450 goal, 3 prior attempts; math+R/W diagnostic.
- **Pricing discussed:** $249 diagnostic; $99/wk (2×); no contract; **two same-day diagnostics for $249 total**.
- **She asked:** tutor credentials, no contract (confirmed), diagnostic discount for two kids.
- **You said on 1:1:** *"$99 per week … two hourlong sessions per week. One-on-one."* She echoed. Pages must **not** show "3 of 4 sessions small group" for her leads (override included bullet).

## Attribution (quiz)

- Meta `c1_sat_plan_builder_cold_creative_test`, mobile, `/sat-plan-builder`
- Quiz profile fits **senior** (1200–1300 band, 3+ attempts, aug22, goal 1400, group class didn't help)

## Deliverables (built 2026-06-17)

1. **Follow-up email draft:** [`shelly-sood-followup-email.md`](./shelly-sood-followup-email.md) — review before send
2. **`/enroll/shelly-standard`** — standard enroll; `faqPreset: shelly-standard` (8 FAQs); $249 + $99/wk; 1:1 included override; no student name on page (confirm in email)
3. **`/enroll/shelly-aug22-sprint`** — August 22 SAT Sprint; 4×/wk **$198 → $175/wk** (family discount on page); diagnostic $249 → $0 (family bundle); `faqPreset: shelly-sprint`
4. **`lib/standard-enroll-faq-bank.ts`** — SSOT FAQ ids + presets
5. **FAQ bank additions:** `contract`; expanded `tutor-credentials`

## Stripe (prod)

| Item | ID |
|------|-----|
| Sprint weekly product ($175/wk) | `prod_UimaXmu7UDx54U` |
| Sprint weekly price | `price_1TjL1i2MLg6PnhtQzdSQSijg` |
| Family diagnostic coupon ($249 off) | `ocOXTShE` |
| Display promo code | `SHELLY-2DIAG` (auto-applied on sprint page UI; checkout uses SetupIntent, no PI) |
| Standard diagnostic product | `prod_UfmBm2GawHFXRA` (unchanged) |
| Standard weekly product ($99/wk) | `prod_UfmE3JUG5ykfSk` (unchanged) |

Setup script: `node --env-file=.env.local scripts/setup-shelly-stripe.mjs`

## FAQ presets (Shelly)

**Keep (standard, 8):** paying today, contract, diag results, weekly start, tutor credentials, same tutor, progress reports, scheduling.

**Keep (sprint, 6):** same minus scheduling; weekly-start answer adds Aug 22 backward-planning line.

**Remove (11):** time-per-week, session length, sessions-per-week, improvement speed, program duration, all 3 About the SAT, score increase possible, student effort, reschedule.

## Copy consistency checklist

| On call | Page |
|---------|------|
| 1:1 for $99/2× | Override included bullet (not 3/4 small-group) |
| No contract | Contract FAQ |
| Tutor grad students, 1450+, shadowing, section specialists | Expanded tutor FAQ |
| Two diags / $249 bundle | Email + checkout metadata |
| 4×/wk intensive (August sprint plan) | Sprint pay card only |

## Do not use

- `/enroll/michelle-michaela` — wrong family
