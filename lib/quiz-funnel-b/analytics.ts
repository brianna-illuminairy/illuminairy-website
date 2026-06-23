"use client";

import posthog from "posthog-js";
import { getPostHogKey } from "@/lib/posthog";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import { TouchEvents } from "@/lib/analytics-registry";
import { buildQuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { LAB_ANALYTICS_PROPS, PLAN_BUILDER_FUNNEL_ID } from "@/lib/quiz-funnel-b/constants";
import {
  labFunnelScreenComponent,
  labFunnelScreenLabel,
  labFunnelScreenRole,
} from "@/lib/quiz-funnel-b/funnel-screen-roles";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel-b/funnel-steps";
import type { AchievabilityInputEditedProps } from "@/lib/quiz-funnel/analytics";
import {
  captureAchievabilityInputEdited as controlAchievabilityInputEdited,
  captureParentConfirmed as controlParentConfirmed,
  captureQuizBookingConfirmed as controlQuizBookingConfirmed,
  captureQuizBookingError as controlQuizBookingError,
  captureQuizBookingValidation as controlQuizBookingValidation,
  captureQuizLeadSubmitted as controlQuizLeadSubmitted,
  captureQuizSessionStarted as controlQuizSessionStarted,
  captureQuizStarted as controlQuizStarted,
  captureQuizStepBack as controlQuizStepBack,
  captureQuizStep as controlCaptureQuizStep,
  captureQuizThankYouViewed as controlQuizThankYouViewed,
  identifyQuizLead as controlIdentifyQuizLead,
} from "@/lib/quiz-funnel/analytics";
import { LabGa4Events } from "@/lib/analytics-registry";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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
  trackQuizGaEvent("quiz_step_view", {
    ...labProps(),
    step: canonicalizeQuizStepId(stepId),
    step_index: stepIndex,
  });
}

export function trackQuizLeadSubmitted() {
  trackQuizGaEvent(LabGa4Events.labLeadSubmitted, labProps());
}

export function trackQuizSchedule() {
  trackQuizGaEvent(LabGa4Events.labLessonBooked, labProps());
}

export { controlIdentifyQuizLead as identifyQuizLead };

function labProps(extra: Record<string, unknown> = {}) {
  return { ...LAB_ANALYTICS_PROPS, funnel: PLAN_BUILDER_FUNNEL_ID, ...extra };
}

if (typeof window !== "undefined" && getPostHogKey()) {
  posthog.register(LAB_ANALYTICS_PROPS);
}

export function captureParentConfirmed(qWho: string) {
  controlParentConfirmed(qWho);
}

export function captureQuizStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  controlQuizStarted(answers, meta);
  trackQuizGaEvent("quiz_started", {
    ...labProps(),
    step: canonicalizeQuizStepId(meta.stepId),
    step_index: meta.stepIndex,
  });
}

export function captureQuizSessionStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  controlQuizSessionStarted(answers, meta);
}

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  controlCaptureQuizStep(stepId, stepIndex, answers, options);

  if (!getPostHogKey()) return;

  const step = canonicalizeQuizStepId(stepId);
  posthog.capture("plan_builder_b_step_viewed", {
    ...labProps(),
    step,
    step_label: labFunnelScreenLabel(step),
    funnel_screen_role: labFunnelScreenRole(step),
    funnel_screen_component: labFunnelScreenComponent(step),
    step_index: stepIndex,
    has_gap_screen: Boolean(options?.hasGapScreen),
  });
}

export function captureQuizStepBack(meta: {
  from_step: string;
  to_step: string;
  from_index: number;
  to_index: number;
}) {
  controlQuizStepBack(meta);
}

export function captureQuizLeadSubmitted(
  answers: Record<string, unknown>,
  eventId?: string,
  options?: { hasGapScreen?: boolean }
) {
  controlQuizLeadSubmitted(answers, eventId, options);
  recordClientTouch(TouchEvents.quizLeadSubmitted, {
    ...labProps(),
    quiz_answers: buildQuizAnswersSnapshot(answers),
    has_gap_screen: Boolean(options?.hasGapScreen),
  });
}

export function captureQuizBookingConfirmed(
  eventId?: string,
  options?: { booking_source?: "api" | "client"; qWho?: string }
) {
  controlQuizBookingConfirmed(eventId, options);
}

export function captureQuizBookingError(
  props: Parameters<typeof controlQuizBookingError>[0]
) {
  controlQuizBookingError({ ...props, step: props.step ?? "b-book" });
}

export function captureQuizBookingValidation(
  props: Parameters<typeof controlQuizBookingValidation>[0]
) {
  controlQuizBookingValidation({ ...props, step: props.step ?? "b-book" });
}

export function captureQuizThankYouViewed(answers: Record<string, unknown>) {
  controlQuizThankYouViewed(answers);
}

export function captureAchievabilityInputEdited(props: AchievabilityInputEditedProps) {
  controlAchievabilityInputEdited(props);
}
