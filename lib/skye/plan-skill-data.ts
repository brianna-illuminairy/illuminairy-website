export type PlanSkill = {
  id: string;
  topic: string;
  points: number;
  misses: { m1: number; m2: number; total: number };
};

export const RW_SKILLS: PlanSkill[] = [
  { id: "rw-reading-logic", topic: "Reading logic (main idea, function, structure, evidence)", points: 65, misses: { m1: 3, m2: 2, total: 5 } },
  { id: "rw-transitions", topic: "Transitions", points: 55, misses: { m1: 3, m2: 1, total: 4 } },
  { id: "rw-words", topic: "Words in Context", points: 50, misses: { m1: 2, m2: 2, total: 4 } },
  { id: "rw-boundaries", topic: "Boundaries", points: 40, misses: { m1: 2, m2: 1, total: 3 } },
  { id: "rw-rhetorical", topic: "Rhetorical Synthesis", points: 40, misses: { m1: 2, m2: 1, total: 3 } },
  { id: "rw-modifiers", topic: "Modifiers", points: 15, misses: { m1: 1, m2: 0, total: 1 } },
];

export const MATH_SKILLS: PlanSkill[] = [
  { id: "math-nonlinear", topic: "Nonlinear and quadratic equations (factoring, quadratic formula, radicals, discriminant)", points: 65, misses: { m1: 4, m2: 0, total: 4 } },
  { id: "math-slope", topic: "Slope and linear functions (slope from two points, intercepts, line equations)", points: 40, misses: { m1: 2, m2: 1, total: 3 } },
  { id: "math-systems", topic: "Systems of equations and perpendicular lines", points: 30, misses: { m1: 2, m2: 0, total: 2 } },
  { id: "math-circle", topic: "Circle measures (radians to degrees, arc length)", points: 30, misses: { m1: 2, m2: 0, total: 2 } },
  { id: "math-exponential", topic: "Exponential functions", points: 25, misses: { m1: 1, m2: 1, total: 2 } },
  { id: "math-transforms", topic: "Function transformations", points: 10, misses: { m1: 0, m2: 1, total: 1 } },
  { id: "math-manipulation", topic: "Equation manipulation (rearranging, dividing every term)", points: 10, misses: { m1: 0, m2: 1, total: 1 } },
];

export const PLAN_TOTALS = {
  recoverable: 485,
  rwSection: 265,
  mathSection: 210,
  missCount: 35,
  baselineScore: 1115,
};
