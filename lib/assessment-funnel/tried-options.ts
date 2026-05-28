export type TriedOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/** Sync with assessment-hims-question-map.md Q5. */
export const TRIED_OPTIONS: TriedOption[] = [
  { id: "tried_khan", label: "Khan Academy", ariaLabel: "Khan Academy" },
  { id: "tried_bluebook", label: "Official Bluebook practice", ariaLabel: "College Board Bluebook" },
  { id: "tried_youtube", label: "YouTube or free videos", ariaLabel: "YouTube or free videos" },
  { id: "tried_class", label: "Group class or course", ariaLabel: "Group class or course" },
  { id: "tried_tutor", label: "Private tutor", ariaLabel: "Private tutor" },
  { id: "tried_little", label: "Little or nothing yet", ariaLabel: "Little or nothing yet" }
];
