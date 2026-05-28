// psych-in: overwhelm | psych-out: seen | get-at: segment Q1
export type SituationOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const SITUATION_OPTIONS: SituationOption[] = [
  {
    id: "deadline_pressure",
    label: "SAT score too low, need to improve before application deadlines",
    ariaLabel: "Need to improve before application deadlines"
  },
  {
    id: "retake_big_lift",
    label: "Low SAT score, need to improve 150+ points on a retake",
    ariaLabel: "Need a large improvement on a retake"
  },
  {
    id: "fall_high_intent",
    label: "Taking the SAT this fall, ready to start tutoring",
    ariaLabel: "Taking the SAT this fall, ready to start"
  },
  {
    id: "winter_research",
    label: "Taking the SAT this winter, exploring prep options",
    ariaLabel: "Taking the SAT this winter, exploring options"
  },
  {
    id: "proactive_early",
    label: "Haven’t started prep yet, want to get ahead early",
    ariaLabel: "Want to get ahead early"
  },
  {
    id: "none_of_above",
    label: "None of the above",
    ariaLabel: "None of the above"
  }
];

export type SituationId = (typeof SITUATION_OPTIONS)[number]["id"];
