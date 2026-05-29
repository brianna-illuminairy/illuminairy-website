"use client";

import posthog from "posthog-js";
import { getPostHogKey } from "@/lib/posthog";

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

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  if (!getPostHogKey()) return;
  const props = {
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
    $current_url: `${window.location.origin}/quiz?step=${stepId}`
  });
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
  eventId?: string
) {
  if (getPostHogKey()) {
    posthog.capture("quiz_lead_submitted", { q4: answers.q4, q5: answers.q5, q8: answers.q8 });
    const email = typeof answers.parentEmail === "string" ? answers.parentEmail.trim() : "";
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

export function captureQuizBookingConfirmed(eventId?: string) {
  if (getPostHogKey()) {
    posthog.capture("quiz_booking_confirmed");
  }
  trackQuizSchedule();
  if (typeof window !== "undefined" && window.fbq && eventId) {
    window.fbq("track", "Schedule", {}, { eventID: eventId });
  } else if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Schedule");
  }
}
