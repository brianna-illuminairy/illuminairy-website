export type WorryOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const WORRY_OPTIONS: WorryOption[] = [
  { id: "recent_test", label: "Recent score", ariaLabel: "Recent test score" },
  { id: "upcoming_not_ready", label: "Upcoming test", ariaLabel: "Upcoming test, not ready" },
  { id: "target_schools_low", label: "Below range", ariaLabel: "Score below range for target schools" },
  {
    id: "early_deadlines",
    label: "App deadlines",
    ariaLabel: "Early Action and Early Decision application deadlines"
  },
  {
    id: "stuck_score",
    label: "Already retook",
    ariaLabel: "Taken it 2 or more times, score will not budge"
  },
  { id: "not_prepped", label: "Haven't started", ariaLabel: "Have not started prepping" }
];
