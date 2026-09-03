"use client";

import posthog from "posthog-js";
import { analyticsAttributionProps } from "@/lib/analytics-attribution";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import {
  Ga4Events,
  LabGa4Events,
  LabPostHogEvents,
  MetaEvents,
  PostHogEvents,
  TouchEvents,
} from "@/lib/analytics-registry";
import { buildQuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { readPersistedLpLayout } from "@/lib/landing/layout-storage";
import {
  readPersistedLpVariant,
  readPersistedLpVariantId,
} from "@/lib/landing/variant-storage";
import { getPostHogKey } from "@/lib/posthog";
import { LAB_ANALYTICS_PROPS, PLAN_BUILDER_FUNNEL_ID, PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";
import {
  labFunnelScreenComponent,
  labFunnelScreenLabel,
  labFunnelScreenRole,
} from "@/lib/quiz-funnel-b/funnel-screen-roles";
import {
  canonicalizeQuizStepId,
  QUIZ_ENTRY_STEP,
} from "@/lib/quiz-funnel-b/funnel-steps";
import { studentGradeFromPlanBGradeId } from "@/lib/quiz-funnel-b/grade-copy";
import type { AchievabilityInputEditedProps } from "@/lib/quiz-funnel/analytics";
import {
  captureAchievabilityInputEdited as controlAchievabilityInputEdited,
  captureQuizBookingError as controlQuizBookingError,
  captureQuizBookingValidation as controlQuizBookingValidation,
  identifyQuizLead as controlIdentifyQuizLead,
} from "@/lib/quiz-funnel/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export { controlIdentifyQuizLead as identifyQuizLead };

function labProps(extra: Record<string, unknown> = {}) {
  return {
    ...LAB_ANALYTICS_PROPS,
    funnel: PLAN_BUILDER_FUNNEL_ID,
    funnel_id: PLAN_BUILDER_FUNNEL_ID,
    ...extra,
  };
}

function lpContext() {
  return {
    sat_lp_variant: readPersistedLpVariant() ?? undefined,
    sat_lp_layout: readPersistedLpLayout() ?? undefined,
    lp_variant: readPersistedLpVariantId() ?? undefined,
  };
}

function trackLabGa(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, { ...labProps(), ...params });
}

const PARENT_CONFIRMED_KEY = "illuminairy_qfb_parent_confirmed";

export function captureParentConfirmed(qWho: string) {
  if (qWho !== "child" || typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(PARENT_CONFIRMED_KEY)) return;
    sessionStorage.setItem(PARENT_CONFIRMED_KEY, "1");
  } catch {
    // sessionStorage blocked — still fire once this page load
  }

  const lp = lpContext();
  const attr = analyticsAttributionProps();
  const props = labProps({
    ...lp,
    ...attr,
    qWho: "child" as const,
    step: QUIZ_ENTRY_STEP,
  });

  void recordClientTouch(TouchEvents.parentConfirmed, props);
  trackLabGa(Ga4Events.parentConfirmed, props);
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.parentConfirmed, props);
  }
  if (window.fbq) {
    window.fbq("trackCustom", MetaEvents.parentConfirmed, {
      content_name: "sat_score_path",
      content_category: lp.sat_lp_variant,
      sat_lp_layout: lp.sat_lp_layout,
      qWho: "child",
      funnel: PLAN_BUILDER_FUNNEL_ID,
      plan_builder_variant: PLAN_BUILDER_VARIANT,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      utm_source: attr.utm_source,
    });
  }
}

export function captureQuizStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  const step = canonicalizeQuizStepId(meta.stepId);
  const props = labProps({
    ...lpContext(),
    ...analyticsAttributionProps(),
    step,
    step_index: meta.stepIndex,
    quiz_answers: buildQuizAnswersSnapshot(answers),
  });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizStarted, { ...props, first_start_ever: true });
  }
  trackLabGa(Ga4Events.quizStarted, { step, step_index: meta.stepIndex });
  void recordClientTouch(TouchEvents.quizStarted, props);
}

export function captureQuizSessionStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  const step = canonicalizeQuizStepId(meta.stepId);
  const props = labProps({
    ...lpContext(),
    ...analyticsAttributionProps(),
    step,
    step_index: meta.stepIndex,
  });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizSessionStarted, props);
  }
  trackLabGa(Ga4Events.quizSessionStarted, { step, step_index: meta.stepIndex });
}

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  const step = canonicalizeQuizStepId(stepId);
  const snapshot = buildQuizAnswersSnapshot(answers);
  const props = labProps({
    ...lpContext(),
    ...analyticsAttributionProps(),
    step,
    step_label: labFunnelScreenLabel(step),
    funnel_screen_role: labFunnelScreenRole(step),
    funnel_screen_component: labFunnelScreenComponent(step),
    step_index: stepIndex,
    step_seq: stepIndex + 1,
    has_gap_screen: Boolean(options?.hasGapScreen),
    viewport_width: typeof window !== "undefined" ? window.innerWidth : undefined,
    quiz_answers: snapshot,
  });

  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.planBuilderBStepViewed, props);
  }
  trackLabGa(Ga4Events.quizStepView, { step, step_index: stepIndex });
  void recordClientTouch(TouchEvents.quizStepView, props);

  if (step === "b-book") {
    void recordClientTouch(TouchEvents.quizScheduleView, props);
  }
}

