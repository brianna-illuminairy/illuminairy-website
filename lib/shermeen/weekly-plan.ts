import { PLAN_ROTATION_SKILLS, type PlanSkill } from "@/lib/shermeen/plan-skill-data";

export type PlanSession = {
  n: 1 | 2;
  focus: string;
  homework: string;
};

export type ShermeenPlanWeek = {
  week: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
  section: "rw" | "math" | "review" | "diagnostic";
  skillLabel: string;
  points?: number;
  phase: "diagnostic" | "topic" | "mixed" | "review";
  skillId?: string;
  hasPracticeTest?: boolean;
  sessions?: PlanSession[];
  volume?: string;
  reviewFocus?: string;
};

const PLAN_START = new Date("2026-06-29T12:00:00");
export const SHERMEEN_PHASE_1_WEEKS = 12;

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
  "rw-transitions": [
    {
      n: 1,
      focus: "Five transition types and SAT word groups",
      homework:
        "Sort transition words into the five categories until she can name the relationship before looking at choices (due before Session 2)",
    },
    {
      n: 2,
      focus: "Paraphrase each sentence, then pick the relationship-first transition",
      homework:
        "Timed transition set from diagnostic-style items; write the relationship for each miss (due before next week)",
    },
  ],
  "math-factoring": [
    {
      n: 1,
      focus: "Factor common patterns and zero-product rule",
      homework:
        "Factoring + zero-product problem set from diagnostic misses (due before Session 2)",
    },
    {
      n: 2,
      focus: "Factor theorem and when Desmos confirms roots",
      homework:
        "Mixed factoring set; note question type and method on each item (due before next week)",
    },
  ],
  "rw-coe": [
    {
      n: 1,
      focus: "Underline the claim, then find the line that proves it",
      homework:
        "Command of evidence set: claim first, then match evidence (due before Session 2)",
    },
    {
      n: 2,
      focus: "Reject choices that are true but do not prove the exact claim",
      homework:
        "Mixed evidence practice from Module 1 and Module 2 misses (due before next week)",
    },
  ],
  "math-circles": [
    {
      n: 1,
      focus: "Radians to degrees and arc length as a fraction of circumference",
      homework: "Radians + arc length problem set (due before Session 2)",
    },
    {
      n: 2,
      focus: "Tangency to both axes and reading which angle the question wants",
      homework:
        "Circle setup set including grid-in items; label the asked angle (due before next week)",
    },
  ],
  "rw-form": [
    {
      n: 1,
      focus: "Subject-verb agreement and pronoun clarity",
      homework: "Form/structure set on agreement and pronoun traps (due before Session 2)",
    },
    {
      n: 2,
      focus: "Verb tense and sentence sense after the blank",
      homework:
        "Mixed form items from diagnostic misses; read the full sentence before choosing (due before next week)",
    },
  ],
  "math-linear": [
    {
      n: 1,
      focus: "Slope, intercepts, and what the word problem is asking for",
      homework: "Linear function word-problem set (due before Session 2)",
    },
    {
      n: 2,
      focus: "Build the equation, then check x, y, or a combined value",
      homework:
        "Linear set with finish-the-question checks before submit (due before next week)",
    },
  ],
  "rw-boundaries": [
    {
      n: 1,
      focus: "Independent vs dependent clauses",
      homework: "Clause-labeling set on boundary questions (due before Session 2)",
    },
    {
      n: 2,
      focus: "Comma, semicolon, and run-on rules",
      homework: "Boundary punctuation practice set (due before next week)",
    },
  ],
  "math-grid-in": [
    {
      n: 1,
      focus: "Read the full question before calculating",
      homework:
        "Grid-in set: write what the question asks for before solving (due before Session 2)",
    },
    {
      n: 2,
      focus: "Set up in Desmos when needed, then enter the exact form requested",
      homework:
        "Mixed grid-in + multiple choice set with setup notes (due before next week)",
    },
  ],
  "rw-rhetorical": [
    {
      n: 1,
      focus: "Read the goal before the notes",
      homework: "Goal-first rhetorical synthesis set (due before Session 2)",
    },
    {
      n: 2,
      focus: "Eliminate answers that miss the assigned job",
      homework: "Timed rhetorical synthesis practice (due before next week)",
    },
  ],
};

