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
  contactFormSubmitted: "contact_form_submitted"
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
