/**
 * Intake copy — sync with quizfunnel/files/assessment-hims-question-map.md.
 * Only `approved` steps are locked for launch; `draft` may change after review.
 */

export type CopyApproval = "approved" | "draft";

export type AssessmentQuestionCopy = {
  approval: CopyApproval;
  headline: string;
  hint: string | null;
};

export const SITUATION_QUESTION_COPY: AssessmentQuestionCopy = {
  approval: "approved",
  headline: "Which best represents your high schooler's SAT situation and goals?",
  hint: null
};

export const WHO_QUESTION_COPY: AssessmentQuestionCopy = {
  approval: "draft",
  headline: "Who is this for?",
  hint: "We'll ask about their SAT next."
};

export const TARGET_QUESTION_COPY: AssessmentQuestionCopy = {
  approval: "draft",
  headline: "What score range are you hoping they reach?",
  hint: null
};

export const CURRENT_QUESTION_COPY = {
  approval: "draft" as CopyApproval,
  headlineDefault: "What's their most recent SAT score?",
  headlineProactiveEarly: "Where are they starting from?",
  hintProactiveEarly: "A practice test estimate is fine"
};

export const TRIED_QUESTION_COPY: AssessmentQuestionCopy = {
  approval: "draft",
  headline: "What have you already tried for SAT prep?",
  hint: "Select all that apply"
};

export const TEST_DATE_QUESTION_COPY: AssessmentQuestionCopy = {
  approval: "draft",
  headline: "When are they planning to take the SAT?",
  hint: null
};
