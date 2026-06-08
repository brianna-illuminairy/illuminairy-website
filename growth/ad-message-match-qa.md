# Ad ↔ LP message-match QA

Run **before turning on spend**. Parent must see ad headline echoed on LP hero within ~3 seconds.

## v4 live variants (Jun 2026 — use these, not b3a/b3b/b3c)

| `lp_variant` | Headline | Meta `utm_content` | `hook` param |
|---|---|---|---|
| `variant-goodgrades-lowSAT` | Your child has good grades. / **So why a low SAT score?** | `concerned_mom_good_grades_low_sat`, `script_5` | `gap` or omit |
| `variant-beforetutoringmoney-realistic-score` | Before SAT tutoring. / **Find out what's realistic first.** | `ad3_before_tutoring` | `tutor` |
| `variant-highgpa-ap-lowsat` | High GPA, hard AP/IB/honors classes. / **But low SAT?** | `ad4_mom_first_story`, `ad5_high_gpa_student_story` | `student_story` |

**Never use `hook=mom_story`.** ad4 and ad5 share the same video; both use `variant-highgpa-ap-lowsat`.

Canonical URLs: [`lib/marketing/meta-live-creatives.ts`](../lib/marketing/meta-live-creatives.ts) via `metaLiveCreativeUrl()`.

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

## Meta ad preview sim

`/?utm_source=facebook&utm_campaign=sat-lp-b3b-results&utm_content=hook-182&fbclid=test`

Confirm PostHog + GA4 receive matching `utm_campaign` and `sat_lp_variant`.

## Sign-off

- [ ] B3a message-match on iPhone Safari
- [ ] B3b message-match on iPhone Safari
- [ ] B3c message-match on iPhone Safari
- [ ] UTMs persist through LP → quiz → S5 lead row
- [ ] Viewport + performance pass ([b3-lp-viewport-qa.md](./b3-lp-viewport-qa.md))
