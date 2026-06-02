import {
  buildScorePathOutput,
  type QuizAnswersLike,
  type ScorePathOutput,
} from "@/lib/quiz-funnel/score-path-output";
import {
  SCORE_PATH_DEFAULT_GAIN,
  SCORE_PATH_DEFAULT_WEEKS,
  hasKnownStartingScore,
  hasTargetScore,
  q5DisplayLabel,
} from "@/lib/quiz-funnel/quiz-profile";
import {
  normalizeQ7,
  selectedPrepLabels,
  Q7_PREP_LABELS,
} from "@/lib/quiz-funnel/prep-copy";
import { weeksUntilQ5Test, hasScheduledTestDate } from "@/lib/quiz-funnel/gains";
import { satProgramOutcomes } from "@/lib/site";
import { stakesGoalLabel, stakesSubheadOpener, stakesVerdictPrefix } from "@/lib/quiz-funnel/stakes-copy";
import { buildGoalAchievability, type GoalAchievability } from "@/lib/quiz-funnel/goal-achievability";

/** Diagnostic ranks 5–6 skills; examples on this page show 5. */
const DIAGNOSTIC_SKILL_RANGE = "5–6";

const EVERYTHING_VS_FEW =
  "everything on the SAT instead of the few skills that actually move their score";

const Q4_INPUT_LABEL: Record<string, string> = {
  na: "No official SAT yet",
  u1000: "Under 1100",
  "1100-1200": "1100–1200",
  "1200-1300": "1200–1300",
  "1300-1400": "1300–1400",
  "1400plus": "1400+",
};

const Q5_INPUT_LABEL: Record<string, string> = {
  aug22: "Aug 22, 2026",
  sept12: "Sept 12, 2026",
  oct3: "Oct 3, 2026",
  nov7: "Nov 7, 2026",
  dec5: "Dec 5, 2026",
  tbd: "Not sure yet",
};

const Q3_INPUT_LABEL: Record<string, string> = {
  "sat-1": "Once",
  "sat-2": "Twice",
  "sat-3+": "Three or more times",
  "psat-only": "PSAT only",
  none: "First official SAT",
};

const Q8_INPUT_LABEL: Record<string, string> = {
  "1250": "1250",
  "1300": "1300",
  "1350": "1350",
  "1400": "1400",
  "1450": "1450+",
  tbd: "Not sure yet",
};

const Q9_INPUT_LABEL: Record<string, string> = {
  "u3.0": "Under 3.0",
  "3.0-3.3": "3.0 – 3.3",
  "3.3-3.5": "3.3 – 3.5",
  "3.5-3.7": "3.5 – 3.7",
  "3.7-3.9": "3.7 – 3.9",
  "4.0+": "4.0+",
};

const Q2_INPUT_LABEL: Record<string, string> = {
  merit: "Merit scholarships",
  "top-choice": "Top-choice school",
  selective: "Selective colleges",
  "app-rounds": "Early application rounds",
  early: "Early application rounds",
};

function q2Label(q2?: string): string {
  return stakesGoalLabel(q2) || Q2_INPUT_LABEL[q2 ?? ""] || q2 || "Selective colleges";
}

const Q6_INPUT_LABEL: Record<string, string> = {
  math: "Math",
  reading: "Reading & writing",
  "self-study": "Self-study isn't working",
  "no-plan": "No clear plan",
  wont: "Won't study on their own",
  "too-busy": "Too busy",
};

const Q7_WHY_FAILED: Record<string, string> = {
  khan:
    "Khan walks through the whole course, not the 5–6 skills the Skill Diagnostic will show matter most for them.",
  group:
    "The class taught every topic at the same pace. Nobody sorted out which skills your student was actually missing.",
  online:
    "Everyone got the same syllabus. No one ranked what your student should work on first.",
  app:
    "The app kept giving practice questions. It never named which skills to fix first.",
  book:
    "The book covers the whole test. It doesn't tell you where to start for your student.",
  nothing:
    "Without the Skill Diagnostic, they had to guess where to start and spent time on the wrong topics.",
};

const Q7_PRIORITY = ["khan", "group", "online", "app", "book", "nothing"] as const;

const MATH_LEVERS = [
  { name: "Linear functions", pts: 50 },
  { name: "Right triangles & trig", pts: 45 },
  { name: "Quadratics", pts: 40 },
  { name: "Word problems", pts: 35 },
  { name: "Functions & graphs", pts: 30 },
];

