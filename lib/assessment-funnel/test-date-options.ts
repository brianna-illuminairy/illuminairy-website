export type AssessmentTestTimingOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const ASSESSMENT_TEST_TIMING_OPTIONS: AssessmentTestTimingOption[] = [
  {
    id: "timing_fall_2026",
    label: "This fall (2026)",
    ariaLabel: "SAT this fall 2026"
  },
  {
    id: "timing_winter_2026",
    label: "This winter (2026–27)",
    ariaLabel: "SAT this winter"
  },
  {
    id: "timing_not_sure",
    label: "Not sure yet",
    ariaLabel: "Test date not sure yet"
  },
  {
    id: "timing_not_planning",
    label: "Not planning a specific date yet",
    ariaLabel: "Not planning a specific test date"
  }
];
