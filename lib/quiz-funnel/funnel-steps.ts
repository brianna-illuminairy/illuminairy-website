import { readQuizLastStep } from "@/lib/quiz-funnel/quiz-storage";

/**
 * Plan Builder step IDs and intake guards.
 * Step IDs are stable for PostHog/GA/touch_events — do not rename without dashboard updates.
 */

/** First screen after LP CTA — used in planBuilderEntryFromLanding and quiz_started. */
export const QUIZ_ENTRY_STEP = "q-who";

/** Terminal step after a Strategy Call is booked. */
export const QUIZ_BOOKED_STEP = "booked";

/** Urgency segmentation (legacy answer key `q1`, CRM column `quiz_trigger`). */
export const QUIZ_URGENCY_STEP = "q1";

export type QuizIntakeAnswers = {
  qWho?: string;
  qScoreLower?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string[];
  q7?: string[];
  q8?: string;
  q9?: string;
  kidName?: string;
};

/** Steps that require a saved answer before the user may proceed past them. */
const INTAKE_STEP_SATISFIED: Record<string, (a: QuizIntakeAnswers) => boolean> = {
  "q-who": (a) => Boolean(a.qWho),
  "q-score-lower": (a) => Boolean(a.qScoreLower),
  q1: (a) => Boolean(a.q1),
  q2: (a) => Boolean(a.q2),
  q3: (a) => Boolean(a.q3),
  q4: (a) => Boolean(a.q4),
  q5: (a) => Boolean(a.q5),
  q6: (a) => Array.isArray(a.q6) && a.q6.length > 0,
  q7: (a) => Array.isArray(a.q7) && a.q7.length > 0,
  q8: (a) => Boolean(a.q8),
  q9: (a) => Boolean(a.q9),
  name: (a) => Boolean(a.kidName?.trim())
};

/**
 * If a deep link skips unanswered intake steps (e.g. old ads using `?step=q1`),
 * return the earliest missing step. Interstitials and insight slides pass through.
 */
export function resolveGuardedQuizStep(
  answers: QuizIntakeAnswers,
  requestedStep: string,
  routeSteps: string[]
): string {
  const targetIdx = routeSteps.indexOf(requestedStep);
  if (targetIdx < 0) return QUIZ_ENTRY_STEP;

  for (let i = 0; i <= targetIdx; i++) {
    const step = routeSteps[i];
    const satisfied = INTAKE_STEP_SATISFIED[step];
    if (satisfied && !satisfied(answers)) return step;
  }

  return requestedStep;
}

type ResumeAnswers = QuizIntakeAnswers & {
  strategyCallStart?: string;
};

/**
 * Where to land when re-entering the funnel (LP CTA, browser back to LP, etc.).
 * Prefers the last viewed step; otherwise the first missing intake or furthest reachable step.
 */
export function resolveQuizResumeStep(
  answers: ResumeAnswers,
  routeSteps: string[]
): string {
  if (answers.strategyCallStart) {
    return QUIZ_BOOKED_STEP;
  }

  const lastStep = readQuizLastStep();
  if (lastStep && routeSteps.includes(lastStep)) {
    const guarded = resolveGuardedQuizStep(answers, lastStep, routeSteps);
    const lastIdx = routeSteps.indexOf(lastStep);
    const guardedIdx = routeSteps.indexOf(guarded);
    if (guarded === lastStep || (guardedIdx >= 0 && guardedIdx <= lastIdx)) {
      return lastStep;
    }
  }

  let resume = QUIZ_ENTRY_STEP;
  for (const step of routeSteps) {
    const satisfied = INTAKE_STEP_SATISFIED[step];
    if (satisfied) {
      if (!satisfied(answers)) {
        return step;
      }
      resume = step;
    } else {
      resume = step;
    }
  }

  return resume;
}
