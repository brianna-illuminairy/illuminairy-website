export type AssessmentStep =
  | "landing"
  | "situation"
  | "who"
  | "target"
  | "current"
  | "tried"
  | "test-date"
  | "insight-situation"
  | "insight-path"
  | "complete";

export type AssessmentAnswers = {
  situation?: string;
  test_taker?: string;
  target_score?: string;
  recent_score?: string;
  tried_methods?: string[];
  test_timing?: string;
};

export type AssessmentFunnelState = {
  step: AssessmentStep;
  answers: AssessmentAnswers;
  landing_ctx?: "low" | "high";
};

export type AssessmentStepMeta = {
  progress: number;
  label: string | null;
  labelUpper?: boolean;
};

export const ASSESSMENT_ROUTABLE_STEPS: AssessmentStep[] = [
  "situation",
  "who",
  "target",
  "current",
  "tried",
  "test-date",
  "insight-situation",
  "insight-path",
  "complete"
];

export const ASSESSMENT_QUESTION_STEPS: AssessmentStep[] = [
  "situation",
  "who",
  "target",
  "current",
  "tried",
  "test-date"
];
