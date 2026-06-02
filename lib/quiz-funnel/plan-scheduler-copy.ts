import { FOCUS_SKILL_COUNT } from "@/lib/sat-skills-copy";

export const PLAN_SCHEDULER_EYEBROW = "Free SAT Strategy Call";

export const PLAN_SCHEDULER_HEADLINE = "Reserve your plan review.";

export const PLAN_SCHEDULER_LEAD = `We'll review your goals, confirm a realistic target, answer your questions, and schedule the proctored diagnostic that finds the ${FOCUS_SKILL_COUNT}–6 skills. Strategy Call times are US Eastern.`;

export const PLAN_SCHEDULER_PHONE_LABEL = "Mobile";

export function planSchedulerConfirmLabel(
  weekdayShort: string,
  timeLabel: string
): string {
  return `Confirm ${weekdayShort} · ${timeLabel}`;
}
