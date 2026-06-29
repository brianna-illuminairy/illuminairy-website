/** Week 1 diagnostic review — June 25, 2026 (from Meet transcript). */

export const WEEK1_DIAGNOSTIC_REVIEW = {
  dateLabel: "Wednesday, June 25",
  title: "Diagnostic walkthrough · Math + Reading & Writing",
  summary:
    "Skye had reviewed the portal diagnostic analysis beforehand with no major surprises. We walked missed questions on a shared whiteboard — starting with Math Module 1 and 2, then a first pass through Reading & Writing Module 1. For each miss we named the question type, the setup move, and whether Desmos could finish it once set up. We decided to skip a full Module 2 RW walkthrough and jump into skill lessons next, starting with equivalent expressions and factoring.",
  wins: [
    "Systems (M1Q5): two lines in y = mx + b with opposite slopes and the same intercept cross once — no need to set them equal blindly.",
    "Nonlinear (M1Q7): set y = 64 and y = x² + 8 equal; after x² = 56, factor before taking square roots — √(56/14) = 2, not 4√14.",
    "Nonlinear with a constant (M1Q9 / y − 42 family): the question asks for possible y values, not the value of c; cannot plug into Desmos when c is unknown.",
    "Lines from two points: slope formula or graph both points in Desmos; once slope is known, only one answer choice may match.",
    "Perpendicular lines (M1Q18): negative reciprocal slope — no graph shortcut when only one point is given.",
    "Circle arc (M1Q21): requires memorized arc-length relationship not on the reference sheet.",
    "Equation manipulation (M2Q2): divide every term when isolating P — she had the right idea but picked the wrong rearrangement.",
    "Words in context: use tone/clue from the other sentence (exemplifies, imminent) before reading choices.",
    "Boundaries: label each side as full clause vs fragment; do not rely on “sounds right” pauses — SAT writes against that.",
    "Transitions: read before/after the blank, pick a category (contrast, addition, cause-effect, example), then match a word; barren vs fertile flagged a contrast miss on Q23.",
    "Rhetorical synthesis: read the goal in the question stem first, eliminate notes that are true but do not do that job.",
  ] as const,
  nextSessionNote:
    "We agreed to start formal skill lessons with equivalent expressions and factoring — high impact on Advanced Math (~35% of the section).",
};
