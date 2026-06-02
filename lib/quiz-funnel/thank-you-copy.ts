import { strategyCallStartFromCalendlyWebhook } from "@/lib/crm/calendly-payload";
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

/** One paragraph summary for post-book thank-you lead. */
export const STRATEGY_CALL_LEAD_SUMMARY =
  "We review your Improvement Plan with an SAT advisor: score history, school targets, the gap and timeline, the fastest path to that score, and scheduling the Skill Diagnostic for Week 1.";

/** Shown on post-book thank-you (strategy-call-specific social proof). */
export const THANK_YOU_TESTIMONIAL = QUIZ_TESTIMONIALS[2];

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
  "Accept the calendar invite and add it to your calendar",
  "Have their SAT score history and target schools handy",
  "Plan for a parent on the call (your child can join if you like)",
  "Week 1 after the call: Skill Diagnostic Part 1 (Mon), Part 2 (Wed), plan review (Fri)",
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

export function kidJoinCallLine(kidName: string): string {
  if (!kidName.trim() || kidName === "your child") {
    return "Invite your child to join the call, or forward them the calendar invite.";
  }
  return `Invite ${kidName.trim()} to join the call, or forward them the calendar invite.`;
}

/** Parse Calendly postMessage payload for event start time (shape varies by widget version). */
export function strategyCallStartFromCalendlyPayload(
  payload: Record<string, unknown> | undefined
): string | null {
  return strategyCallStartFromCalendlyWebhook(payload);
}
