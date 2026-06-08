import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";
import { showGapScreen } from "@/lib/quiz-funnel/gap-screen";
import type { QuizIntakeAnswers } from "@/lib/quiz-funnel/funnel-steps";

export const BASE_QUIZ_ROUTE_STEPS = [
  "q1-parent-child",
  "q-score-lower",
  "q1",
  "q2",
  "q3",
  "i-steps",
  "q4",
  "q-doubts",
  "q5",
  "hit-outcome-month-one",
  "q6",
  "q7",
  "hit-q7",
  "i-diag",
  "i-compare",
  "q9",
  "q8",
  "achievability",
  "name",
  "i2",
  "v1",
  "s4",
  "s5",
] as const;

type RouteAnswers = QuizIntakeAnswers & {
  qDoubts?: string[];
  q5?: string;
  q8?: string;
  q9?: string;
  q4?: string;
};

/** Ordered step IDs for this answer set (matches QuizRunner routing). */
export function getQuizRouteSteps(answers: RouteAnswers): string[] {
  const steps: string[] = [...BASE_QUIZ_ROUTE_STEPS];

  if (isQuizSelfTaker(answers.qWho)) {
    const qDoubtsIdx = steps.indexOf("q-doubts");
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx, 1);
  }

  if (answers.q3 === "none") {
    const q4Idx = steps.indexOf("q4");
    if (q4Idx >= 0) steps.splice(q4Idx, 1);
    const qDoubtsIdx = steps.indexOf("q-doubts");
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx, 1);
    const q3Idx = steps.indexOf("q3");
    if (q3Idx >= 0) steps.splice(q3Idx + 1, 0, "hit-q3-none");
  }

  if (Array.isArray(answers.qDoubts) && answers.qDoubts.length > 0) {
    const qDoubtsIdx = steps.indexOf("q-doubts");
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx + 1, 0, "doubts-insight");
  }

  if (answers.q5 === "tbd" || answers.q5 === "2027") {
    const q6Idx = steps.indexOf("q6");
    if (q6Idx >= 0) steps.splice(q6Idx, 0, "hit-q5-tbd");
  }

  if (answers.q8 === "tbd") {
    const q9Idx = steps.indexOf("q9");
    if (q9Idx >= 0) steps.splice(q9Idx, 0, "hit-q8-scores");
  }

  if (showGapScreen(answers)) {
    const idx = steps.indexOf("name");
    if (idx >= 0) steps.splice(idx, 0, "i-gap");
  }

  return steps;
}
