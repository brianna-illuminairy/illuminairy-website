import {
  normalizePrepMethods,
  PREP_SELF_STUDY_IDS
} from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers, SatPlanStep } from "@/lib/sat-plan-funnel/types";

export function isTestedHistory(historyId?: string): boolean {
  return Boolean(historyId && historyId !== "history_none");
}

export function shouldShowInt3Retake(historyId?: string): boolean {
  return historyId === "history_twice" || historyId === "history_three_plus";
}

export function nextStepAfterHistory(historyId?: string): SatPlanStep {
  if (historyId === "history_none") return "prep-failed-stub";
  if (shouldShowInt3Retake(historyId)) return "int3-retake";
  return "prep";
}

export function stepBeforePrep(historyId?: string): SatPlanStep {
  if (shouldShowInt3Retake(historyId)) return "int3-retake";
  return "history";
}

/** Group-class or self-study prep unlocks the four-beat INT8 chain (plateau → proof → mentors → guided). */
export function usesInt8Trilogy(prepMethod?: SatPlanAnswers["prep_method"]): boolean {
  const prepIds = normalizePrepMethods(prepMethod);
  if (prepIds.includes("prep_class")) return true;
  return prepIds.some((id) => PREP_SELF_STUDY_IDS.has(id));
}

export function nextStepAfterPrep(prepMethod?: SatPlanAnswers["prep_method"]): SatPlanStep {
  if (usesInt8Trilogy(prepMethod)) return "prep-failed-plateau";
  return "prep-failed-stub";
}

export function nextStepAfterInt8Plateau(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterInt8Proof(): SatPlanStep {
  return "prep-failed-mentors";
}

export function nextStepAfterInt8Mentors(): SatPlanStep {
  return "prep-failed-guided";
}

/** Last INT8 screen before intake continues. */
export function lastInt8Step(prepMethod?: SatPlanAnswers["prep_method"]): SatPlanStep {
  if (usesInt8Trilogy(prepMethod)) return "prep-failed-guided";
  return "prep-failed-stub";
}

export function stepBeforeInt8(
  currentStep: SatPlanStep,
  historyId?: string
): SatPlanStep {
  switch (currentStep) {
    case "prep-failed-plateau":
      return historyId === "history_none" ? "history" : "prep";
    case "prep-failed-proof":
      return "prep-failed-plateau";
    case "prep-failed-mentors":
      return "prep-failed-proof";
    case "prep-failed-guided":
      return "prep-failed-mentors";
    case "prep-failed-stub":
    default:
      return historyId === "history_none" ? "history" : "prep";
  }
}

export function nextStepAfterPrepFailed(historyId?: string): SatPlanStep {
  return isTestedHistory(historyId) ? "hours" : "sat-changed";
}

export function nextStepAfterHours(): SatPlanStep {
  return "score";
}

export function nextStepAfterScore(): SatPlanStep {
  return "wrong";
}

export function nextStepAfterWrong(): SatPlanStep {
  return "sat-changed";
}

export function nextStepAfterSatChanged(): SatPlanStep {
  return "gpa";
}

export function nextStepAfterGpa(): SatPlanStep {
  return "gpa-paradox";
}

export function nextStepAfterGpaParadox(): SatPlanStep {
  return "test-date";
}

export function nextStepAfterTestDate(): SatPlanStep {
  return "timeline";
}

export function nextStepAfterTimeline(): SatPlanStep {
  return "schools";
}

export function nextStepAfterSchools(): SatPlanStep {
  return "plan-path";
}

export function nextStepAfterPlanPath(): SatPlanStep {
  return "contact";
}

export function nextStepAfterContact(): SatPlanStep {
  return "plan-ready";
}

export function nextStepAfterPlanReady(): SatPlanStep {
  return "report";
}

export function nextStepAfterReport(): SatPlanStep {
  return "book";
}

export function stepBeforeHours(answers: SatPlanAnswers): SatPlanStep {
  return lastInt8Step(answers.prep_method);
}

export function stepBeforeScore(): SatPlanStep {
  return "hours";
}

export function stepBeforeWrong(): SatPlanStep {
  return "score";
}

export function stepBeforeGpa(answers: SatPlanAnswers): SatPlanStep {
  return "sat-changed";
}

export function stepBeforeSatChanged(answers: SatPlanAnswers): SatPlanStep {
  if (isTestedHistory(answers.test_history)) return "wrong";
  return lastInt8Step(answers.prep_method);
}

export function stepBeforeGpaParadox(): SatPlanStep {
  return "gpa";
}

export function stepBeforeTestDate(): SatPlanStep {
  return "gpa-paradox";
}

export function stepBeforeTimeline(): SatPlanStep {
  return "test-date";
}

export function stepBeforeSchools(): SatPlanStep {
  return "timeline";
}

export function stepBeforePlanPath(): SatPlanStep {
  return "schools";
}

export function stepBeforeContact(): SatPlanStep {
  return "plan-path";
}

export function stepBeforePlanReady(): SatPlanStep {
  return "contact";
}

export function stepBeforeReport(): SatPlanStep {
  return "plan-ready";
}

export function stepBeforeBook(): SatPlanStep {
  return "report";
}
