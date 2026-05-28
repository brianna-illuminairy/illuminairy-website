export type CurrentScoreOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/** Sync with assessment-hims-question-map.md Q4. */
export const CURRENT_SCORE_OPTIONS: CurrentScoreOption[] = [
  {
    id: "score_below_1000",
    label: "Below 1000",
    ariaLabel: "Most recent score below 1000"
  },
  {
    id: "score_1000_1100",
    label: "1000–1100",
    ariaLabel: "Most recent score 1000 to 1100"
  },
  {
    id: "score_1100_1200",
    label: "1100–1200",
    ariaLabel: "Most recent score 1100 to 1200"
  },
  {
    id: "score_1200_1300",
    label: "1200–1300",
    ariaLabel: "Most recent score 1200 to 1300"
  },
  {
    id: "score_1300_plus",
    label: "1300+",
    ariaLabel: "Most recent score 1300 or higher"
  },
  {
    id: "score_not_tested",
    label: "Hasn't taken the SAT yet",
    ariaLabel: "Has not taken the SAT yet"
  }
];

export type CurrentScoreId = (typeof CURRENT_SCORE_OPTIONS)[number]["id"];
