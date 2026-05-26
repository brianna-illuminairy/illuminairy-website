export type HistoryOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const HISTORY_OPTIONS: HistoryOption[] = [
  {
    id: "history_none",
    label: "Not yet — no SAT or PSAT",
    ariaLabel: "Not yet, no SAT or PSAT"
  },
  {
    id: "history_psat_only",
    label: "PSAT only (not SAT yet)",
    ariaLabel: "PSAT only, not the SAT yet"
  },
  {
    id: "history_once",
    label: "SAT once",
    ariaLabel: "SAT once before"
  },
  {
    id: "history_twice",
    label: "SAT twice",
    ariaLabel: "SAT twice before"
  },
  {
    id: "history_three_plus",
    label: "SAT 3+ times",
    ariaLabel: "SAT three or more times before"
  }
];

export type HistoryId = (typeof HISTORY_OPTIONS)[number]["id"];