const DIAGNOSTIC_REVIEW_SESSIONS: PlanSession[] = [
  {
    n: 1,
    focus:
      "We review each math question she got wrong on the June 23 diagnostic. For each question, we name the question type, walk the method, and note whether Desmos can finish it once the problem is set up.",
    homework:
      "Before Session 2, she completes a math homework set. For each miss, she writes the question type, the method, and whether the calculator can finish it once set up.",
  },
  {
    n: 2,
    focus:
      "We review each Reading and Writing question she got wrong on the June 23 diagnostic. For each question, we name the question type and the method for answering it.",
    homework:
      "Before Week 2 begins, she completes a Reading and Writing homework set. For each miss, she writes the question type and the method for answering it.",
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

export function buildShermeenWeeklyPlan(): ShermeenPlanWeek[] {
  const rw = PLAN_ROTATION_SKILLS.filter((s) => s.id.startsWith("rw-"));
  const math = PLAN_ROTATION_SKILLS.filter((s) => s.id.startsWith("math-"));
  const skills = interleaveSkills(rw, math);
  const weeks: ShermeenPlanWeek[] = [];

  const w1 = weekRange(1);
  weeks.push({
    week: 1,
    startDate: w1.start,
    endDate: w1.end,
    dateLabel: w1.label,
    section: "diagnostic",
    skillLabel: "Go back through the June 23 diagnostic",
    phase: "diagnostic",
    sessions: DIAGNOSTIC_REVIEW_SESSIONS,
    reviewFocus:
      "Both sessions this week review the questions she got wrong on the June 23 diagnostic. The first session covers math: question type, method, and whether the calculator can finish it once set up. The second session covers Reading and Writing: question type and how to answer it.",
  });

  for (let i = 0; i < skills.length; i++) {
    const week = i + 2;
    const topicIndex = i + 1;
    const skill = skills[i]!;
    const range = weekRange(week);
    const isRw = skill.id.startsWith("rw-");
    const hasPracticeTest = topicIndex % 4 === 0;
    weeks.push({
      week,
      startDate: range.start,
      endDate: range.end,
      dateLabel: range.label,
      section: isRw ? "rw" : "math",
      skillLabel: skill.topic,
      skillId: skill.id,
      points: skill.points,
      phase: "topic",
      hasPracticeTest,
      sessions: SESSIONS[skill.id],
      volume: hasPracticeTest
        ? `~110 questions on ${skill.topic.split("(")[0]?.trim()}, plus full-length practice test (2 hr 14 min) after Session 2 homework.`
        : `~110 questions on ${skill.topic.split("(")[0]?.trim()} across homework sets.`,
    });
  }

  const w11 = weekRange(11);
  weeks.push({
    week: 11,
    startDate: w11.start,
    endDate: w11.end,
    dateLabel: w11.label,
    section: "review",
    skillLabel: "Full-length timed practice test",
    phase: "mixed",
    hasPracticeTest: true,
    reviewFocus:
      "Full-length timed practice test under test conditions before we close Phase 1. We note timing, calculator use, and which question types still break under pressure.",
    volume:
      "No new skill block this week. She takes the full-length test timed like test day after Week 10 homework.",
  });

  const w12 = weekRange(12);
  weeks.push({
    week: 12,
    startDate: w12.start,
    endDate: w12.end,
    dateLabel: w12.label,
    section: "review",
    skillLabel: "Review missed questions",
    phase: "review",
    reviewFocus:
      "Go through every miss from the week 11 practice test and from earlier practice tests. Rework question types until she uses the same method every time. We adjust Phase 2 priorities from what this week shows.",
    volume:
      "Homework is targeted practice sets from those misses. Phase 1 ends when she can run the methods from Weeks 1–11 on fresh items.",
  });

  return weeks;
}

export const SHERMEEN_WEEKLY_PLAN = buildShermeenWeeklyPlan();

export function currentPlanWeek(today = new Date()): number | null {
  const iso = today.toISOString().slice(0, 10);
  const hit = SHERMEEN_WEEKLY_PLAN.find((w) => iso >= w.startDate && iso <= w.endDate);
  return hit?.week ?? null;
}
