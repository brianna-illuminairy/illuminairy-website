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
  return "score";
}

export function stepBeforePrep(historyId?: string): SatPlanStep {
  if (isTestedHistory(historyId)) return "prep-failed-proof";
  return "score";
}

export function stepBeforeScoreAfterHistory(historyId?: string): SatPlanStep {
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
  return "prep-failed-guided";
}

export function nextStepAfterInt8SelfStudy(): SatPlanStep {
  return "prep-failed-guided";
}

export function nextStepAfterInt8Plateau(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterInt8Proof(historyId?: string): SatPlanStep {
  if (isTestedHistory(historyId)) return "prep";
  return "prep-failed-guided";
}

/** Tested: parent diagnosis before mistake-driven method; never-tested: no `wrong` step. */
export function nextStepAfterInt8Guided(historyId?: string): SatPlanStep {
  if (isTestedHistory(historyId)) return "wrong";
  return "prep-failed-mistake-driven";
}

/** Last INT8 screen before post-INT8 intake (sat-changed on never-tested). */
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
      if (isTestedHistory(historyId)) {
        return stepBeforeScoreAfterHistory(historyId);
      }
      if (hasGroupClassPrep(prepMethod)) return "prep-failed-group-class";
      return "prep-failed-self-study";
    case "prep-failed-guided":
      return "prep-failed-proof";
    case "prep-failed-mistake-driven":
      if (isTestedHistory(historyId)) return "wrong";
      return "prep-failed-guided";
    default:
      return historyId === "history_none" ? "history" : "prep";
  }
}

/** After mistake-driven (last INT8): sat-changed. */
export function nextStepAfterPrepFailed(
  historyId?: string,
  _prepMethod?: SatPlanAnswers["prep_method"]
): SatPlanStep {
  return "sat-changed";
}

export function nextStepAfterScore(): SatPlanStep {
  return "prep-failed-proof";
}

export function nextStepAfterWrong(): SatPlanStep {
  return "prep-failed-mistake-driven";
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

export function nextStepAfterWho(): SatPlanStep {
  return "student-name";
}

export function nextStepAfterStudentName(): SatPlanStep {
  return "target";
}

export function nextStepAfterTimeline(): SatPlanStep {
  return "schools";
}

export function nextStepAfterSchools(): SatPlanStep {
  return "score-fit";
}

export function nextStepAfterScoreFit(): SatPlanStep {
  return "plan-path";
}

export function nextStepAfterPlanPath(): SatPlanStep {
  return "ch3-social";
}

export function nextStepAfterCh3Social(): SatPlanStep {
  return "ch3-method";
}

export function nextStepAfterCh3Method(): SatPlanStep {
  return "ch3-preview";
}

export function nextStepAfterCh3Preview(): SatPlanStep {
  return "ch3-path";
}

export function nextStepAfterCh3Path(): SatPlanStep {
  return "contact";
}

export function nextStepAfterContact(): SatPlanStep {
  return "reveal-stakes";
}

export function nextStepAfterRevealStakes(): SatPlanStep {
  return "reveal-diagnosis";
}

export function nextStepAfterRevealDiagnosis(): SatPlanStep {
  return "reveal-bottlenecks";
}

export function nextStepAfterRevealBottlenecks(): SatPlanStep {
  return "reveal-proof";
}

export function nextStepAfterRevealProof(): SatPlanStep {
  return "book";
}

/** @deprecated Removed from spine — use reveal chain */
export function nextStepAfterPlanReady(): SatPlanStep {
  return "reveal-diagnosis";
}

/** @deprecated Removed from spine */
export function nextStepAfterReport(): SatPlanStep {
  return "book";
}

export function nextStepAfterBook(): SatPlanStep {
  return "booked";
}

export function stepBeforeScore(answers: SatPlanAnswers): SatPlanStep {
  return stepBeforeScoreAfterHistory(answers.test_history);
}

export function stepBeforeWrong(_answers: SatPlanAnswers): SatPlanStep {
  return "prep-failed-guided";
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

export function stepBeforeTarget(): SatPlanStep {
  return "student-name";
}

export function stepBeforeStudentName(): SatPlanStep {
  return "who";
}

export function stepBeforeTrust(): SatPlanStep {
  return "target";
}

export function stepBeforePlanPath(): SatPlanStep {
  return "score-fit";
}

export function stepBeforeScoreFit(): SatPlanStep {
  return "schools";
}

export function stepBeforeCh3Social(): SatPlanStep {
  return "plan-path";
}

export function stepBeforeCh3Method(): SatPlanStep {
  return "ch3-social";
}

export function stepBeforeCh3Preview(): SatPlanStep {
  return "ch3-method";
}

export function stepBeforeCh3Path(): SatPlanStep {
  return "ch3-preview";
}

export function stepBeforeContact(): SatPlanStep {
  return "ch3-path";
}

export function stepBeforeRevealStakes(): SatPlanStep {
  return "contact";
}

export function stepBeforeRevealDiagnosis(): SatPlanStep {
  return "reveal-stakes";
}

export function stepBeforeRevealBottlenecks(): SatPlanStep {
  return "reveal-diagnosis";
}

export function stepBeforeRevealProof(): SatPlanStep {
  return "reveal-bottlenecks";
}

/** @deprecated */
export function stepBeforePlanReady(): SatPlanStep {
  return "contact";
}

/** @deprecated */
export function stepBeforeReport(): SatPlanStep {
  return "reveal-diagnosis";
}

export function stepBeforeBook(): SatPlanStep {
  return "reveal-proof";
}

export function stepBeforeBooked(): SatPlanStep {
  return "book";
}
