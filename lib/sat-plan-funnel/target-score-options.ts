export type TargetScoreOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const TARGET_SCORE_OPTIONS: TargetScoreOption[] = [
  { id: "target_1200_1300", label: "1200–1300", ariaLabel: "Target score 1200 to 1300" },
  { id: "target_1300_1400", label: "1300–1400", ariaLabel: "Target score 1300 to 1400" },
  { id: "target_1400_1500", label: "1400–1500", ariaLabel: "Target score 1400 to 1500" },
  { id: "target_1500_plus", label: "1500+", ariaLabel: "Target score 1500 or higher" },
  { id: "target_not_sure", label: "Not sure yet", ariaLabel: "Not sure about target score yet" }
];

export type TargetScoreId = (typeof TARGET_SCORE_OPTIONS)[number]["id"];

/** Display band for interstitials (INT1, INT6). */
export const TARGET_SCORE_BAND_LABEL: Record<TargetScoreId, string> = {
  target_1200_1300: "1200–1300",
  target_1300_1400: "1300–1400",
  target_1400_1500: "1400–1500",
  target_1500_plus: "1500+",
  target_not_sure: "your target range"
};