const READING_LEVERS = [
  { name: "Inference & main idea", pts: 50 },
  { name: "Vocab in context", pts: 45 },
  { name: "Reading pacing", pts: 40 },
  { name: "Evidence-based reading", pts: 35 },
  { name: "Question-first strategy", pts: 30 },
];

function pickTopLevers(q6: string[] = []) {
  const hasMath = q6.includes("math");
  const hasReading = q6.includes("reading");
  if (hasMath && !hasReading) return MATH_LEVERS;
  if (hasReading && !hasMath) return READING_LEVERS;
  return [
    MATH_LEVERS[0],
    READING_LEVERS[0],
    MATH_LEVERS[1],
    READING_LEVERS[1],
    MATH_LEVERS[2],
  ];
}

function whyLastPrepFailed(q7: unknown): string {
  const ids = normalizeQ7(q7);
  const key = Q7_PRIORITY.find((id) => ids.includes(id));
  if (key && Q7_WHY_FAILED[key]) return Q7_WHY_FAILED[key];
  const named = selectedPrepLabels(ids);
  if (named.length) {
    return `${named.join(" and ")} covered ${EVERYTHING_VS_FEW}.`;
  }
  return `Past prep spread time across ${EVERYTHING_VS_FEW}.`;
}

function improvementRangeLabel(path: ScorePathOutput): string {
  if (path.modeledGain != null && path.gainBand) {
    const { low, high } = path.gainBand;
    if (low !== high) return `${low}–${high} pts`;
    return `~${path.modeledGain} pts`;
  }
  if (path.modeledGain != null) return `~${path.modeledGain} pts`;
  if (path.mode === "process_only" || !path.showGainMath) {
    return `~${SCORE_PATH_DEFAULT_GAIN} pts (example)`;
  }
  return "Confirm on SAT Strategy Call";
}

function weeksLabel(path: ScorePathOutput): string {
  const w = path.chartWeeks;
  const unit = w === 1 ? "week" : "weeks";
  if (path.hasScheduledTestDate && path.testDateLabel) {
    return `${w} ${unit} until ${path.testDateLabel}`;
  }
  if (path.chartWeeksSource === "default_16") {
    return `~${SCORE_PATH_DEFAULT_WEEKS} weeks (typical runway)`;
  }
  return `${w} ${unit}`;
}

function startMetricLabel(path: ScorePathOutput): string {
  if (path.starting.confidence === "known") return String(path.starting.value);
  if (path.starting.bandLabel) return path.starting.bandLabel;
  return path.starting.label;
}

function targetMetricLabel(path: ScorePathOutput): string {
  if (path.target.confidence === "known") return String(path.target.value);
  if (path.target.bandLabel) return path.target.bandLabel;
  return path.target.label;
}

function metricQualifier(
  confidence: "known" | "estimate" | "inferred" | "illustrative" | "missing"
): string | null {
  if (confidence === "known") return null;
  if (confidence === "estimate") return "your estimate";
  if (confidence === "inferred") return "example";
  return null;
}

function buildSubhead(q2?: string): string {
  return stakesSubheadOpener(q2);
}

function parentConcernPhrase(q6: string[] = []): string | null {
  const parts: string[] = [];
  if (q6.includes("math")) parts.push("math");
  if (q6.includes("reading")) parts.push("reading & writing");
  if (!parts.length) return null;
  if (parts.length === 1) return `You said ${parts[0]} is the main problem.`;
  return `You said ${parts[0]} and ${parts[1]} are the main problems.`;
}

export type PlanRevealInputRow = { label: string; value: string };

export type PlanRevealInputGroup = {
  title: string;
  rows: PlanRevealInputRow[];
};

