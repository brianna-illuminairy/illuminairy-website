/**
 * Plan Builder step IDs and intake guards.
 * Step IDs are stable for PostHog/GA/touch_events — do not rename without dashboard updates.
 */

/** First screen after LP CTA — used in planBuilderEntryFromLanding and quiz_started. */
export const QUIZ_ENTRY_STEP = "q-who";

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
