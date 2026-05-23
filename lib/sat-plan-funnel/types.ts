export type SatPlanStep = "landing" | "worries" | "chapter1-stub";

export type SatPlanAnswers = {
  worries?: string[];
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
