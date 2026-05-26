export type MeaningOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const MEANING_OPTIONS: MeaningOption[] = [
  {
    id: "college_options",
    label: "More college options",
    ariaLabel: "More college options"
  },
  {
    id: "less_stress",
    label: "Less stress before applications",
    ariaLabel: "Less stress before college applications"
  },
  {
    id: "test_confidence",
    label: "More confidence on test day",
    ariaLabel: "More confidence on test day"
  },
  {
    id: "match_gpa",
    label: "A score that matches their GPA",
    ariaLabel: "An SAT score that matches their GPA"
  },
  {
    id: "peace_of_mind",
    label: "Peace of mind before deadlines",
    ariaLabel: "Peace of mind before application deadlines"
  },
  {
    id: "feel_ready",
    label: "Feeling ready, not guessing",
    ariaLabel: "Feeling ready for the SAT, not guessing"
  }
];
