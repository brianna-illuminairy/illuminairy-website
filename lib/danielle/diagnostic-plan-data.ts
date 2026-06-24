/**
 * Danielle Danso — June 6, 2026 MentoMind diagnostic.
 * SSOT for study-plan ranks, miss counts, and tutoring status on weekly reports.
 * Source: exports/danielle-diagnostic-misses-for-week-3.csv + content/danielle/plan.html
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
  readingWriting: { module1Correct: 20, module1Total: 27, module2Earned: "harder" as const },
  math: { module1Correct: 16, module1Total: 22, module2Earned: "harder" as const },
  sectionTotals: {
    readingWriting: { correct: 39, total: 54 },
    math: { correct: 30, total: 44 },
  },
  itemAccuracyPct: 70,
  scoreBand: { low: 1100, high: 1150 },
  goal: 1400,
  modeledGap: 275,
} as const;

/**
 * Ranked skills from plan.html, miss counts verified against diagnostic CSV (29 misses).
 * plan.html miss prose may round or bundle; counts here match the CSV export.
 */
export const DANIELLE_PLAN_SKILLS: DaniellePlanSkill[] = [
  {
    rank: 1,
    label: "Math pacing (runs out of time, rushes end)",
    section: "Math",
    modeledPoints: 35,
    diagnosticMisses: 1,
    diagnosticDetail: "Rushed Module 2 Q22 (percentages) after long time on earlier hard questions",
    status: "pacing-later",
    weeksTaught: "Weeks 8+ (timed drills)",
  },
  {
    rank: 2,
    label: "Area and volume",
    section: "Math",
    modeledPoints: 30,
    diagnosticMisses: 2,
    diagnosticDetail: "Missed 2 (Module 1 Q2 easy, Module 2 Q16 medium)",
    status: "not-started",
    weeksTaught: "Scheduled week 3 on plan calendar",
  },
  {
    rank: 3,
    label: "Command of evidence",
    section: "Reading and Writing",
    modeledPoints: 26,
    diagnosticMisses: 4,
    diagnosticDetail: "Missed 4 (Module 1 Q11 easy, Module 2 Q14/Q15/Q19 hard)",
    status: "self-practice",
    weeksTaught: "Not in sessions yet; Danielle started homework on her own",
  },
  {
    rank: 4,
    label: "Nonlinear functions",
    section: "Math",
    modeledPoints: 24,
    diagnosticMisses: 1,
    diagnosticDetail: "Missed 1 (Module 2 Q14 medium). Parabolas and curves; often solved by graphing",
    status: "not-started",
    weeksTaught: "Starting week 3",
  },
  {
    rank: 5,
    label: "Nonlinear equations and systems",
    section: "Math",
    modeledPoints: 24,
    diagnosticMisses: 5,
    diagnosticDetail:
      "Missed 5 (Module 1 Q11/Q21, Module 2 Q4/Q15/Q21). Her most common miss tag on the test",
    testFrequency: "Appeared 13 times on her diagnostic",
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
    diagnosticDetail: "Missed 3 (Module 1 Q4 medium, Q6/Q7 hard)",
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
    diagnosticDetail: "Missed 2 of 3 on diagnostic (per plan; not in week-3 CSV export)",
    status: "not-started",
    weeksTaught: "Scheduled week 4 on plan calendar",
  },
  {
    rank: 9,
    label: "Words in context",
    section: "Reading and Writing",
    modeledPoints: 18,
    diagnosticMisses: 3,
    diagnosticDetail: "Missed 3 (Module 2 Q2 medium, Q5/Q8 hard)",
    status: "not-started",
    weeksTaught: "Scheduled week 5+ on plan",
  },
  {
    rank: 10,
    label: "Algebra: hard equations and inequalities",
    section: "Math",
    modeledPoints: 18,
    diagnosticMisses: 1,
    diagnosticDetail: "Missed 1 linear equation (Module 1 Q13 medium). Easy/medium algebra otherwise clean",
    status: "not-started",
    weeksTaught: "Scheduled later; she skips easy algebra in plan",
  },
  {
    rank: 11,
    label: "Sentence grammar (form, structure, and sense)",
    section: "Reading and Writing",
    modeledPoints: 16,
    diagnosticMisses: 1,
    diagnosticDetail: "Boundaries miss Module 1 Q21 medium (punctuation between sentences)",
    status: "not-started",
    weeksTaught: "Scheduled week 6 on plan",
  },
  {
    rank: "+",
    label: "Equivalent expressions (factoring / simplifying)",
    section: "Math",
    modeledPoints: 18,
    diagnosticMisses: 1,
    diagnosticDetail: "Missed 1 hard (Module 2 Q11). Bundled in plan as part of smaller singles (+18 total)",
    status: "practice-in-progress",
    weeksTaught: "Week 1 sessions (core focus with nonlinear equations)",
    practiceNow: "95% easy, 72% medium (goal 95%)",
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
