export const PLAN_SCHEDULER_EYEBROW = "FREE SAT PLAN REVIEW";

export const PLAN_SCHEDULER_HEADLINE = "Reserve your plan review...";

export const PLAN_SCHEDULER_PHONE_LABEL = "Mobile";

export function planSchedulerConfirmLabel(
  weekdayShort: string,
  timeLabel: string
): string {
  return `Confirm ${weekdayShort} · ${timeLabel}`;
}
