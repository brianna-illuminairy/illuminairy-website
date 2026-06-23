#!/usr/bin/env node
/**
 * Plan Builder B analytics smoke checklist (manual QA companion).
 * Run after local dev: npm run dev → complete /plan-b through book.
 */

console.log(`
Plan Builder B — analytics smoke checklist

PostHog (filter plan_builder_funnel = b, URL /plan-b):
  [ ] quiz_started on q1-parent-child
  [ ] parent_confirmed on My child
  [ ] quiz_step_viewed for b-email, b-phone, b-book
  [ ] lab_phone_verified after OTP
  [ ] quiz_lead_submitted on b-book lead save
  [ ] quiz_booking_confirmed on slot confirm
  [ ] lab_lesson_link_shared after share step

Meta Test Events:
  [ ] Lead — pixel + CAPI same event_id on lead submit
  [ ] Schedule — pixel + CAPI on free lesson book
  [ ] FreeLessonAttended — CAPI after meet-attendance (free_lesson call_type)

GA4 DebugView:
  [ ] generate_lead, schedule on book
  [ ] lead_call_attended server milestone after lesson

Portal:
  [ ] InitiateCheckout on membership CTA (after attended)

Docs: growth/plan-b-analytics-playbook.md
`);
