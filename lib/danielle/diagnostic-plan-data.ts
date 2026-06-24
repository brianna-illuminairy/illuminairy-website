/**
 * Danielle Danso — June 6, 2026 MentoMind diagnostic.
 * SSOT for study-plan ranks, miss counts, and tutoring status on weekly reports.
 * Source: content/danielle/diagnostic-tabular.pdf (Jun 6, 2026 tabular export)
 * Point values are modeled (not official SAT scoring). See docs/data-visualization-sat-model.md
 */

export type DaniellePlanSkillStatus =
  | "not-started"
  | "in-sessions"
  | "practice-strong"
  | "practice-in-progress"
  | "self-practice"
  | "pacing-later";

export type DaniellePlanSkill = {
  rank: number | "+";
  label: string;
  section: "Math" | "Reading and Writing" | "Both";
  modeledPoints: number;
  diagnosticMisses: number;
  diagnosticDetail: string;
  /** Questions on full test in this skill family (when known) */
  testFrequency?: string;
  status: DaniellePlanSkillStatus;
  weeksTaught: string;
  practiceNow?: string;
};

/** Module 1 routing from diagnostic (MentoMind). Cutoff ~18 RW, ~15 Math for harder Module 2. */
export const DANIELLE_MODULE_ROUTING = {
  readingWriting: {
    module1Correct: 19,
    module1Total: 27,
    module2Correct: 19,
    module2Total: 27,
    module2Earned: "harder" as const,
  },
  math: {
    module1Correct: 16,
    module1Total: 22,
    module2Correct: 12,
    module2Total: 22,
    module2Earned: "harder" as const,
  },
  sectionTotals: {
    readingWriting: { correct: 38, total: 54 },
    math: { correct: 28, total: 44 },
  },
  itemAccuracyPct: 67,
  scoreBand: { low: 1100, high: 1150 },
  sectionScores: {
    readingWriting: { low: 580, high: 600 },
    math: { low: 520, high: 550 },
  },
  goal: 1400,
  modeledGap: 275,
} as const;

/**
 * Ranked skills from plan.html; miss counts verified against diagnostic-tabular.pdf (32 misses, 66/98 correct).
 */
export const DANIELLE_PLAN_SKILLS: DaniellePlanSkill[] = [
  {
    rank: 1,
    label: "Math pacing (runs out of time, rushes end)",
    section: "Math",
    modeledPoints: 35,
    diagnosticMisses: 2,
    diagnosticDetail:
      "Rushed Module 2 Q21 (percentages) and Q22 (ratios) under a minute each after long time on earlier hard questions",
    status: "pacing-later",
    weeksTaught: "Weeks 8+ (timed drills)",
  },
  {
    rank: 2,
    label: "Area and volume",
    section: "Math",
    modeledPoints: 30,
    diagnosticMisses: 3,
    diagnosticDetail: "Missed all 3 (Module 1 Q2 easy, Module 2 Q14 medium, Module 2 Q19 hard)",
    status: "not-started",
    weeksTaught: "Scheduled week 3 on plan calendar",
  },
  {
    rank: 3,
    label: "Command of evidence",
    section: "Reading and Writing",
    modeledPoints: 26,
    diagnosticMisses: 3,
    diagnosticDetail: "Missed 3 (Module 1 Q11 easy, Module 2 Q14/Q15 hard)",
    status: "self-practice",
    weeksTaught: "Not in sessions yet; Danielle started homework on her own",
  },
  {
    rank: 4,
    label: "Nonlinear functions",
    section: "Math",
    modeledPoints: 24,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 (Module 1 Q9 medium, Module 2 Q20 hard). Parabolas and curves; often solved by graphing",
    status: "not-started",
    weeksTaught: "Starting week 3",
  },
  {
    rank: 5,
    label: "Nonlinear equations and systems",
    section: "Math",
    modeledPoints: 24,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 (Module 1 Q11 medium, Module 2 Q4 medium)",
    testFrequency:
      "8 equation items on the diagnostic; 13 total with nonlinear functions (#4) combined",
    status: "in-sessions",
    weeksTaught: "Week 1 sessions; week 3 continues (quadratic formula, discriminant)",
    practiceNow: "Week 1 math practice ~89%; diagnostic misses reviewed in slides",
  },
  {
    rank: 6,
    label: "Text structure and purpose",
    section: "Reading and Writing",
    modeledPoints: 24,
    diagnosticMisses: 3,
    diagnosticDetail: "Missed 3 (Module 1 Q4 medium, Q6 hard, Module 2 Q8 hard)",
    status: "not-started",
    weeksTaught: "Scheduled later on plan",
  },
  {
    rank: 7,
    label: "Transitions",
    section: "Reading and Writing",
    modeledPoints: 22,
    diagnosticMisses: 3,
    diagnosticDetail: "Missed 3 (Module 1 Q24 easy, Module 2 Q23 medium, Q24 hard)",
    status: "practice-strong",
    weeksTaught: "Week 2 sessions (both hours)",
    practiceNow: "96% set 1, 96% flashcards, 88% hard untimed; timed set due June 28",
  },
  {
    rank: 8,
    label: "Circles",
    section: "Math",
    modeledPoints: 20,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 of 3 (Module 1 Q13 medium, Module 1 Q21 hard)",
    status: "not-started",
    weeksTaught: "Scheduled week 4 on plan calendar",
  },
  {
    rank: 9,
    label: "Words in context",
    section: "Reading and Writing",
    modeledPoints: 18,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 (Module 2 Q2 medium, Module 2 Q5 hard)",
    status: "not-started",
    weeksTaught: "Scheduled week 5+ on plan",
  },
  {
    rank: 10,
    label: "Algebra: hard equations and inequalities",
    section: "Math",
    modeledPoints: 18,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 hard (Module 2 Q15 linear inequalities, Module 2 Q16 linear equations in two variables)",
    status: "not-started",
    weeksTaught: "Scheduled later; she skips easy algebra in plan",
  },
  {
    rank: 11,
    label: "Sentence grammar (form, structure, and sense)",
    section: "Reading and Writing",
    modeledPoints: 16,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 (Module 1 Q20 easy, Module 1 Q21 medium)",
    status: "not-started",
    weeksTaught: "Scheduled week 6 on plan",
  },
  {
    rank: "+",
    label: "Equivalent expressions (factoring / simplifying)",
    section: "Math",
    modeledPoints: 18,
    diagnosticMisses: 1,
    diagnosticDetail:
      "Missed 1 hard (Module 2 Q11). Foundation for most non-graphing Advanced Math: quadratics (#5), rewriting functions (#4), simplifying linear and quadratic forms",
    status: "practice-in-progress",
    weeksTaught: "Week 1 sessions (taught with #5; same moves on most Advanced Math items)",
    practiceNow: "95% easy, 72% medium (goal 95%); underpins #4 and #5",
  },
];

export function daniellePlanSkillsInProgress() {
  return DANIELLE_PLAN_SKILLS.filter(
    (s) =>
      s.status === "in-sessions" ||
      s.status === "practice-strong" ||
      s.status === "practice-in-progress"
  );
}

export function daniellePlanSkillsTaughtInSessions() {
  return DANIELLE_PLAN_SKILLS.filter(
    (s) => s.status === "in-sessions" || s.status === "practice-strong" || s.status === "practice-in-progress"
  );
}
