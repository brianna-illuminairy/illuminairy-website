/** Week 1 Session 2 — June 29, 2026 (from Meet transcript). */

export type SkyeHomeworkPortalSet = {
  id: string;
  title: string;
  note: string;
};

export const WEEK1_LESSON2_HOMEWORK_SETS: SkyeHomeworkPortalSet[] = [
  {
    id: "equivalent-expressions-1",
    title: "Equivalent Expressions 1 (easy)",
    note: "Completed — 10 of 11 correct (90.9%).",
  },
  {
    id: "equivalent-expressions-2",
    title: "Equivalent Expressions 2 (medium)",
    note: "Completed — 16 of 19 correct (84.0%).",
  },
];

export const WEEK1_LESSON2 = {
  dateLabel: "Monday, June 29",
  title: "Nonlinear & quadratic equations · equivalent expressions",
  summary:
    "We worked through the quadratics slide deck (identifying quadratics, zero-product property, parabola direction, vertex form, and factoring patterns), then moved to the whiteboard for diagnostic-style reps. Skye walked the full M1Q11 y − 42 problem using the component method: break on operators, factor the shared (y − 42), set each factor to zero. We also covered GCF factoring to read k from a 3x + k factor (stop when the question asks for k — do not keep solving for x), difference of squares on (2x − 7)² − 36, FOIL mapping when standard and factored forms are both given, expanding in components to avoid sign errors, and equivalent-expression setup for 15x + 90 = x/a + b.",
  wins: [
    "Quadratics: highest power must stay x² after simplifying — canceling terms can hide a linear equation.",
    "Solve quadratics by moving everything to one side, factoring, then zero-product property (up to two real solutions).",
    "She already uses the AC method; we reinforced it on x² + 5x − 24 and leading-coefficient trinomials.",
    "Parabola opens down when a < 0 (maximum); vertex form (x − h)² + k gives the min/max directly (e.g. minimum 7 at vertex (4, 7)).",
    "Factored form shows zeros fastest; watch SAT traps where x² cancels and the equation is not quadratic.",
    "M1Q11: factor (y − 42) from both components — include negative signs when splitting; solutions y = 42 and y = 1 − c.",
    "When a factor like 3x + k is given, read k from factored form (k = 4) instead of solving all the way to x.",
    "Difference of squares: (2x − 7)² − 36 → (2x − 7 ± 6) — faster than expanding into a trinomial.",
    "FOIL shortcut: F → x² term, O + I → middle, L → constant; if both forms are given, match unknowns through F, O+I, L.",
    "Work in components when distributing (e.g. 12(x − 3)² + 5(5x − 12) − 8) — fewer sign errors than doing everything at once.",
    "Equivalent expressions with two forms: set them equal; matching constants often gives b first (e.g. b = 90), then solve for a.",
  ] as const,
  homework: {
    headline: "Homework Portal · Equivalent Expressions 1 & 2",
    body:
      "Two problem sets assigned at the end of session. Skye completed both before the Week 1 report — 26 of 30 correct overall (86.7%).",
  },
  nextSession: {
    headline: "Week 2 · Session 1",
    body:
      "We will work through any problems she got incorrect or skipped from Equivalent Expressions 1 and 2. Come ready to name the pattern, walk the method, and redo missed questions on the whiteboard.",
  },
};

export const SKYE_LESSON_DECK_HREF = "/skye/files/quadratics-lesson";
export const SKYE_WHITEBOARD_URL =
  "https://link.excalidraw.com/l/A4T4CdBzqDH/5FcyM67mE1R";
