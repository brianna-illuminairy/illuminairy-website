/** SAT-shaped props for data-viz components. */

export type SatSkillImpact = {
  id: string;
  name: string;
  note?: string;
  points: number;
};

export type SatGapBridgeSegment = {
  id: string;
  label: string;
  points: number;
};

export type SatQuestionCell = {
  n: number;
  miss?: "E" | "M" | "H";
  /** Skill tag — shown on hover / tap. */
  topic?: string;
  /** e.g. "Marked C · Correct B" */
  detail?: string;
};

export type SatQuestionModule = {
  label: string;
  cells: SatQuestionCell[];
};

export type SatQuestionSection = {
  title: string;
  modules: SatQuestionModule[];
};

export type SatAccuracyBand = {
  label: "Easy" | "Medium" | "Hard";
  value: number;
};

export type SatAccuracySection = {
  title: string;
  bands: SatAccuracyBand[];
};

export type SatHorizonPoint = {
  id: string;
  label: string;
  score: number;
};

export type SatScorePair = {
  current: number;
  target: number;
  currentLabel?: string;
  targetLabel?: string;
};
