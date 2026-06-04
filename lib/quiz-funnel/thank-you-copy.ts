import { strategyCallStartFromCalendlyWebhook } from "@/lib/crm/calendly-payload";
import { buildPlanHandoff } from "@/lib/quiz-funnel/plan-handoff-copy";
import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";
import { QUIZ_TESTIMONIALS } from "@/lib/quiz-funnel/testimonials";

/** Full on-call agenda (s7, reference). */
export const STRATEGY_CALL_VALUE_BULLETS = [
  "Review your Improvement Plan with an SAT advisor for personalized feedback",
  "Review their SAT score history",
  "Confirm the best target score for admissions at their schools",
  "Discuss the gap between where they are and where they want to go",
  "Confirm a reasonable improvement timeline",
  "Explain the fastest path to their goal score",
  "Schedule the Skill Diagnostic for Week 1 (Part 1 Mon, Part 2 Wed, plan review Fri)",
] as const;

/** s5 — one line after form (what happens on continue). */
export const S5_AFTER_SUBMIT_NEXT_STEP =
  "Next you'll pick a time for your free 15-minute SAT Strategy Call, then we'll send calendar reminders.";

/** S5 lead gate: condensed call value (3 bullets, no checkmarks). */
export const S5_LEAD_VALUE_BULLETS = [
  "Review your Improvement Plan with an SAT advisor for personalized feedback",
  "Confirm the best target for their schools, discuss the gap, and map a realistic timeline",
  "Next: book the proctored Skill Diagnostic (2 hr 14 min, split across two sessions)",
] as const;

/** @deprecated Booked screen no longer uses this paragraph. */
export const STRATEGY_CALL_LEAD_SUMMARY =
  "We review your Improvement Plan with an SAT advisor: score history, school targets, the gap and timeline, the fastest path to that score, and scheduling the Skill Diagnostic for Week 1.";

/** Shown on post-book thank-you (strategy-call-specific social proof). */
export const THANK_YOU_TESTIMONIAL = QUIZ_TESTIMONIALS[2];

export const THANK_YOU_DONE_CTA = "Done";

export const THANK_YOU_ADD_CALENDAR_CTA = "Add To Calendar";

export const THANK_YOU_COVER_SECTION = "What we'll cover";

export const THANK_YOU_BEFORE_SECTION = "Before the call";

export const THANK_YOU_COVER_FASTEST_PATH = "The fastest path to that score";

export const THANK_YOU_COVER_QUESTIONS =
  "Questions about format, pricing, or scheduling";

export const THANK_YOU_COVER_DIAGNOSTIC = "Next steps for the Skill Diagnostic";

export function thankYouHeadline(parentFirst: string): string {
  if (parentFirst.trim()) {
    return `${parentFirst.trim()}, your SAT Strategy Call is confirmed.`;
  }
  return "Your SAT Strategy Call is confirmed.";
}

export function thankYouWhenLine(callWhen: string | null): string {
  return (
    callWhen ?? "Check your email for the calendar invite with your call time."
  );
}

export function thankYouGoalRealisticLine(
  targetLabel: string | null,
  testDateLabel: string | null
): string {
  if (targetLabel && testDateLabel) {
    return `Whether ${targetLabel} by ${testDateLabel} is realistic`;
  }
  if (targetLabel) {
    return `Whether ${targetLabel} is realistic`;
  }
  return "Whether their target score is realistic";
}

export function thankYouKidInviteLine(kidName: string): string {
  const name = kidName.trim();
  if (!name || name === "your child") {
    return "Invite your child to join if they'd like";
  }
  return `Invite ${name} to join if they'd like`;
}

/** s7 — parent attendance expectation. */
export const STRATEGY_CALL_PARENT_ON_CALL =
  "Plan for 15 minutes with a parent on the call. Your child can join, but we need you.";

/** s7 — what to have ready before booking. */
export const STRATEGY_CALL_PREP_ITEMS = [
  "Recent SAT or PSAT score (or best estimate)",
  "Target schools or score range in mind",
  "A quiet 15-minute slot where you can focus",
] as const;

/** s9 — scheduling subhead. */
export const S9_SCHEDULING_SUBHEAD =
  "Pick a time you will actually be free. We will send reminders 24 hours and 1 hour before.";

/** Post-book checklist (also used in Klaviyo Flow C). */
export const BEFORE_STRATEGY_CALL_STEPS = [
  "Accept the calendar invite",
  "Have your child's most recent SAT/PSAT score available",
] as const;

export function formatStrategyCallDateTime(iso?: string | null): string | null {
  if (!iso || typeof iso !== "string") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** @deprecated Use thankYouKidInviteLine on the booked screen. */
export function kidJoinCallLine(kidName: string): string {
  return thankYouKidInviteLine(kidName);
}

/** What we'll cover — goal line uses quiz answers. */
export function buildThankYouCoverItems(answers: QuizAnswersLike = {}): string[] {
  const { targetLabel, testDateLabel } = buildPlanHandoff(answers);
  return [
    thankYouGoalRealisticLine(targetLabel, testDateLabel),
    THANK_YOU_COVER_FASTEST_PATH,
    THANK_YOU_COVER_QUESTIONS,
    THANK_YOU_COVER_DIAGNOSTIC,
  ];
}

/** Before the call — invite line uses student first name when known. */
export function buildThankYouBeforeCallItems(
  answers: QuizAnswersLike & { kidName?: string } = {}
): string[] {
  const kidName =
    typeof answers.kidName === "string" ? answers.kidName : "";
  return [
    ...BEFORE_STRATEGY_CALL_STEPS,
    thankYouKidInviteLine(kidName),
  ];
}

/** Parse Calendly postMessage payload for event start time (shape varies by widget version). */
export function strategyCallStartFromCalendlyPayload(
  payload: Record<string, unknown> | undefined
): string | null {
  return strategyCallStartFromCalendlyWebhook(payload);
}