export function buildInputGroups(answers: QuizAnswersLike): PlanRevealInputGroup[] {
  const {
    q2 = "selective",
    q3 = "sat-1",
    q4 = "1200-1300",
    q5 = "oct3",
    q6 = [],
    q7 = [],
    q8 = "1450",
    q9 = "3.8-4.0",
  } = answers;

  const tried = normalizeQ7(q7)
    .map((id) => Q7_PREP_LABELS[id] || id)
    .filter(Boolean);

  const student: PlanRevealInputRow[] = [];
  if (q4 === "na") {
    student.push({ label: "Starting point", value: Q4_INPUT_LABEL.na });
  } else {
    student.push({ label: "Current SAT", value: Q4_INPUT_LABEL[q4] || q4 });
  }
  student.push({ label: "Target score", value: Q8_INPUT_LABEL[q8] || q8 });
  student.push({ label: "GPA", value: Q9_INPUT_LABEL[q9] || q9 });
  student.push({ label: "Test history", value: Q3_INPUT_LABEL[q3] || q3 });
  student.push({ label: "Your goal", value: q2Label(q2) });

  const timeline: PlanRevealInputRow[] = [
    { label: "Next test", value: Q5_INPUT_LABEL[q5] || q5 },
  ];
  const weeksUntil = weeksUntilQ5Test(q5);
  if (weeksUntil != null && weeksUntil > 0 && hasScheduledTestDate(q5)) {
    timeline.push({
      label: "Runway",
      value: `${weeksUntil} ${weeksUntil === 1 ? "week" : "weeks"}`,
    });
  }

  const context: PlanRevealInputRow[] = [];
  if (tried.length) {
    context.push({ label: "What they've tried", value: tried.join(" · ") });
  }
  if (q6.includes("math")) {
    context.push({ label: "Main problem", value: "Math" });
  }
  if (q6.includes("reading")) {
    context.push({ label: "Main problem", value: "Reading & writing" });
  }

  const groups: PlanRevealInputGroup[] = [
    { title: "Your student", rows: student },
    { title: "Timeline", rows: timeline },
  ];
  if (context.length) {
    groups.push({ title: "What you've tried", rows: context });
  }
  return groups;
}

function buildHeardSummary(answers: QuizAnswersLike, path: ScorePathOutput): string {
  const q4 = answers.q4 ?? "1200-1300";
  const q5 = answers.q5 ?? "oct3";
  const q6 = answers.q6 ?? [];
  const q8 = answers.q8 ?? "1450";
  const prep = selectedPrepLabels(answers.q7);

  const startPhrase =
    q4 === "na"
      ? "They haven't taken an official SAT yet"
      : hasKnownStartingScore(q4)
        ? `They're around ${Q4_INPUT_LABEL[q4]} today`
        : "You're still pinning down their starting score";

  const targetPhrase = hasTargetScore(q8)
    ? `want ${Q8_INPUT_LABEL[q8]}`
    : path.target.bandLabel
      ? `are aiming for about ${path.target.bandLabel}`
      : "haven't picked a target yet";

  const dateLabel = q5DisplayLabel(q5) ?? Q5_INPUT_LABEL[q5] ?? "a test date TBD";
  const datePhrase =
    q5 === "tbd" || q5 === "2027"
      ? `with ${dateLabel.toLowerCase()}`
      : hasScheduledTestDate(q5)
        ? `testing ${dateLabel}`
        : `with ${dateLabel.toLowerCase()}`;

  let sentence = `${startPhrase}, ${targetPhrase}, ${datePhrase}.`;
  if (prep.length) {
    sentence += ` They've tried ${prep.join(" and ")}.`;
  }
  const concern = parentConcernPhrase(q6);
  if (concern) {
    sentence += ` ${concern}`;
  }
  return sentence;
}

function buildProjectionVerdict(
  answers: QuizAnswersLike,
  path: ScorePathOutput
): string {
  const { plansBuiltCount, avgPointsGained } = satProgramOutcomes;
  const q9 = answers.q9;
  const gpa = q9 ? Q9_INPUT_LABEL[q9] : null;
  const start = startMetricLabel(path);
  const weeks = path.chartWeeks;
  const weekWord = weeks === 1 ? "week" : "weeks";
  const stakesLine = stakesVerdictPrefix(answers.q2);
  const cohortLine = `We've helped ${plansBuiltCount} students through a full plan. On average, their scores went up ${avgPointsGained} points.`;

  const profileParts: string[] = [`starting around ${start}`];
  if (gpa) profileParts.push(`a ${gpa} GPA`);
  const profileLine = `Students like yours (${profileParts.join(", ")})`;

  if (
    path.showGainMath &&
    path.gainBand &&
    path.scoreRange.typical != null &&
    path.hasScheduledTestDate &&
    path.testDateLabel
  ) {
    const { low, high } = path.gainBand;
    const improveText =
      low !== high
        ? `${low}–${high} points`
        : `about ${path.modeledGain} points`;
    return `${stakesLine}${cohortLine} ${profileLine} with ${weeks} ${weekWord} before the ${path.testDateLabel} test, often improve ${improveText}, enough to reach about ${path.scoreRange.typical}, when they work the ${DIAGNOSTIC_SKILL_RANGE} skills from the Skill Diagnostic, not everything on the SAT.`;
  }

  if (path.showGainMath && path.gainBand && path.scoreRange.typical != null) {
    const { low, high } = path.gainBand;
    const improveText =
      low !== high
        ? `${low}–${high} points`
        : `about ${path.modeledGain} points`;
    return `${stakesLine}${cohortLine} ${profileLine} over ${weeks} ${weekWord}, often improve ${improveText}, toward about ${path.scoreRange.typical}, when they work the ${DIAGNOSTIC_SKILL_RANGE} skills from the Skill Diagnostic, not everything on the SAT. Your SAT Strategy Call confirms the numbers.`;
  }

  if (path.mode === "process_only" || !path.showGainMath) {
    return `${stakesLine}${cohortLine} ${profileLine} often improve about ${SCORE_PATH_DEFAULT_GAIN} points over ${SCORE_PATH_DEFAULT_WEEKS} weeks when they work the ${DIAGNOSTIC_SKILL_RANGE} skills from the Skill Diagnostic, not the whole test. Your SAT Strategy Call and Skill Diagnostic make this specific to your student.`;
  }

  return `${stakesLine}${cohortLine} The Skill Diagnostic finds the ${DIAGNOSTIC_SKILL_RANGE} skills holding their score back. Your SAT Strategy Call walks through timeline and targets.`;
}

