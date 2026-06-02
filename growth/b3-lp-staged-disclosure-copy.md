# B3 LP — staged disclosure copy audit

**Strategy:** Cold UGC → Plan Builder first. Hero = free **SAT Improvement Plan**; defer tutor SKU language until below fold / post-quiz.

**Implemented in:** [`lib/landing/content.ts`](../lib/landing/content.ts), [`app/page.tsx`](../app/page.tsx) meta.

---

## Zone rules

| Zone | Say | Avoid |
|------|-----|-------|
| Hero + CTA | Improvement Plan, projection, 5–6 skills, ~2 min, no child test | tutor, 1:1, tuition, enroll |
| Science / reviews | Diagnostic focus, plan outcomes | "Our tutors" as hero proof |
| How it works | Plan Builder → Strategy Call → Skill Diagnostic → weekly plan | quiz, assessment, diagnostic as step 1 |
| Included | What the plan unlocks | 1:1 tutor cart language |
| Great news / final | Outcome + plan CTA | "Explore SAT plans," tutor-built |

---

## Before / after

| Location | Before | After |
|----------|--------|-------|
| `includedItems` | 1:1 vetted SAT tutor; Unlimited tutor messaging | Mistake-driven work on weakest skills; Weekly parent update; SAT advisor support |
| `science.p2` | drill them — … tutoring | drill the right skills — personalized weekly plan |
| `greatNews.lead` | built by a vetted SAT tutor | built from their scores and timeline |
| `greatNews.overlay` | Explore SAT plans | Get their improvement plan |
| `howItWorks` step 4 | tutor + weekly focus | weekly skill focus from diagnostic results |
| `finalCta.checklist` | Personalized by a vetted tutor | Built around the 5–6 skills that move their score |
| `landingDisclaimers.greatNews` | vetted tutors | diagnostic data |
| b3b stats | PATHS BUILT | PLANS BUILT |

---

## Message-match (UGC + LP)

Ads and LP both promise: **free SAT Improvement Plan + score projection** → `/plan?step=q1`. Program detail after Plan Builder.
