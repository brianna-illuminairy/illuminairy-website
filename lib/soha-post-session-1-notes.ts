export const POST_SESSION_1_WINS = [
  "You named the relationship between two sentences before looking at answer choices (cover the blank, plain words, then match).",
  "You sorted transition words into contrast, causation, addition, and similarity buckets in the sorting game.",
  "You matched transition phrases to what sentence B usually does in the study board drills.",
  "You used copycat elimination: when two choices do the same job, cross both out before reading the passage.",
  "You revisited the cortisol question (Module 1, Q22) with the contrast method and In contrast.",
  "You worked Cosmic Canvas (Module 2, Q23) as a sequence problem: first impression to final understanding with Ultimately.",
] as const;

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

/** Ordered homework path after Week 1 Lesson 1. */
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

export const POST_SESSION_1_HOMEWORK = {
  headline: "Homework Portal · Transitions practice sets",
  body:
    "Transitions 1 and Transitions 2 live in the Homework Portal (separate login). Follow the steps below on this portal first, then open the Homework Portal for the problem sets.",
} as const;

export const WEEK1_SLIDE_DECK_HREF = "/soha/files/transitions-lesson";
