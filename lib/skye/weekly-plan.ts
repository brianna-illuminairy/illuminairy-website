import { MATH_SKILLS, RW_SKILLS, type PlanSkill } from "@/lib/skye/plan-skill-data";

export type PlanSession = {
  n: 1 | 2;
  focus: string;
  homework: string;
};

export type SkyePlanWeek = {
  week: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
  section: "rw" | "math" | "review" | "diagnostic";
  skillLabel: string;
  points?: number;
  phase: "diagnostic" | "topic" | "review";
  hasPracticeTest?: boolean;
  sessions?: PlanSession[];
  volume?: string;
  reviewFocus?: string;
};

const PLAN_START = new Date("2026-06-23T12:00:00");

function weekRange(weekIndex: number): { start: string; end: string; label: string } {
  const start = new Date(PLAN_START);
  start.setDate(start.getDate() + (weekIndex - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    label: `${fmt(start)} – ${fmt(end)}`,
  };
}

const SESSIONS: Record<string, PlanSession[]> = {
  "rw-reading-logic": [
    { n: 1, focus: "Main idea and detail questions", homework: "Problem set: name the question job, then answer main idea and detail items (due before Session 2)" },
    { n: 2, focus: "Function, structure, and command of evidence", homework: "Problem set: function/structure/evidence drills from diagnostic misses (due before next week)" },
  ],
  "math-nonlinear": [
    { n: 1, focus: "Factoring and quadratic formula", homework: "Problem set on factoring + quadratic formula (due before Session 2)" },
    { n: 2, focus: "Radicals and discriminant", homework: "Problem set on radicals + discriminant (due before next week)" },
  ],
  "rw-transitions": [
    { n: 1, focus: "Learn the five transition types and SAT word groups", homework: "Sort transition words into the five categories until automatic (due before Session 2)" },
    { n: 2, focus: "Relationship-first drill on transition questions", homework: "Timed transition practice set from diagnostic-style items (due before next week)" },
  ],
  "math-slope": [
    { n: 1, focus: "Slope from two points and intercept reading", homework: "Slope + intercept problem set (due before Session 2)" },
    { n: 2, focus: "Build line equations and read exactly what is asked", homework: "Line-equation set emphasizing h + k and full question read (due before next week)" },
  ],
  "rw-words": [
    { n: 1, focus: "Tone and prediction before choices", homework: "Words-in-context set: cover choices, predict tone/meaning first (due before Session 2)" },
    { n: 2, focus: "Grammar fit after meaning (including academic word senses)", homework: "Mixed words-in-context set with grammar checks (due before next week)" },
  ],
  "math-systems": [
    { n: 1, focus: "Systems: crossings and number of solutions", homework: "Graph-and-count systems set in Desmos (due before Session 2)" },
    { n: 2, focus: "Perpendicular slope (negative reciprocal)", homework: "Perpendicular lines + systems mixed set (due before next week)" },
  ],
  "rw-boundaries": [
    { n: 1, focus: "Independent vs dependent clauses", homework: "Clause-labeling set on boundary questions (due before Session 2)" },
    { n: 2, focus: "Comma, semicolon, and run-on rules", homework: "Boundary punctuation drill set (due before next week)" },
  ],
  "math-circle": [
    { n: 1, focus: "Radians to degrees", homework: "Radians conversion set (due before Session 2)" },
    { n: 2, focus: "Arc length and reading for the asked angle", homework: "Arc length set; label which angle the question wants (due before next week)" },
  ],
  "rw-rhetorical": [
    { n: 1, focus: "Read the goal before the notes", homework: "Goal-first rhetorical synthesis set (due before Session 2)" },
    { n: 2, focus: "Eliminate answers that miss the assigned job", homework: "Timed rhetorical synthesis practice (due before next week)" },
  ],
  "math-exponential": [
    { n: 1, focus: "Build a · b^x from words (growth)", homework: "Exponential growth setup set (due before Session 2)" },
    { n: 2, focus: "Decay form and testing at x = 0 and x = 1", homework: "Exponential decay comparison set (due before next week)" },
  ],
  "rw-modifiers": [
    { n: 1, focus: "Modifier placement and attachment", homework: "Modifier placement problem set (due before Session 2)" },
    { n: 2, focus: "Mixed modifier review from diagnostic style", homework: "Short modifier consolidation set (due before next week)" },
  ],
  "math-transforms": [
    { n: 1, focus: "What h(x + k) does to a graph", homework: "Transformation identification set (due before Session 2)" },
    { n: 2, focus: "Read intercepts after a shift", homework: "Shifted-function graphing set in Desmos (due before next week)" },
  ],
  "math-manipulation": [
    { n: 1, focus: "Divide every term and isolate variables", homework: "Equation rearrangement set (due before Session 2)" },
    { n: 2, focus: "Check with substitution", homework: "Mixed manipulation + check set (due before next week)" },
  ],
};

const DIAGNOSTIC_REVIEW_SESSIONS: PlanSession[] = [
  {
    n: 1,
    focus:
      "Reading & Writing misses: walk the diagnostic question map and tabular report. For each RW miss, name the question type (reading logic, transitions, words in context, boundaries, rhetorical synthesis, modifiers) and state what the question is asking before any answer choice.",
    homework:
      "RW miss worksheet: all 19 RW misses labeled by type plus one sentence per question on what it wants (due before Session 2). Use the Diagnostic Analysis tab and tabular PDF.",
  },
  {
    n: 2,
    focus:
      "Math misses: same method on all 15 math misses. Label the problem type (nonlinear/quadratic, slope, systems, circle measures, exponential, transformations, equation manipulation) and identify what is given, what is asked, and where she hesitated on approach.",
    homework:
      "Math miss worksheet: type label + what is it asking for every math miss (due before Week 2 skill work). Flag any question where the type was unclear on first read.",
  },
];

function interleaveSkills(rw: PlanSkill[], math: PlanSkill[]): PlanSkill[] {
  const out: PlanSkill[] = [];
  let ri = 0;
  let mi = 0;
  while (ri < rw.length || mi < math.length) {
    if (ri < rw.length) {
      out.push(rw[ri]!);
      ri++;
    }
    if (mi < math.length) {
      out.push(math[mi]!);
      mi++;
    }
  }
  return out;
}

export function buildSkyeWeeklyPlan(): SkyePlanWeek[] {
  const skills = interleaveSkills(RW_SKILLS, MATH_SKILLS);
  const weeks: SkyePlanWeek[] = [];

  const w1 = weekRange(1);
  weeks.push({
    week: 1,
    startDate: w1.start,
    endDate: w1.end,
    dateLabel: w1.label,
    section: "diagnostic",
    skillLabel: "Diagnostic review: question types",
    phase: "diagnostic",
    sessions: DIAGNOSTIC_REVIEW_SESSIONS,
    reviewFocus:
      "Before skill drills, map every June 18 miss to its SAT question type and practice reading what each item is asking for. Session 1 is Reading & Writing; Session 2 is Math.",
    volume:
      "No new topic drills this week. Use the portal Diagnostic Analysis tab, miss tables, and marked PDFs as the source.",
  });

  for (let i = 0; i < skills.length; i++) {
    const week = i + 2;
    const topicIndex = i + 1;
    const skill = skills[i]!;
    const range = weekRange(week);
    const isRw = skill.id.startsWith("rw-");
    const hasPracticeTest = topicIndex % 4 === 0 && topicIndex <= 12;
    weeks.push({
      week,
      startDate: range.start,
      endDate: range.end,
      dateLabel: range.label,
      section: isRw ? "rw" : "math",
      skillLabel: skill.topic,
      points: skill.points,
      phase: "topic",
      hasPracticeTest,
      sessions: SESSIONS[skill.id],
      volume: hasPracticeTest
        ? `~110 questions on ${skill.topic.split("(")[0]?.trim()}, plus full-length practice test (2 hr 14 min) after Session 2 homework.`
        : `~110 questions on ${skill.topic.split("(")[0]?.trim()} across homework sets.`,
    });
  }

  const w15 = weekRange(15);
  weeks.push({
    week: 15,
    startDate: w15.start,
    endDate: w15.end,
    dateLabel: w15.label,
    section: "review",
    skillLabel: "Practice problems + mistake review",
    phase: "review",
    reviewFocus:
      "Mixed practice on the top skills from the diagnostic and prior practice tests. Re-work missed question types until the method is automatic.",
    volume: "Targeted problem sets from diagnostic misses and practice test errors.",
  });

  const w16 = weekRange(16);
  weeks.push({
    week: 16,
    startDate: w16.start,
    endDate: w16.end,
    dateLabel: w16.label,
    section: "review",
    skillLabel: "Practice problems + mistake review",
    phase: "review",
    reviewFocus:
      "Light mixed review before October 3. Focus on timing, adaptive Module 1 targets, and one pass per question.",
    volume: "Short review sets only. Test day: October 3, 2026 SAT.",
  });

  return weeks;
}

export const SKYE_WEEKLY_PLAN = buildSkyeWeeklyPlan();
export const SKYE_TARGET_TEST = { label: "October 3, 2026 SAT", date: "2026-10-03" };

export function currentPlanWeek(today = new Date()): number | null {
  const iso = today.toISOString().slice(0, 10);
  const hit = SKYE_WEEKLY_PLAN.find((w) => iso >= w.startDate && iso <= w.endDate);
  return hit?.week ?? null;
}
