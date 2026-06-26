export const WEEK3_EE_MISS_TOTAL = 9;
export const WEEK3_EE_MISS_LESSON1 = 4;
export const WEEK3_EE_MISS_LESSON2 = 5;

/** Narrative recap from the Jun 23 session transcript (Google Drive). */
export const POST_SESSION_3_LESSON1_SUMMARY =
  "We opened on your Equivalent Expressions set 2 misses and worked live on the whiteboard. You walked two factor-theorem cubics (pull a GCF, then AC split to match a given factor like 3x + k or 2x + k). We refreshed the AC method: label a, b, c, multiply to get the target, then split the middle term. You also nailed the difference-of-squares pattern on (2x − 7)² − 36, combined like terms on the two-variable distribute-and-match problem (Q3), and we started the squared-binomial rep from set 2 Q10 before time ran out.";

export const POST_SESSION_3_LESSON1_WINS = [
  "You recognized factor-theorem prompts: simplify first, factor, then read k from the matching binomial (not “set to zero”).",
  "You pulled GCFs cleanly on cubics (3x on 9x³ − 6x² − 4x; 4x on 4x³ + 12x² − 16x) before AC splitting.",
  "You refreshed AC method: target = a × c, find two numbers that multiply to the target and add to b, then split and group.",
  "On the harder cubic you saw when the prompt asks for 2x + k but your factor is x + 4: multiply both terms by 2 to match.",
  "You spotted difference of squares (something² minus something²) and applied a² − b² = (a − b)(a + b), then simplified.",
  "On combine-and-match (Q3), distributing the negative across the second group was your first move before matching ax² + bxy + c.",
  "You named the three equivalent-expression moves: factor, expand, or a special identity (difference of squares, perfect square)."
] as const;

export const LESSON1_AGENDA = [
  {
    time: "6:00 to 6:05",
    segment: "Open",
    detail:
      "Week 2 report recap. Nine incorrect or skipped equivalent expressions problems to split across two sessions."
  },
  {
    time: "6:05 to 6:20",
    segment: "Factor theorem + AC",
    detail:
      "Two cubics: 9x³ − 6x² − 4x (3x + k, k = 4) and 4x³ + 12x² − 16x (2x + k, k = 8). GCF, AC split, rescale when the factor coefficient differs."
  },
  {
    time: "6:20 to 6:30",
    segment: "Difference of squares",
    detail:
      "(2x − 7)² − 36: identity a² − b², then combine inside each binomial. Extra rep for speed."
  },
  {
    time: "6:30 to 6:40",
    segment: "Combine & coefficients",
    detail:
      "Set 2 Q3: distribute the negative, combine like terms, match ax² + bxy + c, add a + b."
  },
  {
    time: "6:40 to 7:00",
    segment: "Squared binomial (carryover)",
    detail:
      "Started set 2 Q10 (3(x + 5)² − 2(x − 5)² + 2x). Finished Thursday with the FOIL / reverse-FOIL shortcut."
  }
] as const;

/** Narrative recap from the Jun 25/26 session transcript (Google Drive). */
export const POST_SESSION_3_LESSON2_SUMMARY =
  "We picked up set 2 Q10 with a cleaner FOIL map: F gives the x² term, L gives the constant, O + I gives the middle. You finished the skipped expand-then-factor monster (Q12) by breaking into components, using (a − b)², and using sign rules on answer choices to stop early. We closed the two skipped rational and missing-value problems (Q16: match constants then solve for a; Q18: L = 3D, middle = O + I, solve for c). Patterns deck moved to homework; Equivalent Expressions 3 assigned untimed with chatbot reps on misses.";

export const POST_SESSION_3_LESSON2_WINS = [
  "On (5x + 5)(4x + b) = 20x² + kx + 25 you mapped FOIL to the expanded form: F → x², L → constant, O + I → middle (k = 45, not 50).",
  "You used reverse FOIL: once F and L pin down a and b, only outer + inner builds the middle term.",
  "On Q12 you split 12(x − 3)² + 5(5x − 12) − 8 into components, applied (a − b)² for the square, then recombined.",
  "You used AC sign logic to eliminate choices early: product positive + sum negative → both factors negative.",
  "On Q16 (15x + 90 = x/a + b) you matched the constants (b = 90), cleared the fraction, and solved a = 1/15.",
  "On Q18 ((2x + 3)(2x + d) = 4x² + 7x + c) you tied c to L (3D) and solved D from O + I = 7x → c = 3/2.",
  "You know the memorization list: difference of squares, (a + b)², (a − b)², and when to reach for AC after expanding."
] as const;

export const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:15",
    segment: "Finish Q10",
    detail:
      "Set 2 Q10 from Tuesday: FOIL labels on (5x + 5)(4x + b) = 20x² + kx + 25. Reverse FOIL to find k = 45."
  },
  {
    time: "6:15 to 6:30",
    segment: "Q12 expand + factor",
    detail:
      "12(x − 3)² + 5(5x − 12) − 8: component breakdown, perfect square formula, combine, AC sign shortcuts on choices."
  },
  {
    time: "6:30 to 6:40",
    segment: "Q16 missing a and b",
    detail: "15x + 90 = x/a + b: match constants, clear the fraction, solve for a, then ab."
  },
  {
    time: "6:40 to 6:55",
    segment: "Q18 missing c",
    detail:
      "(2x + 3)(2x + d) = 4x² + 7x + c: L gives c in terms of D; O + I gives the middle; plug back for c = 3/2."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework",
    detail:
      "Patterns deck, formula sheet, and practice hub in the portal. Equivalent Expressions 3 untimed; quiz Week 4."
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
