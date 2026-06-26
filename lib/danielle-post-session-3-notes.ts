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
      "Assign Equivalent Expressions 3 in the Homework Portal. Quiz at the start of Week 4."
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
    note:
      "Untimed. Goal: 100% accuracy. Use your whiteboard, Excalidraw notes, and the formula sheet freely while you work every question. Afterward, use solutions and the chatbot for extra reps on each miss."
  },
  {
    id: "equivalent-expressions-quiz",
    title: "Equivalent Expressions Quiz",
    note:
      "We start Week 4 with this quiz in session. Finish Equivalent Expressions 3 and your miss review first."
  }
];

export const WEEK3_POST_SESSION_WORKFLOW = [
  {
    step: 1,
    title: "Review the formula sheet",
    detail:
      "Read through perfect squares, difference of squares, and FOIL matching (factored = expanded) before you touch practice reps."
  },
  {
    step: 2,
    title: "Review the patterns deck",
    detail:
      "Reopen the equivalent expressions slide deck fullscreen. Reread the identities, cheat sheet, and worked examples from Lesson 2."
  },
  {
    step: 3,
    title: "Practice hub · pass all four sections",
    detail:
      "Work the portal exercise until you pass Pattern spotter, FOIL builder, Combine & simplify, and Missing values (20 reps each, pass targets on the hub)."
  },
  {
    step: 4,
    title: "Homework Portal · Equivalent Expressions 3",
    detail:
      "Untimed set. Goal: 100% accuracy. Use your whiteboard, Excalidraw session notes, and the formula sheet to get every question right."
  },
  {
    step: 5,
    title: "Miss review · solutions, then chatbot reps",
    detail:
      "For every question you missed on set 3: read the solution and understand why the correct answer works. Then use the Homework Portal chatbot to get more questions of that same type. Keep going until you can finish them on your own. For each miss, aim for 3 correct in a row before you move on."
  },
  {
    step: 6,
    title: "Next week · Equivalent Expressions Quiz",
    detail:
      "We open Week 4 with a quiz on equivalent expressions. Be ready after set 3 and your miss review are solid."
  }
] as const;

export const POST_SESSION_3_LESSON2_HOMEWORK = {
  headline: "Post-session homework · follow in order",
  body:
    "Review the formula sheet and patterns deck, pass all four practice hub sections, then complete Equivalent Expressions 3 in the Homework Portal (untimed, 100% accuracy). For each miss: read the solution, use the chatbot for more of that question type, and get 3 in a row correct before you move on. The quiz comes at the start of next week."
} as const;

export const WEEK3_SLIDE_DECK_HREF = "/danielle/files/equivalent-expressions-slides";

/** Excalidraw session notes from Week 3 whiteboard work. */
export const WEEK3_WHITEBOARD_NOTES_URL =
  "https://link.excalidraw.com/l/A4T4CdBzqDH/8yI6ckPlxQP";
