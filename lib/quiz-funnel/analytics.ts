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
import {
  readPersistedLpVariant,
  readPersistedLpVariantId
} from "@/lib/landing/variant-storage";
import { readStoredQuizAnswers } from "@/lib/quiz-funnel/quiz-storage";
import { buildQuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { QUIZ_ENTRY_STEP } from "@/lib/quiz-funnel/funnel-steps";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel/step-aliases";
import {
  quizDoubtsEventProps,
  shouldAttachQuizDoubtsProps,
  quizPathIncludesQDoubts
} from "@/lib/quiz-funnel/doubts-analytics";
import { funnelStageLabel } from "@/lib/marketing/funnel-stage-labels";
import {
  funnelScreenComponent,
  funnelScreenRole,
  isPlanRevealStep,
} from "@/lib/quiz-funnel/funnel-screen-roles";
import { STRATEGY_CALL_ANALYTICS_PROPS } from "@/lib/quiz-funnel/strategy-call-analytics-props";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Shared opening + urgency props for PostHog, GA4, and CRM touches. */
function quizOpeningProps(answers: Record<string, unknown>) {
  const stored = readStoredQuizAnswers();
  const qWho =
    typeof answers.qWho === "string"
      ? answers.qWho
      : typeof stored.qWho === "string"
        ? stored.qWho
        : undefined;
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
    sat_lp_layout: readPersistedLpLayout() ?? undefined,
    lp_variant: readPersistedLpVariantId() ?? undefined
  };
}

/** Session + URL UTMs + Strategy Call offer tags on every quiz analytics payload. */
function quizAttributionProps() {
  return {
    ...STRATEGY_CALL_ANALYTICS_PROPS,
    ...analyticsAttributionProps(),
  };
}

const PARENT_CONFIRMED_KEY = "illuminairy_parent_confirmed";
const QUIZ_DOUBTS_ANSWERED_KEY = "illuminairy_quiz_doubts_answered";

/** Meta Phase 1 optimization — parent selected "My child" on entry step (not students). */
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

export function captureQuizStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  const step = canonicalizeQuizStepId(meta.stepId);
  const lpContext = persistedLpContext();
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  const snapshot = buildQuizAnswersSnapshot(answers);
  recordClientTouch(TouchEvents.quizStarted, {
    step,
    step_index: meta.stepIndex,
    ...lpContext,
    ...attr,
    ...opening,
    quiz_answers: snapshot
  });
  trackQuizGaEvent("quiz_started", {
    funnel: "sat_quiz",
    step,
    step_index: meta.stepIndex,
    ...lpContext,
    ...attr,
    ...opening
  });
  if (!getPostHogKey()) return;
  posthog.capture(PostHogEvents.quizStarted, {
    ...lpContext,
    ...attr,
    ...opening,
    step,
    step_index: meta.stepIndex,
    first_start_ever: true
  });
}

export function captureQuizSessionStarted(
  answers: Record<string, unknown>,
  meta: { stepId: string; stepIndex: number }
) {
  const step = canonicalizeQuizStepId(meta.stepId);
  const lpContext = persistedLpContext();
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  trackQuizGaEvent(Ga4Events.quizSessionStarted, {
    funnel: "sat_quiz",
    step,
    step_index: meta.stepIndex,
    ...lpContext,
    ...attr,
    ...opening
  });
  if (!getPostHogKey()) return;
  posthog.capture(PostHogEvents.quizSessionStarted, {
    ...lpContext,
    ...attr,
    ...opening,
    step,
    step_index: meta.stepIndex
  });
}

export function captureQuizStep(
  stepId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  options?: { hasGapScreen?: boolean }
) {
  const step = canonicalizeQuizStepId(stepId);
  const opening = quizOpeningProps(answers);
  const attr = quizAttributionProps();
  const lpContext = persistedLpContext();
  const snapshot = buildQuizAnswersSnapshot(answers);
  const kid = snapshot.kidName ?? undefined;
  const props = {
    ...lpContext,
    ...attr,
    step,
    step_label: funnelStageLabel(step),
    funnel_screen_role: funnelScreenRole(step),
    funnel_screen_component: funnelScreenComponent(step),
    is_plan_reveal: isPlanRevealStep(step),
    step_seq: stepIndex + 1,
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
    ...(shouldAttachQuizDoubtsProps(step, answers)
      ? quizDoubtsEventProps(snapshot.qDoubts)
      : {})
  };
  recordClientTouch(TouchEvents.quizStepView, {
    step,
    step_index: stepIndex,
    sat_lp_variant: lpContext.sat_lp_variant,
    has_gap_screen: Boolean(options?.hasGapScreen),
    ...opening,
    ...attr,
    quiz_answers: snapshot
  });
  trackQuizGaEvent("quiz_step_view", {
    step,
    step_index: stepIndex,
    funnel: "sat_quiz",
    ...opening,
    ...attr,
    ...lpContext
  });
  if (step === "s5") {
    recordClientTouch(TouchEvents.quizScheduleView, {
      step,
      step_index: stepIndex,
      ...attr
    });
  }
  if (!getPostHogKey()) return;
  syncQuizPersonProperties(answers);
  maybeCaptureQuizDoubtsAnswered(step, answers);
  posthog.capture("quiz_step_viewed", props);
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

export function captureQuizPhoneVerified() {
  const props = {
    funnel: "sat_quiz" as const,
    step: "s5",
    ...quizAttributionProps(),
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizPhoneVerified, props);
  }
  trackQuizGaEvent(Ga4Events.quizPhoneVerified, props);
  void recordClientTouch(TouchEvents.quizPhoneVerified, props);
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
    lp_variant:
      (answers.lp_variant as string | undefined) ??
      readPersistedLpVariantId() ??
      undefined,
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
  const opening = quizOpeningProps(answers);
  if (getPostHogKey()) {
    posthog.capture("quiz_thank_you_viewed", {
      ...opening,
      q4: answers.q4,
      q5: answers.q5,
      has_kid_name: Boolean(
        typeof answers.kidName === "string" && answers.kidName.trim()
      )
    });
  }
  trackQuizGaEvent("quiz_thank_you_view", {
    funnel: "sat_quiz",
    ...opening
  });
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
  qWho?: string;
};

