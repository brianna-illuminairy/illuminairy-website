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
  if (historyId === "history_none") return firstInt8Step();
  if (shouldShowInt3Retake(historyId)) return "int3-retake";
  return "prep";
}

export function stepBeforePrep(historyId?: string): SatPlanStep {
  if (shouldShowInt3Retake(historyId)) return "int3-retake";
  return "history";
}

/** Group class in prep multiselect — INT8 slide 1 (why group classes fail). */
export function hasGroupClassPrep(prepMethod?: SatPlanAnswers["prep_method"]): boolean {
  return normalizePrepMethods(prepMethod).includes("prep_class");
}

/** Self-study prep without group class — INT8 slide 2 (why self-study fails). */
export function hasSelfStudyPrepOnly(prepMethod?: SatPlanAnswers["prep_method"]): boolean {
  const prepIds = normalizePrepMethods(prepMethod);
  if (prepIds.includes("prep_class")) return false;
  return prepIds.some((id) => PREP_SELF_STUDY_IDS.has(id));
}

/** First INT8 slide: group-class fail if they picked class; otherwise self-study fail (incl. little/none, never-tested). */
export function firstInt8Step(prepMethod?: SatPlanAnswers["prep_method"]): SatPlanStep {
  if (hasGroupClassPrep(prepMethod)) return "prep-failed-group-class";
  return "prep-failed-self-study";
}

export function nextStepAfterPrep(prepMethod?: SatPlanAnswers["prep_method"]): SatPlanStep {
  return firstInt8Step(prepMethod);
}

export function nextStepAfterInt8GroupClass(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterInt8SelfStudy(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterInt8Plateau(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterInt8Proof(): SatPlanStep {
  return "prep-failed-guided";
}

export function nextStepAfterInt8Guided(): SatPlanStep {
  return "prep-failed-mistake-driven";
}

/** Last INT8 screen before intake continues — always mistake-driven (full education sequence). */
export function lastInt8Step(_prepMethod?: SatPlanAnswers["prep_method"]): SatPlanStep {
  return "prep-failed-mistake-driven";
}

export function stepBeforeInt8(
  currentStep: SatPlanStep,
  historyId?: string,
  prepMethod?: SatPlanAnswers["prep_method"]
): SatPlanStep {
  switch (currentStep) {
    case "prep-failed-group-class":
      return historyId === "history_none" ? "history" : "prep";
    case "prep-failed-self-study":
      return historyId === "history_none" ? "history" : "prep";
    case "prep-failed-plateau":
      return historyId === "history_none" ? "history" : "prep";
    case "prep-failed-proof":
      if (hasGroupClassPrep(prepMethod)) return "prep-failed-group-class";
      return "prep-failed-self-study";
    case "prep-failed-guided":
      return "prep-failed-proof";
    case "prep-failed-mistake-driven":
      return "prep-failed-guided";
    default:
      return historyId === "history_none" ? "history" : "prep";
  }
}

/** After INT8 quartet: tested path → score; never-tested → sat-changed. */
export function nextStepAfterPrepFailed(
  historyId?: string,
  _prepMethod?: SatPlanAnswers["prep_method"]
): SatPlanStep {
  if (!isTestedHistory(historyId)) return "sat-changed";
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

export function stepBeforeScore(answers: SatPlanAnswers): SatPlanStep {
  return lastInt8Step(answers.prep_method);
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
