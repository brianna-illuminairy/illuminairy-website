import { DOUBTS_OPTIONS } from "@/lib/quiz-funnel/doubts-copy";
import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";

/** PostHog-safe flag keys — one boolean per doubt option for trend breakdowns. */
export function doubtOptionFlagKey(id: string): string {
  return `doubt_${id.replace(/-/g, "_")}`;
}

/** q-doubts selections for quiz_step_viewed, person props, and quiz_doubts_answered. */
export function quizDoubtsEventProps(qDoubts: string[]) {
  const ids = Array.isArray(qDoubts)
    ? qDoubts.filter((x) => typeof x === "string")
    : [];
  const flags: Record<string, boolean> = {};
  for (const opt of DOUBTS_OPTIONS) {
    flags[doubtOptionFlagKey(opt.id)] = ids.includes(opt.id);
  }
  return {
    qDoubts: ids,
    qDoubts_count: ids.length,
    qDoubts_skipped: ids.length === 0,
    ...flags
  };
}

/** Parent path includes q-doubts (not self-taker, prior SAT). */
export function quizPathIncludesQDoubts(answers: Record<string, unknown>): boolean {
  const qWho = typeof answers.qWho === "string" ? answers.qWho : undefined;
  if (isQuizSelfTaker(qWho)) return false;
  if (answers.q3 === "none") return false;
  return true;
}

const QUIZ_STEPS_AT_OR_AFTER_Q_DOUBTS = new Set([
  "q-doubts",
  "doubts-insight",
  "q5",
  "hit-outcome-month-one",
  "hit-q5-tbd",
  "q6",
  "q7",
  "hit-q7",
  "i-diag",
  "i-compare",
  "q9",
  "hit-q8-scores",
  "q8",
  "achievability",
  "i-gap",
  "name",
  "i2",
  "v1",
  "s4",
  "s5"
]);

export function shouldAttachQuizDoubtsProps(
  stepId: string,
  answers: Record<string, unknown>
): boolean {
  if (!quizPathIncludesQDoubts(answers)) return false;
  return QUIZ_STEPS_AT_OR_AFTER_Q_DOUBTS.has(stepId);
}
