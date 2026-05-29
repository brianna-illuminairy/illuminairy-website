import { QUIZ_TESTIMONIALS } from "@/lib/quiz-funnel/testimonials";

/** Full on-call agenda (s7, reference). Diagnostic next steps only if they move forward. */
export const STRATEGY_CALL_VALUE_BULLETS = [
  "Review your plan with an SAT advisor for personalized feedback",
  "Review their SAT score history",
  "Confirm the best target score for admissions at their schools",
  "Discuss the gap between where they are and where they want to go",
  "Confirm a reasonable improvement timeline",
  "Explain the fastest path to their goal score",
  "Walk through next steps for the Skill Diagnostic if you decide to move forward",
] as const;

/** S5 lead gate: condensed call value (3 bullets, no checkmarks). */
export const S5_LEAD_VALUE_BULLETS = [
  "Review your plan with an SAT advisor for personalized feedback",
  "Confirm the best target for their schools, discuss the gap, and map a realistic timeline",
  "Next steps for the proctored Skill Diagnostic (2 hr 14 min) if you move forward",
] as const;

/** One paragraph summary for post-book thank-you lead. */
export const STRATEGY_CALL_LEAD_SUMMARY =
  "We review your plan with an SAT advisor for personalized feedback — score history, school targets, the gap and timeline, the fastest path to that score, and next steps for the Skill Diagnostic if you decide to move forward.";

/** Shown on post-book thank-you (strategy-call-specific social proof). */
export const THANK_YOU_TESTIMONIAL = QUIZ_TESTIMONIALS[2];

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
  if (!payload) return null;
  const event = payload.event as Record<string, unknown> | undefined;
  if (typeof event?.start_time === "string") return event.start_time;
  const invitee = payload.invitee as Record<string, unknown> | undefined;
  const scheduled = invitee?.scheduled_event as Record<string, unknown> | undefined;
  if (typeof scheduled?.start_time === "string") return scheduled.start_time;
  return null;
}
