/** Week 1 Lesson 3 — June 28, 2026 (from Meet transcript). */

export type SohaMathHomeworkSet = {
  id: string;
  title: string;
  note: string;
};

export const WEEK1_LESSON3_MATH_SETS: SohaMathHomeworkSet[] = [
  {
    id: "equivalent-expressions-factoring",
    title: "Equivalent expressions & factoring reps",
    note: "~20–30 problems like the diagnostic misses — complete before Week 2 Session 1.",
  },
];

export const WEEK1_LESSON3 = {
  dateLabel: "Saturday, June 28",
  title: "Transitions wrap · quadratics & equivalent expressions intro",
  summary:
    "We reviewed Soha’s mistake log for Transitions 3 misses (Q15 medium — misread the connection; Q28 hard — conclusion vs addition). Then we opened Week 2 math early: quadratics definition (highest power 2 after simplifying), standard form, move everything to one side before factoring, zero-product property, and two solutions as a safe assumption on quadratics. On the shared whiteboard she worked M1Q11 (y − 42): component split, factor (y − 42) — do not cancel; placeholder 1 when factoring out. We covered the 3x + k factor problem (GCF = 3x, not x → k = 4), introduced the AC method, and factor theorem on x + 2a (set factor = 0, plug in, solve for a = 3/2). She chose to focus homework on problems like the diagnostic reps rather than generic factoring drills.",
  wins: [
    "Transitions Q15: “in addition” in the passage can mislead — name whether it is truly more of the same idea.",
    "Transitions Q28: second sentence can state the conclusion/importance, not just additional detail.",
    "Quadratic check: highest power must stay x² after simplifying — canceling can hide a linear equation.",
    "M1Q11: move to one side first; split into components; factor (y − 42); leave the 1 placeholder; answers y = 42 and y = 1 − c.",
    "Quadratic MC trap: if only “1 and 3” or “1 and 2” appear, eliminate single-value choices — expect two solutions.",
    "3x + k factor: factor GCF 3x first (not x alone) → (3x + 4)(3x² − 2x − 8) → k = 4.",
    "AC method: a·c, find factors that sum to middle coefficient — faster than boxes when fluent.",
    "Factor theorem: if x + 2a is a factor, set x = −2a, plug into f(x), set equal to zero, solve for a.",
    "Exponent slip on (−2)⁵ — apply the power to the base before combining terms.",
  ] as const,
  homework: {
    headline: "Homework Portal · equivalent expressions reps",
    body:
      "About 20–30 problems like today’s whiteboard reps (factor-from-given-factor, factor theorem, diagnostic-style quadratics). Schedule Week 2 sessions on the calendar link.",
  },
  nextSession: {
    headline: "Week 2 · math",
    body:
      "Factoring, factor theorem, and zero-product form — review any homework misses and go deeper on equivalent expressions.",
  },
};

export const WEEK1_LESSON3_WHITEBOARD_URL =
  "https://link.excalidraw.com/l/A4T4CdBzqDH/8yI6ckPlxQP";
