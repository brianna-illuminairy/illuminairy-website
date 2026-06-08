"use client";

import posthog from "posthog-js";
import { analyticsAttributionProps } from "@/lib/analytics-attribution";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import {
  Ga4Events,
  MetaEvents,
  PostHogEvents,
  TouchEvents
} from "@/lib/analytics-registry";
import type { AchievabilityInputField } from "@/lib/quiz-funnel/achievability-input-fields";
import { getPostHogKey } from "@/lib/posthog";
import {
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  weeksUntilQ5Test
} from "@/lib/quiz-funnel/gains";
import { readPersistedLpLayout } from "@/lib/landing/layout-storage";
import { readPersistedLpVariant } from "@/lib/landing/variant-storage";
import { PLAN_BUILDER_PATH } from "@/lib/plan-builder-routes";
import { buildQuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { QUIZ_ENTRY_STEP } from "@/lib/quiz-funnel/funnel-steps";
import { syncQuizProgressNow } from "@/lib/quiz-funnel/quiz-progress-sync";
import {
  quizDoubtsEventProps,
  shouldAttachQuizDoubtsProps,
  quizPathIncludesQDoubts
} from "@/lib/quiz-funnel/doubts-analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Shared opening + urgency props for PostHog, GA4, and CRM touches. */
function quizOpeningProps(answers: Record<string, unknown>) {
  const qWho =
    typeof answers.qWho === "string" ? answers.qWho : undefined;
  const qScoreLower =
    typeof answers.qScoreLower === "string" ? answers.qScoreLower : undefined;
  const q1 = typeof answers.q1 === "string" ? answers.q1 : undefined;
  return {
    qWho,
    qScoreLower,
    q1,
    quiz_urgency: q1,
    quiz_is_self_taker: qWho === "self"
  };
}

function syncQuizPersonProperties(answers: Record<string, unknown>) {
  if (!getPostHogKey()) return;
  const opening = quizOpeningProps(answers);
  const snapshot = buildQuizAnswersSnapshot(answers);
  const kid = snapshot.kidName ?? undefined;
  if (
    !opening.qWho &&
    !opening.qScoreLower &&
    !opening.q1 &&
    !kid &&
    !snapshot.q2
  ) {
    return;
  }
  posthog.setPersonProperties({
    qWho: opening.qWho,
    qScoreLower: opening.qScoreLower,
    quiz_trigger: opening.q1,
    quiz_urgency: opening.q1,
    quiz_is_self_taker: opening.quiz_is_self_taker,
    kid_first_name: kid,
    has_kid_name: Boolean(kid),
    q2: snapshot.q2 ?? undefined,
    q3: snapshot.q3 ?? undefined,
    q4: snapshot.q4 ?? undefined,
    q5: snapshot.q5 ?? undefined,
    q8: snapshot.q8 ?? undefined,
    q9: snapshot.q9 ?? undefined,
    ...(quizPathIncludesQDoubts(answers)
      ? quizDoubtsEventProps(snapshot.qDoubts)
      : {})
  });
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

/** Session + URL UTMs on every quiz analytics payload (PostHog register + explicit props). */
function quizAttributionProps() {
  return analyticsAttributionProps();
}

const PARENT_CONFIRMED_KEY = "illuminairy_parent_confirmed";
const QUIZ_DOUBTS_ANSWERED_KEY = "illuminairy_quiz_doubts_answered";

/** Meta Phase 1 optimization — parent selected "My child" on q-who (not students). */
export function captureParentConfirmed(qWho: string) {
  if (qWho !== "child" || typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(PARENT_CONFIRMED_KEY)) return;
    sessionStorage.setItem(PARENT_CONFIRMED_KEY, "1");
  } catch {
    // sessionStorage blocked — still fire once this page load
  }

  const lpContext = persistedLpContext();
  const attr = quizAttributionProps();
  const props = {
    ...lpContext,
    qWho: "child" as const,
    ...attr
  };

  recordClientTouch(TouchEvents.parentConfirmed, props);
  trackQuizGaEvent(Ga4Events.parentConfirmed, {
    funnel: "sat_quiz",
    step: QUIZ_ENTRY_STEP,
    ...props
  });
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.parentConfirmed, props);
  }
  if (window.fbq) {
    window.fbq("trackCustom", MetaEvents.parentConfirmed, {
      content_name: "sat_score_path",
      content_category: lpContext.sat_lp_variant,
      sat_lp_layout: lpContext.sat_lp_layout,
      qWho: "child",
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      utm_source: attr.utm_source
    });
  }
}

