/**
 * PostHog event names for growth experiments.
 * Do not rename during an active experiment — treat as immutable.
 * Instrument captures in a follow-up spec using these constants.
 */

export const AnalyticsEvents = {
  scheduleCtaClick: "schedule_cta_click",
  enrollCtaClick: "enroll_cta_click",
  checkoutStarted: "checkout_started",
  checkoutCompleted: "checkout_completed",
  contactFormSubmitted: "contact_form_submitted",
  leadMagnetSubmitted: "lead_magnet_submitted",
  leadMagnetDownloadViewed: "lead_magnet_download_viewed",
  getStartedIntakeSubmitted: "get_started_intake_submitted",
  getStartedScheduleViewed: "get_started_schedule_viewed",
  funnelLandingView: "funnel_landing_view",
  funnelCtaClick: "funnel_cta_click",
  assessmentStart: "assessment_start",
  intakeStepView: "intake_step_view",
  intakeStepBack: "intake_step_back",
  intakeAnswerToggle: "intake_answer_toggle",
  intakeStepComplete: "intake_step_complete",
  assessmentComplete: "assessment_complete",
  intakeCompleted: "intake_completed",
  schedulePageView: "schedule_page_view",
  listFitStarted: "list_fit_started",
  listFitCompleted: "list_fit_completed",
  listFitCtaApply: "list_fit_cta_apply",
  platformWaitlistSubmitted: "platform_waitlist_submitted",
  daniellePortalLogin: "danielle_portal_login",
  daniellePortalPageView: "danielle_portal_page_view",
  postCallSalesPageViewed: "post_call_sales_page_viewed",
  postCallPaymentClicked: "post_call_payment_clicked",
  postCallPaymentCompleted: "post_call_payment_completed",
  postCallLinkSent: "post_call_link_sent",
  personalizedEnrollPageViewed: "personalized_enroll_page_viewed",
  personalizedEnrollPaymentClicked: "personalized_enroll_payment_clicked",
  standardEnrollPageViewed: "standard_enroll_page_viewed",
  standardEnrollPaymentClicked: "standard_enroll_payment_clicked"
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
