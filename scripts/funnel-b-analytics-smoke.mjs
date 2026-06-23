#!/usr/bin/env node
/**
 * Plan Builder B analytics smoke checklist (manual QA companion).
 * Run after local dev: npm run dev → complete /plan-b through book.
 */

console.log(`
Plan Builder B — analytics smoke checklist

PostHog (filter plan_builder_funnel = b OR funnel_id = plan_builder_b, URL /plan-b):
  [ ] quiz_started + quiz_session_started on first step
  [ ] parent_confirmed on My child
  [ ] plan_builder_b_step_viewed on every step (including hit-q3-none, b-computing, b-post-*)
  [ ] lab_computing_popup_answered on Khan + tutor popups
  [ ] lab_phone_verified after OTP (client + server touch)
  [ ] lab_lead_submitted after phone verify (NOT on b-book patch)
  [ ] lab_lesson_booked + quiz_booking_confirmed on slot confirm only
  [ ] lab_lesson_link_shared after share step

Meta Test Events:
  [ ] Lead — pixel + CAPI same event_id at phone verify (stable lab_lead_{leadId})
  [ ] NO Lead on b-book lead patch (conversion: false)
  [ ] Schedule — pixel + CAPI on free lesson book only (event_id schedule_<inviteeId>)
  [ ] FreeLessonAttended — CAPI after meet-attendance (free_lesson call_type)

GA4 DebugView (all tagged funnel = plan_builder_b):
  [ ] quiz_started, quiz_step_view per step
  [ ] lab_phone_verified, lab_lead_submitted, lab_lesson_booked
  [ ] lab_lesson_attended server milestone after lesson attended

Klaviyo:
  [ ] Lab Lead Submitted, Free Lesson Booked, Free Lesson Attended

Docs: growth/plan-b-analytics-playbook.md
`);
