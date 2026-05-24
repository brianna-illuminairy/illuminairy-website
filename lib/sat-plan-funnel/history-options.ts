export type HistoryOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const HISTORY_OPTIONS: HistoryOption[] = [
  {
    id: "history_none",
    label: "No — neither SAT nor PSAT",
    ariaLabel: "No, neither SAT nor PSAT"
  },
  {
    id: "history_psat_only",
    label: "PSAT only",
    ariaLabel: "PSAT only, not the SAT"
  },
  {
    id: "history_once",
    label: "Once",
    ariaLabel: "Taken the SAT or PSAT once before"
  },
  {
    id: "history_twice",
    label: "Twice",
    ariaLabel: "Taken the SAT or PSAT twice before"
  },
  {
    id: "history_three_plus",
    label: "Three or more times",
    ariaLabel: "Taken the SAT or PSAT three or more times"
  }
];

export type HistoryId = (typeof HISTORY_OPTIONS)[number]["id"];
