import {
  QUIZ_ENTRY_STEP as PLAN_A_ENTRY,
  QUIZ_ENTRY_STEP_LEGACY as PLAN_A_LEGACY,
} from "@/lib/quiz-funnel/funnel-steps";
import {
  QUIZ_ENTRY_STEP as PLAN_B_ENTRY,
  QUIZ_ENTRY_STEP_LEGACY as PLAN_B_LEGACY,
} from "@/lib/quiz-funnel-b/funnel-steps";
import { QUIZ_ENTRY_STEP as SCORE_REVIEW_ENTRY } from "@/lib/score-review-funnel/funnel-steps";

function isFunnelEntryStep(
  step: string | undefined,
  canonical: string,
  legacy?: string
): boolean {
  if (!step || step === canonical) return true;
  if (legacy && step === legacy) return true;
  return false;
}

export function isPlanAEntryStep(step?: string): boolean {
  return isFunnelEntryStep(step, PLAN_A_ENTRY, PLAN_A_LEGACY);
}

export function isPlanBEntryStep(step?: string): boolean {
  return isFunnelEntryStep(step, PLAN_B_ENTRY, PLAN_B_LEGACY);
}

export function isScoreReviewEntryStep(step?: string): boolean {
  return isFunnelEntryStep(step, SCORE_REVIEW_ENTRY);
}

/** @deprecated Use isPlanAEntryStep */
export const isPlanAEntrySearchStep = isPlanAEntryStep;

/** @deprecated Use isPlanBEntryStep */
export const isPlanBEntrySearchStep = isPlanBEntryStep;
