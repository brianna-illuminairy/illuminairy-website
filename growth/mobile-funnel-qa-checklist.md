# Mobile Funnel QA Checklist

Operational checklist for cold, anonymous ad traffic on `/sat-plan-builder` -> `/plan`.

## Required before deploy

- [ ] `npm run funnel:e2e` passes
- [ ] `npm run funnel:analytics-smoke` passes
- [ ] `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify` passes
- [ ] `npm run funnel:completeness` has no critical threshold breaches
- [ ] Paid ad s5 booking QA on real devices (see device matrix below)
- [ ] Set `PLAN_BUILDER_BOOKING_LIVE=1` and `NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE=1` on Vercel production before turning Meta ads back on

## Paid ad booking gate (until QA sign-off)

Production defaults: **paid ad traffic** (Meta `fbclid`, `utm_medium=paid_social`, Google `gclid`, etc.) sees a **lead-only hold** on s5. No Calendly slots load; booking APIs return `booking_paused`.

- **Organic / direct** `/plan` traffic can still book while you QA ads.
- **QA bypass:** `/plan?plan_booking_qa=$PLAN_BUILDER_BOOKING_QA_SECRET` (7-day cookie; strips secret from URL).
- **Go live for ads:** set both `PLAN_BUILDER_BOOKING_LIVE` env vars to `1`, redeploy, then resume Meta campaigns.

## Device matrix (real device)

- [ ] iOS Safari (new visitor)
- [ ] iOS in-app browser (Instagram or Facebook) (new visitor)
- [ ] Android Chrome (new visitor)
- [ ] Android in-app browser (Instagram or Facebook) (new visitor)

## Return-state matrix

- [ ] Return visitor resumes correct step from local cache
- [ ] Deep-link guard resolves after hydration (no redirect flash loop)
- [ ] Return visitor with changed campaign parameters records attribution return behavior

## UX integrity checks

- [ ] Above-fold CTA visible and tappable
- [ ] Tall-content screens keep action area usable
- [ ] Keyboard open/close does not hide required form controls
- [ ] Consent controls are clear and tappable on narrow viewports

## Eventing integrity checks

- [ ] `funnel_landing_view` fires exactly once per LP load
- [ ] `funnel_cta_click` fires on CTA transition
- [ ] quiz step progression events fire as expected
- [ ] lead and booking paths log canonical `utm_content`, `hero_hook`, `qWho`

## Alert policy

- [ ] Warning threshold: completeness < 98%
- [ ] Critical threshold: completeness < 95%
- [ ] Critical is release-blocking until triaged

## Notes

- Keep screenshots and repro details in `growth/quiz-funnel-qa-log.md`.
- For ad-level drop diagnosis, use cohort-anchored analysis only (landed cohort first, then downstream progression).
