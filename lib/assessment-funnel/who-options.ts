export type WhoOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/** Sync labels with assessment-hims-question-map.md Q2 before marking approved. */
export const WHO_OPTIONS: WhoOption[] = [
  { id: "test_taker_daughter", label: "My daughter", ariaLabel: "My daughter" },
  { id: "test_taker_son", label: "My son", ariaLabel: "My son" },
  {
    id: "test_taker_self",
    label: "Myself (I'm the student)",
    ariaLabel: "Myself, I am the student"
  },
  {
    id: "test_taker_other",
    label: "Another student in my care",
    ariaLabel: "Another student in my care"
  }
];

export type WhoOptionId = (typeof WHO_OPTIONS)[number]["id"];
