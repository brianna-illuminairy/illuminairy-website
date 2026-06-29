export const POST_SESSION_1_SUMMARY =
  "We opened with a quadratics overview — what makes an equation quadratic, standard form, and what the SAT is usually asking for (zeros, vertex, max/min). Then we worked through the factoring refresher in the slide deck: GCF first, difference of squares, perfect square trinomials, basic trinomials, and the AC method when the leading coefficient is not 1. On the whiteboard we walked the full solution to Module 1 Question 11 (the y − 42 nonlinear problem — the constant substitution that most students miss). We introduced the quadratic formula for equations that do not factor cleanly, then ran factor-theorem reps: when a factor like (x + r) is given, set f(r) = 0 and solve.";

export const POST_SESSION_1_WINS = [
  "You simplified before deciding whether an equation is quadratic — checking whether the x² term survives after you move terms.",
  "You pulled out a GCF before trying harder patterns, instead of jumping straight to the AC method.",
  "You recognized difference-of-squares and perfect-square-trinomial shapes without expanding first.",
  "On M1Q11, you saw why testing y = 42 matters — the easy-to-skip solution in a nonlinear equation with a constant.",
  "You set one side equal to zero before factoring, instead of trying to factor while terms were still on both sides.",
  "You wrote the quadratic formula from memory and matched a, b, and c to the standard form before substituting.",
  "On factor-theorem examples, you connected a given factor (x + r) to f(r) = 0 instead of guessing from answer choices.",
] as const;

export type SkyeHomeworkPortalSet = {
  id: string;
  title: string;
  note: string;
};

export const SKYE_HOMEWORK_PORTAL_SETS: SkyeHomeworkPortalSet[] = [
  {
    id: "equivalent-expressions-1",
    title: "Equivalent Expressions 1",
    note: "Complete before your next session. Finish all questions in one sitting if you can.",
  },
  {
    id: "equivalent-expressions-2",
    title: "Equivalent Expressions 2",
    note: "Complete after Equivalent Expressions 1, before your next session.",
  },
];

export const POST_SESSION_1_HOMEWORK = {
  headline: "Homework Portal · Equivalent Expressions 1 & 2",
  body:
    "Two problem sets live in the Homework Portal (separate login from the lesson portal). Complete Equivalent Expressions 1, then Equivalent Expressions 2, before our next session.",
} as const;

export const POST_SESSION_1_NEXT_SESSION = {
  headline: "Next session",
  body:
    "We will work through any problems you got incorrect or skipped from Equivalent Expressions 1 and 2. Come ready to name the pattern, walk the method, and redo missed questions on the whiteboard.",
} as const;

export const SKYE_LESSON_DECK_HREF = "/skye/files/quadratics-lesson";
export const SKYE_WHITEBOARD_URL =
  "https://link.excalidraw.com/l/A4T4CdBzqDH/5FcyM67mE1R";
