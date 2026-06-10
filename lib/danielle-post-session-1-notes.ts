export const POST_SESSION_1_WINS = [
  "You confirmed the diagnostic read felt accurate before we started, which gave us a clear starting line.",
  "You now know quadratics are not a calculator-first problem type on the SAT.",
  "Your go-to move for quadratics: move everything to one side, set the other side equal to zero, factor into parentheses, then solve for the variable.",
  "For absolute value equations: if the right side is negative, there is no solution. Otherwise set the expression inside the bars equal to both the positive and negative value on the other side.",
  "You named absolute value problems correctly and walked through the two-equation setup when asked.",
  "You spotted quadratics by the squared term and knew to solve by hand when answers include radicals or exact form.",
  "For rational equations, you know the first move is to get rid of the fraction when x is in the denominator.",
  "You already handle line-and-curve systems well with the graphing calculator when the question asks where graphs meet.",
  "You engaged for the full hour, asked for a worked example when you needed one, and stayed with the harder diagnostic walk-throughs."
] as const;

export const POST_SESSION_1_NEXT = [
  "More worked examples on shared-expression factoring (including the y minus c pattern from Module 1).",
  "Radical simplification so exact-form answers are easier to read.",
  "The quadratic formula for equations that do not factor cleanly.",
  "Repeated factoring reps until the AC method and the \"keep the 1\" step feel automatic."
] as const;

export const POST_SESSION_1_HOMEWORK = {
  dueLabel: "Sunday, June 15",
  headline: "Quadratics homework · due Sunday",
  body:
    "We moved your quadratics homework deadline from Thursday to Sunday, June 15 so you have more time to work through the set. Solutions stay visible in the Homework Portal. Work at a steady pace through the week; bring anything still unclear to Thursday's session."
} as const;

export const QUADRATICS_SCORE_CONTEXT = {
  headline: "Why we are staying on quadratics and factoring",
  lede:
    "On the Digital SAT Math section, quadratics and factoring overlap across Advanced Math. They are worth a large share of your Math score, especially if you unlock Hard Module 2.",
  bullets: [
    "Advanced Math is roughly 35% of the Math section (about 15 questions). Quadratics and factoring show up across 6 to 9 questions combined.",
    "Quadratic-specific questions alone can account for roughly 40 to 80 scaled points of your 800-point Math score.",
    "Factoring shows up on equivalent expressions, rational expressions, zeros/roots, and Hard Module factor-by-grouping problems (about 4 to 6 questions per test).",
    "Together, mastering both can influence roughly 70 to 110 scaled points on the path to Hard Module 2. Point values shift with question difficulty; results vary by test form.",
    "That is why Thursday stays in Math. These skills matter a lot for your August target, and it is normal for them to take more than one session to feel automatic."
  ]
} as const;
