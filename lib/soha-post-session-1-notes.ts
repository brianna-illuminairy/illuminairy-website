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
    dueLabel: "Completed Jun 25",
    note: "Completed before Lesson 2. Log any misses in your Google Sheet.",
  },
  {
    id: "transitions-2",
    title: "Transitions 2",
    dueLabel: "Completed Jun 25",
    note: "Completed before Lesson 2. We reviewed every miss in session.",
  },
  {
    id: "transitions-3",
    title: "Transitions 3 (timed)",
    dueLabel: "Completed Jun 25",
    note: "28/30 (93%) in session — 100% easy, ~95% medium/hard.",
  },
  {
    id: "transitions-medium-hard",
    title: "Transitions · medium & hard",
    dueLabel: "Before Week 2",
    note: "Assigned after the timed quiz. Finish before math-heavy Week 2.",
  },
  {
    id: "equivalent-expressions-factoring",
    title: "Equivalent expressions reps",
    dueLabel: "Before Week 2 Session 1",
    note: "Assigned after Lesson 3 — diagnostic-style factoring and EE problems.",
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
