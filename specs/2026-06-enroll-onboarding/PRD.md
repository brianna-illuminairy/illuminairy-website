# PRD: /enroll post-payment onboarding

- **Author:** Brianna Zajicek
- **Date:** 2026-06-11
- **Status:** draft — awaiting owner review (written before gstack gate; refresh after approval)
- **UX design:** [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md)
- **Gstack review:** [`docs/enroll-gstack-review.md`](../../docs/enroll-gstack-review.md) — CEO 6.5 · Design 6 · Eng 6
- **Research:** [`docs/enroll-onboarding-research.md`](../../docs/enroll-onboarding-research.md)
- **SPEC:** [`SPEC.md`](./SPEC.md)

## Problem

After Stripe checkout, parents redirect to `/enroll` instead of Stripe's default success page. The current experience fails on three counts:

1. **Scam anxiety** — parents paid "Zytech Development LLC" online and need immediate proof of what they bought, when they're charged next, and who to contact. The page does not fully replace Stripe's confirmation job.
2. **Activation buried** — Skill Diagnostic booking (the program's real start) sits behind too many setup screens. Earlier diagnostic = more weeks before test day.
3. **Wrong product surface** — prior builds copied `/plan` quiz-funnel layout (narrow mobile column, wrong typography) or used agent-invented flows without research. Neither matched the brand guide reference or desktop-first consumer onboarding.

## Audience

**Primary:** parents (45–55, predominantly mothers) who just paid for Illuminairy SAT Prep on behalf of a high-school student.

**Secondary:** the student (14–18), reached by SMS after parent completes setup. Does not see `/enroll`.

**Tertiary:** Illuminairy ops/mentors picking up the account after enrollment.

## Brand promise (testable constraints)

From owner conversation ([session 2a0732d2](2a0732d2-0964-4a5c-9ba0-2b08ed4cb20a)):

1. Make it easy — parent already did the hard part at checkout.
2. Take work off the parent — Illuminairy works with the student now.
3. Inform/involve as much or as little as needed — default low-friction.
4. Book Skill Diagnostic ASAP — activation metric and parent benefit.
5. Named human for billing, progress, support questions.
6. Accurate student data + permission to reach the student.
7. SMS is how students engage — parent acknowledges that reality.
8. Replace Stripe's success page — receipt, trial schedule, what's included, entity name.
9. Echo payment link verbatim — Skill Diagnostic + Plan ($249 upfront) + Weekly Tutoring ($99/wk, 7-day trial).

## Success metrics

| Metric | Target | Source |
|--------|--------|--------|
| Median Stripe success → diagnostic booked | < 3 min | Stripe + Calendly |
| Same-day diagnostic booking rate | ≥ 85% | Stripe + Calendly |
| Required intake completion | ≥ 95% | PostHog + CRM |
| Abandon before diagnostic booked | ≤ 10% | PostHog |
| Week-1 support replies tagged scam-anxiety | 0% | manual review |
| 30-day chargeback rate | ≤ 0.2% | Stripe |

## Scope

### In

- UX per [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md) — 3-screen recommended flow (4-screen alternative documented)
- Stripe receipt zone (live session data)
- Student contact + parent-on-behalf SMS acknowledgment
- Named-human anchor (founder v1)
- Preview mode for QA
- Copy SSOT; no "SAT Accelerator" parent-facing
- Analytics events for activation milestones

### Out

- Parent portal
- Second guardian on `/enroll` (parent portal later)
- Mentor assignment UI
- Post-enroll lifecycle emails
- Stripe payment link changes
- Code until UX design + this PRD approved

## Open questions

See UX design § Open decisions. Plus: Stripe statement descriptor alignment; verification SMS timing.
