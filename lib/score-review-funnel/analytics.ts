"use client";

import posthog from "posthog-js";
import { getPostHogKey } from "@/lib/posthog";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import {
  ScoreReviewGa4Events,
  ScoreReviewPostHogEvents,
  TouchEvents,
} from "@/lib/analytics-registry";
import {
  SCORE_REVIEW_ANALYTICS_PROPS,
  SCORE_REVIEW_FUNNEL_ID,
  SCORE_REVIEW_FUNNEL_KEY,
} from "@/lib/score-review-funnel/constants";
import { canonicalizeQuizStepId } from "@/lib/score-review-funnel/funnel-steps";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function srProps(extra: Record<string, unknown> = {}) {
  return {
    ...SCORE_REVIEW_ANALYTICS_PROPS,
    funnel: SCORE_REVIEW_FUNNEL_KEY,
    ...extra,
  };
}

if (typeof window !== "undefined" && getPostHogKey()) {
  posthog.register(SCORE_REVIEW_ANALYTICS_PROPS);
}

export function trackScoreReviewGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params ?? {});
}

export function captureScoreReviewStepViewed(stepId: string, stepIndex: number) {
  const step = canonicalizeQuizStepId(stepId);
  const props = srProps({ step, step_index: stepIndex });
  if (getPostHogKey()) {
    posthog.capture(ScoreReviewPostHogEvents.stepViewed, props);
  }
  trackScoreReviewGaEvent(ScoreReviewGa4Events.stepView, {
    step,
    step_index: stepIndex,
    funnel_id: SCORE_REVIEW_FUNNEL_ID,
  });
  void recordClientTouch(TouchEvents.quizStepView, props);
}

export function captureScoreReviewStarted(stepId: string, stepIndex: number) {
  const props = srProps({ step: stepId, step_index: stepIndex });
  if (getPostHogKey()) {
    posthog.capture("quiz_started", props);
    posthog.capture("quiz_session_started", props);
  }
  trackScoreReviewGaEvent("quiz_started", { funnel_id: SCORE_REVIEW_FUNNEL_ID });
  trackScoreReviewGaEvent("quiz_session_started", { funnel_id: SCORE_REVIEW_FUNNEL_ID });
}

export function captureScoreReviewPhoneVerified() {
  const props = srProps();
  if (getPostHogKey()) {
    posthog.capture(ScoreReviewPostHogEvents.phoneVerified, props);
  }
  trackScoreReviewGaEvent(ScoreReviewGa4Events.phoneVerified, {
    funnel_id: SCORE_REVIEW_FUNNEL_ID,
  });
  void recordClientTouch(TouchEvents.scoreReviewPhoneVerified, props);
}

export function captureScoreReviewLeadSubmitted(eventId?: string) {
  const props = srProps({ event_id: eventId });
  if (getPostHogKey()) {
    posthog.capture(ScoreReviewPostHogEvents.leadSubmitted, props);
  }
  trackScoreReviewGaEvent(ScoreReviewGa4Events.leadSubmitted, {
    funnel_id: SCORE_REVIEW_FUNNEL_ID,
  });
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", "Lead", {}, { eventID: eventId });
    } else {
      window.fbq("track", "Lead");
    }
  }
  void recordClientTouch(TouchEvents.scoreReviewLeadSubmitted, props);
}

export function captureScoreReviewBooked(eventId: string) {
  const props = srProps({ event_id: eventId });
  if (getPostHogKey()) {
    posthog.capture(ScoreReviewPostHogEvents.booked, props);
  }
  trackScoreReviewGaEvent(ScoreReviewGa4Events.booked, {
    funnel_id: SCORE_REVIEW_FUNNEL_ID,
  });
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", "Schedule", {}, { eventID: eventId });
    } else {
      window.fbq("track", "Schedule");
    }
  }
  void recordClientTouch(TouchEvents.scoreReviewBooked, props);
}

export function captureScoreReviewLinkShared() {
  const props = srProps();
  if (getPostHogKey()) {
    posthog.capture(ScoreReviewPostHogEvents.linkShared, props);
  }
  void recordClientTouch(TouchEvents.scoreReviewLinkShared, props);
}

export function captureScoreReviewStepBack(payload: Record<string, unknown>) {
  if (getPostHogKey()) {
    posthog.capture("quiz_step_back", srProps(payload));
  }
}

export function captureScoreReviewBookingError(payload: Record<string, unknown>) {
  if (getPostHogKey()) {
    posthog.capture("quiz_booking_error", srProps(payload));
  }
}

export function captureScoreReviewThankYouViewed() {
  const props = srProps();
  if (getPostHogKey()) {
    posthog.capture("quiz_thank_you_viewed", props);
  }
  trackScoreReviewGaEvent("quiz_thank_you_view", { funnel_id: SCORE_REVIEW_FUNNEL_ID });
}