export function captureQuizStepBack(meta: {
  from_step: string;
  to_step: string;
  from_index: number;
  to_index: number;
}) {
  const fromStep = canonicalizeQuizStepId(meta.from_step);
  const toStep = canonicalizeQuizStepId(meta.to_step);
  const props = labProps({
    ...lpContext(),
    ...analyticsAttributionProps(),
    from_step: fromStep,
    to_step: toStep,
    from_index: meta.from_index,
    to_index: meta.to_index,
  });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizStepBack, props);
  }
  trackLabGa(Ga4Events.quizStepBack, {
    from_step: fromStep,
    to_step: toStep,
  });
}

/** See the Plan A twin: separates "never asked for a code" from "would not enter it". */
export function captureLabPhoneOtpRequested() {
  const props = labProps();
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labPhoneOtpRequested, props);
  }
  trackLabGa(LabGa4Events.labPhoneOtpRequested);
  void recordClientTouch(TouchEvents.labPhoneOtpRequested, props);
}

export function captureLabPhoneOtpFailed(reason: string) {
  const props = labProps({ reason });
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labPhoneOtpFailed, props);
  }
  trackLabGa(LabGa4Events.labPhoneOtpFailed, { reason });
  void recordClientTouch(TouchEvents.labPhoneOtpFailed, props);
}

export function captureLabPhoneVerified() {
  const props = labProps();
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labPhoneVerified, props);
  }
  trackLabGa(LabGa4Events.labPhoneVerified);
  void recordClientTouch(TouchEvents.labPhoneVerified, props);
}

export function captureLabComputingPopupAnswered(args: {
  popup: "khan" | "tutor";
  answer: "yes" | "no";
}) {
  const props = labProps({ popup: args.popup, answer: args.answer });
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labComputingPopupAnswered, props);
  }
  trackLabGa(LabGa4Events.labComputingPopupAnswered, {
    popup: args.popup,
    answer: args.answer,
  });
}

export function captureQuizLeadSubmitted(
  answers: Record<string, unknown>,
  eventId?: string,
  options?: { hasGapScreen?: boolean }
) {
  const props = labProps({
    ...lpContext(),
    ...analyticsAttributionProps(),
    event_id: eventId,
    has_gap_screen: Boolean(options?.hasGapScreen),
    quiz_answers: buildQuizAnswersSnapshot(answers),
  });

  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labLeadSubmitted, props);
    const email =
      typeof answers.parentEmail === "string" ? answers.parentEmail.trim() : "";
    if (email) {
      controlIdentifyQuizLead(email, answers);
      const snapshot = buildQuizAnswersSnapshot(answers);
      posthog.setPersonProperties({
        qGrade: snapshot.qGrade ?? undefined,
        student_grade: studentGradeFromPlanBGradeId(snapshot.qGrade) ?? undefined,
        plan_builder_variant: PLAN_BUILDER_VARIANT,
        funnel_id: PLAN_BUILDER_FUNNEL_ID,
      });
    }
  }
  trackLabGa(LabGa4Events.labLeadSubmitted);

  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", "Lead", {}, { eventID: eventId });
    } else {
      window.fbq("track", "Lead");
    }
  }

  void recordClientTouch(TouchEvents.labLeadSubmitted, props);
}

export function captureQuizBookingConfirmed(
  eventId?: string,
  options?: { booking_source?: "api" | "client"; qWho?: string }
) {
  const props = labProps({
    event_id: eventId,
    booking_source: options?.booking_source ?? "client",
    qWho: options?.qWho,
  });

  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labLessonBooked, props);
    posthog.capture(PostHogEvents.quizBookingConfirmed, props);
  }
  trackLabGa(LabGa4Events.labLessonBooked, {
    booking_source: options?.booking_source ?? "client",
  });

  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", "Schedule", {}, { eventID: eventId });
    } else {
      window.fbq("track", "Schedule");
    }
  }

  void recordClientTouch(TouchEvents.labLessonBooked, props);
}

export function captureLabLessonLinkShared() {
  const props = labProps();
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labLessonLinkShared, props);
  }
  trackLabGa(LabGa4Events.labLessonLinkShared);
  void recordClientTouch(TouchEvents.labLessonLinkShared, props);
}

export function captureQuizBookingError(
  props: Parameters<typeof controlQuizBookingError>[0]
) {
  const payload = labProps({ ...props, step: props.step ?? "b-book" });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizBookingError, payload);
  }
  trackLabGa(Ga4Events.quizBookingError, { step: "b-book" });
}

export function captureQuizBookingValidation(
  props: Parameters<typeof controlQuizBookingValidation>[0]
) {
  const payload = labProps({ ...props, step: props.step ?? "b-book" });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizBookingValidation, payload);
  }
  trackLabGa(Ga4Events.quizBookingValidation, { step: "b-book" });
}

export function captureQuizThankYouViewed(answers: Record<string, unknown>) {
  const props = labProps({ quiz_answers: buildQuizAnswersSnapshot(answers) });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizThankYouViewed, props);
  }
  trackLabGa(Ga4Events.quizThankYouView, {});
}

export function captureAchievabilityInputEdited(props: AchievabilityInputEditedProps) {
  controlAchievabilityInputEdited(props);
}
