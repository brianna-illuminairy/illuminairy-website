export const POST_SESSION_2_WINS = [
  "You named the relationship between two sentences before looking at answer choices (cover the blank, plain words, then match).",
  "You sorted transition words into contrast, causation, addition, and similarity buckets in the sorting game.",
  "You matched transition phrases to what sentence B usually does in the study board drills.",
  "You used copycat elimination: when two choices do the same job, cross both out before reading the passage.",
  "You revisited Wallace Stevens (Module 1, Q24) with the contrast method and Nonetheless.",
  "You worked Cosmic Canvas (Module 2, Q23) as a sequence problem: first impression to final understanding.",
  "You walked the rhythmicity study (Module 2, Q24) as a concession with Granted."
] as const;

export type Week2HomeworkPortalSet = {
  id: string;
  title: string;
  dueLabel: string;
  startLabel?: string;
  note: string;
};

export const WEEK2_HOMEWORK_PORTAL_SETS: Week2HomeworkPortalSet[] = [
  {
    id: "transitions-1",
    title: "Transitions 1",
    dueLabel: "Wednesday, June 17",
    note: "Complete after the flashcard deck hits 95%. Finish before your next session."
  },
  {
    id: "transitions-2",
    title: "Transitions 2",
    startLabel: "Saturday, June 27",
    dueLabel: "Saturday, June 27",
    note: "Opens Saturday, June 27. Complete after Transitions 1."
  }
];

/** Ordered homework path after Lesson 1. */
export const WEEK2_HOMEWORK_WORKFLOW = [
  {
    step: 1,
    title: "Review the slide deck in more depth",
    detail:
      "Reopen the interactive Transitions lesson fullscreen. Reread the method slides, cheat sheet, and diagnostic walk-throughs — not just the games."
  },
  {
    step: 2,
    title: "Memorize categories and words",
    detail:
      "Know the four categories (contrast & concession, causation, addition & exemplification, similarity & emphasis) and which transition words belong in each bucket. Use the cheat sheet."
  },
  {
    step: 3,
    title: "Flashcard deck until 95% accuracy",
    detail:
      "Use Explain and Show me an example on any phrase that still feels fuzzy. Keep rounds going until overall accuracy is 95%."
  },
  {
    step: 4,
    title: "Homework Portal · Transitions 1",
    detail: "Due Wednesday, June 17. Complete before your next session."
  },
  {
    step: 5,
    title: "Homework Portal · Transitions 2",
    detail: "Opens Saturday, June 27. Due Saturday, June 27. Complete after Transitions 1."
  }
] as const;

export const POST_SESSION_2_HOMEWORK = {
  headline: "Homework Portal · Transitions practice sets",
  body:
    "Two Transitions problem sets live in the Homework Portal (separate login). Follow the steps below on this portal first, then open the Homework Portal for Transitions 1 and 2."
} as const;

/** After Week 2 Lesson 2 (medium session). Assigned in my.illuminairy.com Homework Portal. */
export const POST_SESSION_2_LESSON_2_HOMEWORK = {
  headline: "Homework Portal · Timed Transitions practice",
  title: "Timed Transitions practice",
  dueLabel: "Sunday, June 22",
  problemCount: 30,
  durationMinutes: 37,
  body:
    "Complete the timed set in the Homework Portal: 30 Transitions questions with a 37-minute timer. Run it in one sitting, test conditions. Use the three rules from tonight before you look at choices.",
  rules: [
    "Run the \"so\" test before any cause-and-effect word.",
    "Name the job sentence two is doing before you read the choices.",
    "If you are past 45 seconds on a question, commit and move."
  ] as const
} as const;

export const WEEK2_SLIDE_DECK_HREF = "/danielle/files/transitions-lesson";