export function captureQuizStarted(answers: Record<string, unknown>) {
  const lpContext = persistedLpContext();
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  const snapshot = buildQuizAnswersSnapshot(answers);
  syncQuizProgressNow(answers, { step: QUIZ_ENTRY_STEP, step_index: 0 });
  recordClientTouch(TouchEvents.quizStarted, {
    step: QUIZ_ENTRY_STEP,
    step_index: 0,
    ...lpContext,
    ...attr,
    ...opening,
    quiz_answers: snapshot
  });
  trackQuizGaEvent("quiz_started", {
    funnel: "sat_quiz",
    step: QUIZ_ENTRY_STEP,
    ...lpContext,
    ...attr,
    ...opening
  });
  if (!getPostHogKey()) return;
  posthog.capture("quiz_started", {
    ...lpContext,
    ...attr,
    ...opening
  });
}

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  const lpContext = persistedLpContext();
  const snapshot = buildQuizAnswersSnapshot(answers);
  const kid = snapshot.kidName ?? undefined;
  syncQuizProgressNow(answers, { step: stepId, step_index: stepIndex });
  const props = {
    ...lpContext,
    ...attr,
    step: stepId,
    step_index: stepIndex,
    has_gap_screen: Boolean(options?.hasGapScreen),
    viewport_width:
      typeof window !== "undefined" ? window.innerWidth : undefined,
    ...opening,
    q2: snapshot.q2 ?? undefined,
    q3: snapshot.q3 ?? undefined,
    q4: snapshot.q4 ?? undefined,
    q5: snapshot.q5 ?? undefined,
    q6: snapshot.q6,
    q7: snapshot.q7,
    q8: snapshot.q8 ?? undefined,
    q9: snapshot.q9 ?? undefined,
    kid_first_name: kid,
    has_kid_name: Boolean(kid),
    ...(shouldAttachQuizDoubtsProps(stepId, answers)
      ? quizDoubtsEventProps(snapshot.qDoubts)
      : {})
  };
  recordClientTouch(TouchEvents.quizStepView, {
    step: stepId,
    step_index: stepIndex,
    sat_lp_variant: lpContext.sat_lp_variant,
    has_gap_screen: Boolean(options?.hasGapScreen),
    ...opening,
    ...attr,
    quiz_answers: snapshot
  });
  trackQuizGaEvent("quiz_step_view", {
    step: stepId,
    step_index: stepIndex,
    funnel: "sat_quiz",
    ...opening,
    ...attr,
    ...lpContext
  });
  if (stepId === "s5") {
    recordClientTouch(TouchEvents.quizScheduleView, {
      step: stepId,
      step_index: stepIndex,
      ...attr
    });
  }
  if (!getPostHogKey()) return;
  syncQuizPersonProperties(answers);
  maybeCaptureQuizDoubtsAnswered(stepId, answers);
  posthog.capture("quiz_step_viewed", props);
  posthog.capture("$pageview", {
    $current_url: `${window.location.origin}${PLAN_BUILDER_PATH}?step=${stepId}`
  });
}

export function identifyQuizLead(email: string, answers: Record<string, unknown>) {
  if (!getPostHogKey()) return;
  const opening = quizOpeningProps(answers);
  posthog.identify(email, {
    email,
    name: typeof answers.parentName === "string" ? answers.parentName : undefined,
    phone: typeof answers.parentPhone === "string" ? answers.parentPhone : undefined,
    kid_first_name: typeof answers.kidName === "string" ? answers.kidName : undefined,
    ...opening,
    quiz_trigger: opening.q1
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
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  const qDoubts = Array.isArray(answers.qDoubts)
    ? answers.qDoubts.filter((x) => typeof x === "string")
    : [];
  const props = {
    ...opening,
    ...attr,
    q2: answers.q2,
    q3: answers.q3,
    q4: answers.q4,
    q5: answers.q5,
    q6: answers.q6,
    q7: answers.q7,
    q8: answers.q8,
    q9: answers.q9,
    ...(quizPathIncludesQDoubts(answers)
      ? quizDoubtsEventProps(qDoubts)
      : {}),
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

export type AchievabilityInputEditedProps = {
  /** UI field: target | test_date | starting | gpa */
  field: AchievabilityInputField;
  /** Quiz answer key updated (q8, q5, q4, q9) */
  answer_key: "q8" | "q5" | "q4" | "q9";
  new_value: string;
  previous_value?: string;
  screen?: "achievability";
};

/** Inline edit on achievability — target, starting band, or GPA. */
export function captureAchievabilityInputEdited(props: AchievabilityInputEditedProps) {
  const payload = {
    funnel: "sat_quiz",
    screen: props.screen ?? "achievability",
    field: props.field,
    answer_key: props.answer_key,
    new_value: props.new_value,
    previous_value: props.previous_value,
    ...persistedLpContext(),
    ...quizAttributionProps(),
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.achievabilityInputEdited, payload);
  }
  trackQuizGaEvent(Ga4Events.achievabilityInputEdited, payload);
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

function captureQuizDoubtsAnswered(answers: Record<string, unknown>) {
  const qDoubts = Array.isArray(answers.qDoubts)
    ? answers.qDoubts.filter((x) => typeof x === "string")
    : [];
  const props = {
    funnel: "sat_quiz",
    ...persistedLpContext(),
    ...quizAttributionProps(),
    ...quizDoubtsEventProps(qDoubts)
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizDoubtsAnswered, props);
  }
  const { qDoubts: _qDoubts, ...gaProps } = props;
  trackQuizGaEvent("quiz_doubts_answered", {
    ...gaProps,
    qDoubts_count: props.qDoubts_count,
    qDoubts_skipped: props.qDoubts_skipped
  });
}

/** Once per session — after q-doubts on doubts-insight, or q5 when none selected. */
export function maybeCaptureQuizDoubtsAnswered(
  stepId: string,
  answers: Record<string, unknown>
) {
  if (!quizPathIncludesQDoubts(answers)) return;

  try {
    if (sessionStorage.getItem(QUIZ_DOUBTS_ANSWERED_KEY)) return;
  } catch {
    // sessionStorage blocked — still attempt once this page load
  }

  const qDoubts = Array.isArray(answers.qDoubts)
    ? answers.qDoubts.filter((x) => typeof x === "string")
    : [];

  const shouldFire =
    stepId === "doubts-insight" ||
    (stepId === "q5" && qDoubts.length === 0);
  if (!shouldFire) return;

  try {
    sessionStorage.setItem(QUIZ_DOUBTS_ANSWERED_KEY, "1");
  } catch {
    // ignore
  }
  captureQuizDoubtsAnswered(answers);
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
