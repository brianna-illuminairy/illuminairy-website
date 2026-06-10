# Ad ↔ LP message-match QA

Run **before turning on spend**. Parent must see ad headline echoed on LP hero within ~3 seconds.

## v4 live variants (Jun 2026 — use these, not b3a/b3b/b3c)

| `lp_variant` | Headline | Meta `utm_content` | `hook` param | Ad destination |
|---|---|---|---|---|
| `variant-goodgrades-lowSAT` | Your child has good grades. / **So why a low SAT score?** | **`script_5`** (legacy: `concerned_mom_good_grades_low_sat`) | `gap` | `/sat-plan-builder` |
| `variant-beforetutoringmoney-realistic-score` | Before SAT tutoring. / **Find out what's realistic first.** | `ad3_before_tutoring` | `tutor` | `/sat-plan-builder` |
| `variant-highgpa-ap-lowsat` | High GPA, hard AP/IB/honors classes. / **But low SAT?** | `ad4_mom_first_story`, `ad5_high_gpa_student_story` | `student_story` | `/sat-plan-builder` |
| `variant-enough-time` | Fall deadlines / enough time angle | `ad2_enough_time` | `fall` | `/sat-plan-builder` |

**Never use `hook=mom_story`.** ad4 and ad5 share the same video; both use `variant-highgpa-ap-lowsat`.

**Never send cold ads to `/plan?step=…`.** LP first → hero CTA → `/plan?step=q1-parent-child` with UTMs preserved.

Canonical URLs: [`lib/marketing/meta-live-creatives.ts`](../lib/marketing/meta-live-creatives.ts) via `metaLiveCreativeUrl()`.

Print copy-paste URLs: `npm run marketing:ad-urls`

| Ad id | Paste into Meta |
|---|---|
| ad1_concerned_mom | `https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_concerned_mom_cold_test&utm_content=script_5&utm_term=broad_moms_35_58&hook=gap` |
| ad2_enough_time | `https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad2_enough_time&utm_term=broad_moms_35_58&hook=fall` |
| ad3_before_tutoring | `https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring&utm_term=broad_moms_35_58&hook=tutor` |
| ad4_mom_first_story | `https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad4_mom_first_story&utm_term=broad_moms_35_58&hook=student_story` |
| ad5_high_gpa_student_story | `https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad5_high_gpa_student_story&utm_term=broad_moms_35_58&hook=student_story` |

Re-run `npm run marketing:ad-urls` after editing creatives — this table should match the script output.

## Per-variant checklist (legacy B3 — deprecated)

| Variant | Ad creative must echo | LP hero (verify on device) | UTM campaign |
|---|---|---|---|
| B3a | High GPA / low SAT / fixable | **High GPA. Low SAT. Fixable.** | `sat-lp-b3a-problem` |
| B3b | +182 points / weekly plan / one tutor | **+182 points. Weekly plan. One tutor.** | `sat-lp-b3b-results` |
| B3c | 250,000+ scores / data-backed | **The SAT plan built on 250,000+ student scores.** | `sat-lp-b3c-authority` |

## QA URLs (dev/staging)

- `/?lp=b3a&utm_campaign=sat-lp-b3a-problem&utm_source=facebook`
- `/?lp=b3b&utm_campaign=sat-lp-b3b-results&utm_source=facebook`
- `/?lp=b3c&utm_campaign=sat-lp-b3c-authority&utm_source=facebook`

Live Meta cold ads: use `/sat-plan-builder` URLs from the table above (not `/` or `/plan`).

## Meta ad preview sim

`https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring&hook=tutor&fbclid=test`

Confirm PostHog + GA4 receive matching `utm_campaign`, `utm_content`, and `hero_hook`.

## Sign-off

- [ ] ad1–ad5 message-match on iPhone Safari (in-app browser for Meta)
- [ ] UTMs persist through LP → `/plan` → s5 lead row
- [ ] Ad URLs land on `/sat-plan-builder` only (no funnel deep links)
- [ ] Viewport + performance pass ([b3-lp-viewport-qa.md](./b3-lp-viewport-qa.md))
