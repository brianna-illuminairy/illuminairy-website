"use client";

import posthog from "posthog-js";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import { TouchEvents } from "@/lib/analytics-registry";
import { getPostHogKey } from "@/lib/posthog";
import {
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  weeksUntilQ5Test
} from "@/lib/quiz-funnel/gains";
import { readPersistedLpLayout } from "@/lib/landing/layout-storage";
import { readPersistedLpVariant } from "@/lib/landing/variant-storage";
import { PLAN_BUILDER_PATH } from "@/lib/plan-builder-routes";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackQuizGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params ?? {});
}

export function trackQuizStepView(stepId: string, stepIndex: number) {
  trackQuizGaEvent("quiz_step_view", { step: stepId, step_index: stepIndex });
}

export function trackQuizLeadSubmitted() {
  trackQuizGaEvent("generate_lead", { funnel: "sat_quiz" });
}

export function trackQuizSchedule() {
  trackQuizGaEvent("schedule", { funnel: "sat_quiz" });
}

function persistedLpContext() {
  return {
    sat_lp_variant: readPersistedLpVariant() ?? undefined,
    sat_lp_layout: readPersistedLpLayout() ?? undefined
  };
}

export function captureQuizStarted(answers: Record<string, unknown>) {
  if (!getPostHogKey()) return;
  posthog.capture("quiz_started", {
    ...persistedLpContext(),
    q1: answers.q1
  });
  recordClientTouch(TouchEvents.quizStarted, {
    step: "q1",
    step_index: 0,
    ...persistedLpContext()
  });
  trackQuizGaEvent("quiz_started", {
    funnel: "sat_quiz",
    ...persistedLpContext()
  });
}

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  if (!getPostHogKey()) return;
  const props = {
    ...persistedLpContext(),
    step: stepId,
    step_index: stepIndex,
    has_gap_screen: Boolean(options?.hasGapScreen),
    viewport_width:
      typeof window !== "undefined" ? window.innerWidth : undefined,
    q1: answers.q1,
    q2: answers.q2,
    q3: answers.q3,
    q4: answers.q4,
    q5: answers.q5,
    q6: answers.q6,
    q7: answers.q7,
    q8: answers.q8,
    q9: answers.q9
  };
  posthog.capture("quiz_step_viewed", props);
  posthog.capture("$pageview", {
    $current_url: `${window.location.origin}${PLAN_BUILDER_PATH}?step=${stepId}`
  });
  recordClientTouch(TouchEvents.quizStepView, {
    step: stepId,
    step_index: stepIndex,
    sat_lp_variant: props.sat_lp_variant as string | undefined,
    has_gap_screen: Boolean(options?.hasGapScreen)
  });
  if (stepId === "s5") {
    recordClientTouch(TouchEvents.quizScheduleView, { step: stepId, step_index: stepIndex });
  }
  trackQuizStepView(stepId, stepIndex);
}

export function identifyQuizLead(email: string, answers: Record<string, unknown>) {
  if (!getPostHogKey()) return;
  posthog.identify(email, {
    email,
    name: typeof answers.parentName === "string" ? answers.parentName : undefined,
    phone: typeof answers.parentPhone === "string" ? answers.parentPhone : undefined,
    kid_first_name: typeof answers.kidName === "string" ? answers.kidName : undefined
  });
}

export function captureQuizLeadSubmitted(
  answers: Record<string, unknown>,
  eventId?: string,
  options?: { hasGapScreen?: boolean }
) {
  const q4 = answers.q4 as string | undefined;
  const q5 = answers.q5 as string | undefined;
  const q8 = answers.q8 as string | undefined;
  const promisedGain = promisedGainFromQuizAnswers(q4, q5, q8);
  const props = {
    q1: answers.q1,
    q2: answers.q2,
    q3: answers.q3,
    q4: answers.q4,
    q5: answers.q5,
    q6: answers.q6,
    q7: answers.q7,
    q8: answers.q8,
    q9: answers.q9,
    sat_lp_variant:
      (answers.sat_lp_variant as string | undefined) ??
      readPersistedLpVariant() ??
      undefined,
    sat_lp_layout: readPersistedLpLayout() ?? undefined,
    has_gap_screen: Boolean(options?.hasGapScreen),
    showed_gpa_gap: showedGpaGapScreen(q4, answers.q9 as string | undefined),
    promised_gain_pts: promisedGain ?? undefined,
    weeks_until_test: weeksUntilQ5Test(q5),
    booking_source: "client" as const
  };
  if (getPostHogKey()) {
    posthog.capture("quiz_lead_submitted", props);
    const email =
      typeof answers.parentEmail === "string" ? answers.parentEmail.trim() : "";
    if (email) identifyQuizLead(email, answers);
  }
  trackQuizLeadSubmitted();
  if (typeof window !== "undefined" && window.fbq && eventId) {
    window.fbq("track", "Lead", {}, { eventID: eventId });
  } else if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}

export function captureQuizThankYouViewed(answers: Record<string, unknown>) {
  if (getPostHogKey()) {
    posthog.capture("quiz_thank_you_viewed", {
      q4: answers.q4,
      q5: answers.q5,
      has_kid_name: Boolean(
        typeof answers.kidName === "string" && answers.kidName.trim()
      )
    });
  }
  trackQuizGaEvent("quiz_thank_you_view", { funnel: "sat_quiz" });
}

export function capturePlanShareCreated(props: {
  shareId: string;
  includeName: boolean;
}) {
  if (getPostHogKey()) {
    posthog.capture("plan_share_created", props);
  }
  trackQuizGaEvent("plan_share_created", props);
}

export function capturePlanShareLinkCopied(props: {
  shareId?: string;
  native?: boolean;
}) {
  if (getPostHogKey()) {
    posthog.capture("plan_share_link_copied", props);
  }
  trackQuizGaEvent("plan_share_link_copied", props);
}

export function capturePlanShareViewed(props: { shareId: string }) {
  if (getPostHogKey()) {
    posthog.capture("plan_share_viewed", props);
  }
  trackQuizGaEvent("plan_share_viewed", props);
}

export type QuizBookingErrorProps = {
  error_code: string;
  error_message: string;
  http_status?: number;
  step?: string;
  phone_digit_count?: number;
  slot_weekday?: string;
  slots_available?: boolean;
  field?: string;
  retryable?: boolean;
};

/** s5 lead save, Calendly book API, availability load, validation. */
export function captureQuizBookingError(props: QuizBookingErrorProps) {
  const payload = {
    funnel: "sat_quiz",
    step: props.step ?? "s5",
    ...props,
  };
  if (getPostHogKey()) {
    posthog.capture("quiz_booking_error", payload);
  }
  trackQuizGaEvent("quiz_booking_error", payload);
}

export function captureQuizBookingConfirmed(
  eventId?: string,
  options?: { booking_source?: "api" | "client" }
) {
  const bookingSource = options?.booking_source ?? "client";
  if (getPostHogKey()) {
    posthog.capture("quiz_booking_confirmed", { booking_source: bookingSource });
  }
  trackQuizGaEvent("schedule", { funnel: "sat_quiz", booking_source: bookingSource });
  if (typeof window !== "undefined" && window.fbq && eventId) {
    window.fbq("track", "Schedule", {}, { eventID: eventId });
  } else if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Schedule");
  }
}
