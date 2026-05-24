export type HoursOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const HOURS_OPTIONS: HoursOption[] = [
  {
    id: "hours_under_10",
    label: "Less than 10 hours",
    ariaLabel: "Less than 10 hours of study"
  },
  {
    id: "hours_10_30",
    label: "10–30 hours",
    ariaLabel: "10 to 30 hours of study"
  },
  {
    id: "hours_30_60",
    label: "30–60 hours",
    ariaLabel: "30 to 60 hours of study"
  },
  {
    id: "hours_60_plus",
    label: "60+ hours",
    ariaLabel: "60 or more hours of study"
  },
  {
    id: "hours_not_sure",
    label: "Not sure",
    ariaLabel: "Not sure how many hours"
  },
  {
    id: "hours_skip",
    label: "Skip",
    ariaLabel: "Skip this question"
  }
];

export type HoursId = (typeof HOURS_OPTIONS)[number]["id"];
