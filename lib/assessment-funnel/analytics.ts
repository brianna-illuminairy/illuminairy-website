"use client";

import posthog from "posthog-js";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents, type AnalyticsEventName } from "@/lib/analytics-events";

const FUNNEL_EVENT_MAP: Record<string, AnalyticsEventName> = {
  funnel_landing_view: AnalyticsEvents.funnelLandingView,
  funnel_cta_click: AnalyticsEvents.funnelCtaClick,
  assessment_start: AnalyticsEvents.assessmentStart,
  intake_step_view: AnalyticsEvents.intakeStepView,
  intake_step_back: AnalyticsEvents.intakeStepBack,
  intake_answer_toggle: AnalyticsEvents.intakeAnswerToggle,
  intake_step_complete: AnalyticsEvents.intakeStepComplete,
  assessment_complete: AnalyticsEvents.assessmentComplete
};

export function trackAssessmentFunnelEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void {
  const props = { funnel_id: "assessment", ...properties };
  if (typeof window === "undefined") return;

  const mapped = FUNNEL_EVENT_MAP[eventName];
  if (mapped) {
    captureAnalytics(mapped, props);
  } else {
    try {
      posthog.capture(eventName, props);
    } catch {
      // ignore
    }
  }

  try {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", eventName, props);
  } catch {
    // ignore
  }
}
