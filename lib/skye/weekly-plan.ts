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
      "We review each math question she got incorrect on the June 18 diagnostic. For each question, we go over the question type, the method for solving it, and whether it can or cannot be solved with the calculator.",
    homework:
      "Before Session 2, she completes a math homework set. For each question she missed, she writes the question type, the method for solving it, and whether the calculator can finish it once the problem is set up.",
  },
  {
    n: 2,
    focus:
      "We review each Reading and Writing question she got incorrect on the June 18 diagnostic. For each question, we go over the question type and the method for answering it.",
    homework:
      "Before Week 2 begins, she completes a Reading and Writing homework set. For each question she missed, she writes the question type and the method for answering it.",
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
    skillLabel: "Go back through the June 18 diagnostic",
    phase: "diagnostic",
    sessions: DIAGNOSTIC_REVIEW_SESSIONS,
    reviewFocus:
      "Both sessions this week review the questions she got wrong on the June 18 diagnostic. The first session covers math. For each missed math question, we go over the question type, how to solve it, and whether the calculator can finish it once the problem is set up. The second session covers Reading and Writing. For each missed question there, we go over the question type and how to answer it.",
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
      "This week is mixed practice on the skills from the diagnostic and from her earlier practice tests. She keeps working questions she missed until she can do them the same way every time.",
    volume:
      "Homework is targeted practice sets built from diagnostic misses and mistakes on practice tests.",
  });

  return weeks;
}

export const SKYE_WEEKLY_PLAN = buildSkyeWeeklyPlan();

export function currentPlanWeek(today = new Date()): number | null {
  const iso = today.toISOString().slice(0, 10);
  const hit = SKYE_WEEKLY_PLAN.find((w) => iso >= w.startDate && iso <= w.endDate);
  return hit?.week ?? null;
}