export type PlanRevealLever = { rank: number; name: string; pts: number };

export type PlanRevealModel = {
  q2?: string;
  achievability: GoalAchievability;
  subhead: string;
  heardSummary: string;
  inputGroups: PlanRevealInputGroup[];
  projectionHeadline: string;
  projectionVerdict: string;
  metrics: {
    start: { value: string; qualifier: string | null };
    target: { value: string; qualifier: string | null };
    gainRange: string;
    weeks: string;
    effort: string;
  };
  topLevers: PlanRevealLever[];
  leversNote: string;
  whyLastTimeFailed: string;
  howThisTimeDifferent: string;
  honestyLines: string[];
  parentVisibility: string[];
  nextSteps: { title: string; detail: string }[];
};

export function buildPlanReveal(answers: QuizAnswersLike): PlanRevealModel {
  const path = buildScorePathOutput(answers);
  const q6 = answers.q6 ?? [];
  const levers = pickTopLevers(q6).map((s, i) => ({
    rank: i + 1,
    name: s.name,
    pts: s.pts,
  }));

  const leversNote =
    path.mode === "process_only" || path.starting.confidence !== "known"
      ? "Example skills from similar students. Your Skill Diagnostic names their exact 5–6."
      : "Example skills from similar students. Your Skill Diagnostic confirms their exact 5–6.";

  return {
    q2: answers.q2,
    achievability: buildGoalAchievability(answers, path),
    subhead: buildSubhead(answers.q2),
    heardSummary: buildHeardSummary(answers, path),
    inputGroups: buildInputGroups(answers),
    projectionHeadline: "Your score projection",
    projectionVerdict: buildProjectionVerdict(answers, path),
    metrics: {
      start: {
        value: startMetricLabel(path),
        qualifier: metricQualifier(path.starting.confidence),
      },
      target: {
        value: targetMetricLabel(path),
        qualifier: metricQualifier(path.target.confidence),
      },
      gainRange: improvementRangeLabel(path),
      weeks: weeksLabel(path),
      effort: "5–7 hrs/week",
    },
    topLevers: levers,
    leversNote,
    whyLastTimeFailed: whyLastPrepFailed(answers.q7),
    howThisTimeDifferent:
      `The Skill Diagnostic finds the ${DIAGNOSTIC_SKILL_RANGE} SAT skills holding their score back. We teach those first, not the whole test.`,
    honestyLines: path.disclaimers,
    parentVisibility: [
      "Weekly update: which skills they worked on, what practice they did, and what's next",
      "Message their tutor between sessions",
      "You'll know if they're on track before test day",
    ],
    nextSteps: [
      {
        title: "Free SAT Strategy Call (15 min)",
        detail:
          "Walk through test date, scores, school list, and timeline, then schedule Week 1 on your Improvement Plan.",
      },
      {
        title: "Week 1 · Skill Diagnostic",
        detail:
          "Part 1 Mon + Part 2 Wed (proctored, 2 hr 14 min total). Finds the 5–6 skills that matter most, separate from the call.",
      },
      {
        title: "Personalized plan review (Fri Week 1)",
        detail:
          "An SAT advisor walks diagnostic results with you and activates their weekly skill order.",
      },
      {
        title: "Activated Improvement Plan",
        detail:
          "Same document, now with exact skills, missed questions, and lessons. Tutor + weekly focus until test day.",
      },
    ],
  };
}
