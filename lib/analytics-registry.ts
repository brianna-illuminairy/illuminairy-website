/**
 * Canonical funnel event names across PostHog, GA4, Meta, Supabase touch_events, Klaviyo.
 * Do not rename during active experiments without updating dashboards.
 */

import { AnalyticsEvents } from "@/lib/analytics-events";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel/step-aliases";

export const TouchEvents = {
  pageView: "page_view",
  attributionCaptured: "attribution_captured",
  internalRedirect: "internal_redirect",
  intakeStarted: "intake_started",
  scheduleViewed: "schedule_viewed",
  funnelCtaClick: "funnel_cta_click",
  funnelLpSmsClick: "funnel_lp_sms_click",
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizStepView: "quiz_step_view",
  quizProgressSync: "quiz_progress_sync",
  quizLeadSubmitted: "quiz_lead_submitted",
  callBooked: "call_booked",
  bookingError: "booking_error",
  attributionReturn: "attribution_return",
  quizScheduleView: "quiz_schedule_view",
  labPhoneVerified: "lab_phone_verified",
  labLeadSubmitted: "lab_lead_submitted",
  labLessonBooked: "lab_lesson_booked",
  labLessonAttended: "lab_lesson_attended",
  labLessonLinkShared: "lab_lesson_link_shared",
  scoreReviewPhoneVerified: "score_review_phone_verified",
  scoreReviewLeadSubmitted: "score_review_lead_submitted",
  scoreReviewBooked: "score_review_booked",
  scoreReviewLinkShared: "score_review_link_shared"
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
  TouchEvents.funnelLpSmsClick,
  TouchEvents.parentConfirmed,
  TouchEvents.quizStarted,
  TouchEvents.quizStepView,
  TouchEvents.quizProgressSync,
  TouchEvents.quizScheduleView,
  TouchEvents.attributionReturn,
  TouchEvents.labPhoneVerified,
  TouchEvents.labLeadSubmitted,
  TouchEvents.labLessonBooked,
  TouchEvents.labLessonLinkShared,
]);

export const PostHogEvents = {
  funnelLandingView: AnalyticsEvents.funnelLandingView,
  funnelCtaClick: AnalyticsEvents.funnelCtaClick,
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizSessionStarted: "quiz_session_started",
  quizStepViewed: "quiz_step_viewed",
  quizLeadSubmitted: "quiz_lead_submitted",
  quizBookingConfirmed: "quiz_booking_confirmed",
  quizThankYouViewed: "quiz_thank_you_viewed",
  quizBookingError: "quiz_booking_error",
  quizBookingValidation: "quiz_booking_validation",
  quizStepBack: "quiz_step_back",
  achievabilityInputEdited: "achievability_input_edited",
  quizDoubtsAnswered: "quiz_doubts_answered"
} as const;

export const Ga4Events = {
  funnelLandingView: AnalyticsEvents.funnelLandingView,
  funnelCtaClick: AnalyticsEvents.funnelCtaClick,
  parentConfirmed: "parent_confirmed",
  quizStarted: "quiz_started",
  quizSessionStarted: "quiz_session_started",
  quizStepView: "quiz_step_view",
  generateLead: "generate_lead",
  schedule: "schedule",
  quizThankYouView: "quiz_thank_you_view",
  quizBookingError: "quiz_booking_error",
  quizBookingValidation: "quiz_booking_validation",
  quizStepBack: "quiz_step_back",
  achievabilityInputEdited: "achievability_input_edited",
  enrollCheckoutViewed: "enroll_checkout_viewed",
  beginCheckout: "begin_checkout",
  purchase: "purchase",
  enrollCheckoutError: "enroll_checkout_error"
} as const;

export const MetaEvents = {
  pageView: "PageView",
  viewContent: "ViewContent",
  funnelCta: "FunnelCTA",
  parentConfirmed: "ParentConfirmed",
  lead: "Lead",
  schedule: "Schedule",
  initiateCheckout: "InitiateCheckout",
  purchase: "Purchase",
  enrollCheckoutError: "EnrollCheckoutError"
} as const;

export const KlaviyoEvents = {
  quizLeadSubmitted: "Quiz Lead Submitted",
  quizCallBooked: "Quiz Call Booked",
  quizCallCanceled: "Quiz Call Canceled",
  quizStepReached: "Quiz Step Reached",
  quizAbandoned: "Quiz Abandoned",
  labLeadSubmitted: "Lab Lead Submitted",
  freeLessonBooked: "Free Lesson Booked",
  freeLessonAttended: "Free Lesson Attended",
  freeLessonCanceled: "Free Lesson Canceled",
  scoreReviewLeadSubmitted: "Score Review Lead Submitted",
  scoreReviewBooked: "Score Review Booked",
  scoreReviewCanceled: "Score Review Canceled"
} as const;

/** Plan Builder B (lab) — PostHog event names. */
export const LabPostHogEvents = {
  labPhoneVerified: "lab_phone_verified",
  labLeadSubmitted: "lab_lead_submitted",
  labLessonBooked: "lab_lesson_booked",
  labLessonAttended: "lab_lesson_attended",
  labPortalLogin: "lab_portal_login",
  labPortalPageView: "lab_portal_page_view",
  labMembershipOfferViewed: "lab_membership_offer_viewed",
  labMembershipOfferClicked: "lab_membership_offer_clicked",
  labLessonLinkShared: "lab_lesson_link_shared",
  planBuilderBStepViewed: "plan_builder_b_step_viewed",
  labComputingPopupAnswered: "lab_computing_popup_answered",
  labPortalEnrollTabViewed: "lab_portal_enroll_tab_viewed",
  labPortalEnrollUnlocked: "lab_portal_enroll_unlocked",
} as const;

/** Plan Builder B (lab) — GA4 event names. */
export const LabGa4Events = {
  labPhoneVerified: "lab_phone_verified",
  labLeadSubmitted: "lab_lead_submitted",
  labLessonBooked: "lab_lesson_booked",
  labLessonAttended: "lab_lesson_attended",
  labPortalLogin: "lab_portal_login",
  labPortalPageView: "lab_portal_page_view",
  labLessonLinkShared: "lab_lesson_link_shared",
  labComputingPopupAnswered: "lab_computing_popup_answered",
  labPortalEnrollTabViewed: "lab_portal_enroll_tab_viewed",
  labPortalEnrollUnlocked: "lab_portal_enroll_unlocked",
} as const;

/** June SAT Score Review funnel — PostHog event names. */
export const ScoreReviewPostHogEvents = {
  stepViewed: "score_review_step_viewed",
  phoneVerified: "score_review_phone_verified",
  leadSubmitted: "score_review_lead_submitted",
  booked: "score_review_booked",
  linkShared: "score_review_link_shared",
} as const;

/** June SAT Score Review funnel — GA4 event names. */
export const ScoreReviewGa4Events = {
  stepView: "score_review_step_view",
  phoneVerified: "score_review_phone_verified",
  leadSubmitted: "score_review_lead_submitted",
  booked: "score_review_booked",
} as const;

/** Milestone steps that trigger Klaviyo "Quiz Step Reached" when profile exists. */
export const KLAVIYO_MILESTONE_STEPS = new Set([
  "achievability",
  "v1",
  "s4",
  "s5",
]);

/** Normalize legacy step IDs before Klaviyo milestone matching. */
export function klaviyoMilestoneStep(step: string): string {
  return canonicalizeQuizStepId(step);
}