export type QuizBookingValidationProps = {
  validation_code: string;
  validation_message: string;
  field: string;
  step?: string;
  phone_digit_count?: number;
  slot_weekday?: string;
  slots_available?: boolean;
  qWho?: string;
};

/** s5 lead save, Calendly book API, availability load, network. Not client form validation. */
const BOOKING_ERROR_DEDUPE_MS = 3000;
const BOOKING_VALIDATION_DEDUPE_MS = 3000;
let lastBookingValidationKey = "";
let lastBookingValidationAt = 0;
let lastBookingErrorKey = "";
let lastBookingErrorAt = 0;

export function captureQuizBookingError(props: QuizBookingErrorProps) {
  const key = `${props.error_code}|${props.step ?? "s5"}|${props.field ?? ""}`;
  const now = Date.now();
  if (
    key === lastBookingErrorKey &&
    now - lastBookingErrorAt < BOOKING_ERROR_DEDUPE_MS
  ) {
    return;
  }
  lastBookingErrorKey = key;
  lastBookingErrorAt = now;

  const payload = {
    funnel: "sat_quiz",
    step: props.step ?? "s5",
    ...persistedLpContext(),
    ...quizAttributionProps(),
    ...props
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizBookingError, payload);
  }
  trackQuizGaEvent(Ga4Events.quizBookingError, payload);
}

/** s5 client-side validation only (TCPA, name, phone, slot before submit). */
export function captureQuizBookingValidation(props: QuizBookingValidationProps) {
  const key = `${props.validation_code}|${props.step ?? "s5"}|${props.field}`;
  const now = Date.now();
  if (
    key === lastBookingValidationKey &&
    now - lastBookingValidationAt < BOOKING_VALIDATION_DEDUPE_MS
  ) {
    return;
  }
  lastBookingValidationKey = key;
  lastBookingValidationAt = now;

  const payload = {
    funnel: "sat_quiz",
    step: props.step ?? "s5",
    ...persistedLpContext(),
    ...quizAttributionProps(),
    ...props
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizBookingValidation, payload);
  }
  trackQuizGaEvent(Ga4Events.quizBookingValidation, payload);
}

export function captureQuizStepBack(meta: {
  from_step: string;
  to_step: string;
  from_index: number;
  to_index: number;
}) {
  const from_step = canonicalizeQuizStepId(meta.from_step);
  const to_step = canonicalizeQuizStepId(meta.to_step);
  const payload = {
    funnel: "sat_quiz",
    ...persistedLpContext(),
    ...quizAttributionProps(),
    from_label: funnelStageLabel(from_step),
    to_label: funnelStageLabel(to_step),
    from_step,
    to_step,
    from_index: meta.from_index,
    to_index: meta.to_index
  };
  if (getPostHogKey()) {
    posthog.capture(PostHogEvents.quizStepBack, payload);
  }
  trackQuizGaEvent(Ga4Events.quizStepBack, payload);
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
  options?: { booking_source?: "api" | "client"; qWho?: string }
) {
  const bookingSource = options?.booking_source ?? "client";
  const qWho =
    options?.qWho ??
    (() => {
      const stored = readStoredQuizAnswers();
      return typeof stored.qWho === "string" ? stored.qWho : undefined;
    })();
  const payload = { booking_source: bookingSource, qWho };
  if (getPostHogKey()) {
    posthog.capture("quiz_booking_confirmed", payload);
  }
  trackQuizGaEvent("schedule", {
    funnel: "sat_quiz",
    ...payload
  });
  if (typeof window !== "undefined" && window.fbq && eventId) {
    window.fbq("track", "Schedule", {}, { eventID: eventId });
  } else if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Schedule");
  }
}
