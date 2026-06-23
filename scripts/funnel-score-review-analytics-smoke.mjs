#!/usr/bin/env node
/**
 * June SAT Score Review analytics smoke checklist (manual QA companion).
 * Run after local dev: npm run dev → complete /score-review through book.
 */

console.log(`
June SAT Score Review — analytics smoke checklist

LP (/june-score-review):
  [ ] funnel_landing_view with landing_page=/june-score-review, hero_hook=june_score_review
  [ ] funnel_cta_click → /score-review with UTMs preserved

PostHog (filter funnel_id=june_score_review or URL /score-review):
  [ ] quiz_started on sr-grade
  [ ] score_review_step_viewed for each intake step
  [ ] score_review_phone_verified after OTP
  [ ] score_review_lead_submitted on sr-book lead save
  [ ] score_review_booked on slot confirm
  [ ] score_review_link_shared after share step
  [ ] quiz_thank_you_viewed on sr-thank-you

Meta Test Events:
  [ ] ViewContent on LP
  [ ] Lead — pixel + CAPI same event_id on lead submit
  [ ] Schedule — pixel + CAPI on score review book

GA4 DebugView:
  [ ] score_review_lead_submitted, score_review_booked
  [ ] score_review_booked server milestone (Calendly webhook)

CRM:
  [ ] leads.funnel = sat_score_review
  [ ] lead_calls.call_type = score_review

Docs: growth/score-review-analytics-playbook.md
`);
