export type SohaHomeworkPortalSet = {
  id: string;
  title: string;
  dueLabel: string;
  note: string;
};

export const WEEK1_HOMEWORK_PORTAL_SETS: SohaHomeworkPortalSet[] = [
  {
    id: "transitions-1",
    title: "Transitions 1",
    dueLabel: "Sunday, June 29",
    note: "Complete after the flashcard deck hits 3 rounds in a row at 95%+. Finish before Transitions 2.",
  },
  {
    id: "transitions-2",
    title: "Transitions 2",
    dueLabel: "Before your next session",
    note: "Complete after Transitions 1. Log every miss in your Google Sheet before we meet again.",
  },
];

/** Ordered homework path after Lesson 1. */
export const WEEK1_HOMEWORK_WORKFLOW = [
  {
    step: 1,
    title: "Create your mistake log in Google Sheets",
    detail:
      "Set up one spreadsheet with the five columns from your study plan. You will log every miss from Transitions 1 and Transitions 2 here.",
  },
  {
    step: 2,
    title: "Flashcard deck · 3 rounds at 95%+ in a row",
    detail:
      "Memorize which transition words belong in each category. Use Explain and Show me an example on any phrase that still feels fuzzy. Keep going until three full rounds in a row hit 95% or higher.",
  },
  {
    step: 3,
    title: "Homework Portal · Transitions 1",
    detail: "Due Sunday, June 29. Complete after the flashcard goal. Name the relationship before you read choices.",
  },
  {
    step: 4,
    title: "Homework Portal · Transitions 2",
    detail: "Due before your next session. Complete after Transitions 1.",
  },
  {
    step: 5,
    title: "Log misses from Transitions 1 and Transitions 2",
    detail:
      "Add a row in your Google Sheet for every question you missed in both sets. Write the relationship you should have named and the fix you will use next time.",
  },
] as const;

export const WEEK1_HOMEWORK_INTRO = {
  headline: "Homework Portal · Transitions practice sets",
  body:
    "Transitions 1 and Transitions 2 live in the Homework Portal (separate login). After your Lesson 1 session, follow the steps on this page first, then open the Homework Portal for the problem sets.",
} as const;

export const WEEK1_SLIDE_DECK_HREF = "/soha/files/transitions-lesson";
