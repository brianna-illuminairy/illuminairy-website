import type { LabIntakeAnswers } from "@/lib/quiz-funnel-b/funnel-steps";

export const BASE_LAB_ROUTE_STEPS = [
  "q1-parent-child",
  "q-score-lower",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q9",
  "q8",
  "q-school-referral",
  "b-computing",
  "b-plan-ready",
  "b-email",
  "b-zip",
  "b-parent-name",
  "b-phone",
  "b-claim",
  "b-book",
  "b-post-device",
  "b-post-share",
  "b-post-join-tip",
  "booked",
] as const;

type RouteAnswers = LabIntakeAnswers & {
  q5?: string;
  q8?: string;
};

/** Ordered step IDs for this answer set (Plan Builder B lab routing). */
export function getLabQuizRouteSteps(answers: RouteAnswers): string[] {
  const steps: string[] = [...BASE_LAB_ROUTE_STEPS];

  if (answers.q3 === "none") {
    const q4Idx = steps.indexOf("q4");
    if (q4Idx >= 0) steps.splice(q4Idx, 1);
    const q3Idx = steps.indexOf("q3");
    if (q3Idx >= 0) steps.splice(q3Idx + 1, 0, "hit-q3-none");
  }

  if (answers.q5 === "tbd" || answers.q5 === "2027") {
    const q6Idx = steps.indexOf("q6");
    if (q6Idx >= 0) steps.splice(q6Idx, 0, "hit-q5-tbd");
  }

  if (answers.q8 === "tbd") {
    const q9Idx = steps.indexOf("q9");
    if (q9Idx >= 0) steps.splice(q9Idx, 0, "hit-q8-scores");
  }

  return steps;
}
