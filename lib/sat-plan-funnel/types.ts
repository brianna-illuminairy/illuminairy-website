export type SatPlanStep =
  | "landing"
  | "worries"
  | "who"
  | "target"
  | "trust"
  | "history"
  | "int3-retake"
  | "prep"
  | "prep-failed-group-class"
  | "prep-failed-self-study"
  | "prep-failed-plateau"
  | "prep-failed-proof"
  | "prep-failed-mentors"
  | "prep-failed-guided"
  | "prep-failed-mistake-driven"
  | "prep-failed-stub"
  | "kid-problem"
  | "score"
  | "wrong"
  | "sat-changed"
  | "gpa"
  | "gpa-paradox"
  | "test-date"
  | "timeline"
  | "plan-path"
  | "contact"
  | "plan-ready"
  | "report"
  | "book";

export type SatPlanAnswers = {
  worries?: string[];
  test_taker?: string;
  target_score?: string;
  test_history?: string;
  prep_method?: string | string[];
  /** INT13 — self-study blocker multiselect (`kid_block_*`). */
  kid_problem_blocks?: string[];
  study_hours?: string;
  recent_score?: string;
  wrong_reasons?: string[];
  gpa_band?: string;
  test_date?: string;
  target_schools?: string;
  parent_email?: string;
  parent_phone?: string;
};

export type SatPlanFunnelState = {
  step: SatPlanStep;
  path: string;
  answers: SatPlanAnswers;
};

export type SatPlanStepMeta = {
  progress: number;
  label: string | null;
  labelUpper?: boolean;
};

/** All routable steps except landing — used for URL validation. */
export const SAT_PLAN_ROUTABLE_STEPS: SatPlanStep[] = [
  "worries",
  "who",
  "target",
  "trust",
  "history",
  "int3-retake",
  "prep",
  "prep-failed-group-class",
  "prep-failed-self-study",
  "prep-failed-plateau",
  "prep-failed-proof",
  "prep-failed-mentors",
  "prep-failed-guided",
  "prep-failed-mistake-driven",
  "prep-failed-stub",
  "kid-problem",
  "score",
  "wrong",
  "sat-changed",
  "gpa",
  "gpa-paradox",
  "test-date",
  "timeline",
  "plan-path",
  "contact",
  "plan-ready",
  "report",
  "book"
];
