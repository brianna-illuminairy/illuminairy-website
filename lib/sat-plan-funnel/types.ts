export type SatPlanStep = "landing" | "worries" | "who" | "target-stub";

export type SatPlanAnswers = {
  worries?: string[];
  test_taker?: string;
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
