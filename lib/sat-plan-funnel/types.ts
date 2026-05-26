export type SatPlanStep =
  | "landing"
  | "meaning"
  | "worries"
  | "who"
  | "student-name"
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
  | "score"
  | "wrong"
  | "sat-changed"
  | "gpa"
  | "gpa-paradox"
  | "test-date"
  | "timeline"
  | "schools"
  | "score-fit"
  | "plan-path"
  | "ch3-social"
  | "ch3-method"
  | "ch3-preview"
  | "ch3-path"
  | "contact"
  | "reveal-stakes"
  | "reveal-diagnosis"
  | "reveal-bottlenecks"
  | "reveal-proof"
  /** @deprecated Legacy URL — redirects to reveal-stakes */
  | "plan-ready"
  /** @deprecated Legacy URL — redirects to reveal-diagnosis */
  | "report"
  | "book"
  | "booked";

export type SatPlanAnswers = {
  meaning?: string[];
  worries?: string[];
  test_taker?: string;
  student_first_name?: string;
  target_score?: string;
  test_history?: string;
  prep_method?: string | string[];
  /** Deprecated INT13 — kept for saved sessions; screen removed from funnel. */
  kid_problem_blocks?: string[];
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
  "meaning",
  "worries",
  "who",
  "student-name",
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
  "score",
  "wrong",
  "sat-changed",
  "gpa",
  "gpa-paradox",
  "test-date",
  "timeline",
  "schools",
  "score-fit",
  "plan-path",
  "ch3-social",
  "ch3-method",
  "ch3-preview",
  "ch3-path",
  "contact",
  "reveal-stakes",
  "reveal-diagnosis",
  "reveal-bottlenecks",
  "reveal-proof",
  "book",
  "booked"
];
