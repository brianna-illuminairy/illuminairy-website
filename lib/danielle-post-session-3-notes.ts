export const WEEK3_EE_MISS_TOTAL = 9;
export const WEEK3_EE_MISS_LESSON1 = 4;
export const WEEK3_EE_MISS_LESSON2 = 5;

export const POST_SESSION_3_LESSON1_WINS = [
  "You reviewed 4 of 9 incorrect or skipped equivalent expressions homework problems on the whiteboard.",
  "After each miss, you worked 2 similar examples before moving on.",
  "You finished 8 medium problems on your own at the end of session.",
  "You started naming the pattern (GCF, difference of squares, perfect square, AC split) before expanding."
] as const;

export const LESSON1_AGENDA = [
  {
    time: "6:00 to 6:05",
    segment: "Open",
    detail:
      "Quick recap of your Equivalent Expressions set 2 results. We have 9 incorrect or skipped problems to work through across two sessions."
  },
  {
    time: "6:05 to 6:35",
    segment: "4 homework misses",
    detail:
      "Whiteboard walk-through of the first 4 incorrect or skipped medium problems. After each one, 2 similar examples for you to try."
  },
  {
    time: "6:35 to 6:55",
    segment: "Independent reps",
    detail: "8 medium equivalent expressions problems on your own while I check your setup."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap",
    detail:
      "5 incorrect or skipped problems left from your EE homework. We finish those in Lesson 2, then run the patterns deck."
  }
] as const;

export const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:10",
    segment: "Score recap",
    detail:
      "Quick check on Lesson 1 follow-up reps. Confirm the 5 remaining incorrect or skipped EE homework problems we are finishing today."
  },
  {
    time: "6:10 to 6:35",
    segment: "Remaining 5 misses",
    detail:
      "Whiteboard walk-through of the 5 incorrect or skipped EE homework problems not covered Tuesday. Same format: miss, then 2 similar reps."
  },
  {
    time: "6:35 to 6:55",
    segment: "Patterns deck",
    detail:
      "Work through the equivalent expressions deck: memorize identities, difference of squares, perfect squares, AC method, and the cheat sheet."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework",
    detail:
      "Equivalent Expressions 3 and the Equivalent Expressions Quiz in the Homework Portal."
  }
] as const;

export type Week3HomeworkPortalSet = {
  id: string;
  title: string;
  note: string;
};

export const WEEK3_HOMEWORK_PORTAL_SETS: Week3HomeworkPortalSet[] = [
  {
    id: "equivalent-expressions-3",
    title: "Equivalent Expressions 3",
    note: "Complete after today’s session. Review any misses before the quiz."
  },
  {
    id: "equivalent-expressions-quiz",
    title: "Equivalent Expressions Quiz",
    note: "Complete after Equivalent Expressions 3."
  }
];

export const POST_SESSION_3_LESSON2_HOMEWORK = {
  headline: "Homework Portal · Equivalent expressions",
  body:
    "Your assignments are in the Homework Portal (same login as the header button on this site). They are not on this page."
} as const;

export const WEEK3_SLIDE_DECK_HREF = "/danielle/files/equivalent-expressions-slides";
