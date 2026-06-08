/**
 * Canonical funnel event names across PostHog, GA4, Meta, Supabase touch_events, Klaviyo.
 * Do not rename during active experiments without updating dashboards.
 */

import { AnalyticsEvents } from "@/lib/analytics-events";

export const TouchEvents = {
  pageView: "page_view",
  attributionCaptured: "attribution_captured",
  internalRedirect: "internal_redirect",
  intakeStarted: "intake_started",
  scheduleViewed: "schedule_viewed",
  funnelCtaClick: "funnel_cta_click",
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizStepView: "quiz_step_view",
  quizProgressSync: "quiz_progress_sync",
  quizLeadSubmitted: "quiz_lead_submitted",
  callBooked: "call_booked",
  bookingError: "booking_error",
  attributionReturn: "attribution_return",
  quizScheduleView: "quiz_schedule_view"
} as const;

export type TouchEventName = (typeof TouchEvents)[keyof typeof TouchEvents];

/** Events the browser may POST to /api/attribution/touch */
export const CLIENT_TOUCH_EVENTS = new Set<TouchEventName>([
  TouchEvents.pageView,
  TouchEvents.attributionCaptured,
  TouchEvents.internalRedirect,
  TouchEvents.intakeStarted,
  TouchEvents.scheduleViewed,
  TouchEvents.funnelCtaClick,
  TouchEvents.parentConfirmed,
  TouchEvents.quizStarted,
  TouchEvents.quizStepView,
  TouchEvents.quizProgressSync,
  TouchEvents.quizScheduleView,
  TouchEvents.attributionReturn
]);

export const PostHogEvents = {
  funnelLandingView: AnalyticsEvents.funnelLandingView,
  funnelCtaClick: AnalyticsEvents.funnelCtaClick,
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizStepViewed: "quiz_step_viewed",
  quizLeadSubmitted: "quiz_lead_submitted",
  quizBookingConfirmed: "quiz_booking_confirmed",
  quizThankYouViewed: "quiz_thank_you_viewed",
  quizBookingError: "quiz_booking_error",
  achievabilityInputEdited: "achievability_input_edited"
} as const;

export const Ga4Events = {
  funnelLandingView: AnalyticsEvents.funnelLandingView,
  funnelCtaClick: AnalyticsEvents.funnelCtaClick,
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizStepView: "quiz_step_view",
  generateLead: "generate_lead",
  schedule: "schedule",
  quizThankYouView: "quiz_thank_you_view",
  quizBookingError: "quiz_booking_error",
  achievabilityInputEdited: "achievability_input_edited"
} as const;

export const MetaEvents = {
  pageView: "PageView",
  viewContent: "ViewContent",
  funnelCta: "FunnelCTA",
  parentConfirmed: "ParentConfirmed",
  lead: "Lead",
  schedule: "Schedule"
} as const;

export const KlaviyoEvents = {
  quizLeadSubmitted: "Quiz Lead Submitted",
  quizCallBooked: "Quiz Call Booked",
  quizCallCanceled: "Quiz Call Canceled",
  quizStepReached: "Quiz Step Reached",
  quizAbandoned: "Quiz Abandoned"
} as const;

/** Milestone steps that trigger Klaviyo "Quiz Step Reached" when profile exists. */
export const KLAVIYO_MILESTONE_STEPS = new Set([
  "achievability",
  "reveal",
  "v1",
  "s4",
  "s5"
]);
