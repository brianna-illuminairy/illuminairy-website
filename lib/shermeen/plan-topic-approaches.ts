/** How we teach each plan topic — a few bullets per week, no diagnostic miss detail. */

import type { ShermeenPlanWeek } from "@/lib/shermeen/weekly-plan";

export type PlanTopicApproach = {
  bullets: string[];
};

export const PLAN_TOPIC_APPROACHES: Record<string, PlanTopicApproach> = {
  "week-1-diagnostic": {
    bullets: [
      "Go question by question through every miss on the June 23 diagnostic.",
      "Session 1 (math): name the question type, walk the method, note if Desmos can finish it once set up.",
      "Session 2 (Reading and Writing): name the question type and how to answer it.",
      "Homework between sessions on the misses from that session.",
    ],
  },
  "rw-transitions": {
    bullets: [
      "Paraphrase each sentence before looking at choices.",
      "Name the relationship first: addition, contrast, cause-effect, example, or emphasis.",
      "Pick a transition word from that category only. Never start from the answer choices.",
      "When she has the word groups memorized, she can name the relationship before looking at choices and start the question faster.",
    ],
  },
  "math-factoring": {
    bullets: [
      "Know common factor patterns and when zero-product applies.",
      "Set the equation equal to zero before factoring.",
      "Graph in Desmos to confirm roots when the algebra is messy.",
      "Before submitting, check whether the question wants a root, a sum of roots, or an expression.",
    ],
  },
  "rw-coe": {
    bullets: [
      "Underline the claim in the question stem first.",
      "The correct line must prove that exact claim, not a related idea.",
      "Reject choices that are true in the passage but do not support the claim.",
      "Evidence questions pair with main idea and inference work from the diagnostic review.",
    ],
  },
  "math-circles": {
    bullets: [
      "Convert radians: degrees = radians × 180 / π.",
      "Arc length = (central angle ÷ 360) × circumference.",
      "Name which angle the question is asking for (often not the obvious one).",
      "Tangency to both axes tells you about radius and center coordinates.",
    ],
  },
  "rw-form": {
    bullets: [
      "Read the full sentence before choosing. The blank must fit grammar and meaning.",
      "Check subject-verb agreement and pronoun reference.",
      "Verb tense must match the rest of the paragraph.",
      "Method first on every form question type until she has the steps memorized.",
    ],
  },
  "math-linear": {
    bullets: [
      "Translate the word problem into slope, intercept, or a line equation.",
      "Before stopping, check what they want: slope, intercept, a coordinate, or a combined value.",
      "Graph the line in Desmos when the setup is unclear.",
      "Finish reading the question before entering a grid-in answer.",
    ],
  },
  "rw-boundaries": {
    bullets: [
      "Label each side of the punctuation: full sentence or not.",
      "Two full sentences need a period, semicolon, or comma plus FANBOYS.",
      "A semicolon only joins two complete sentences.",
      "A phrase interrupting the sentence needs a comma on both sides.",
    ],
  },
  "math-grid-in": {
    bullets: [
      "Read the full question before calculating.",
      "Set up in Desmos when the algebra is long; enter the exact form the grid expects.",
      "Check units and whether the answer is a decimal, fraction, or integer.",
      "Same finish-the-question habit on multiple choice and grid-in items.",
    ],
  },
  "rw-rhetorical": {
    bullets: [
      "Read the goal before the notes. Underline the key verb (compare, emphasize, introduce, support).",
      "Eliminate choices that are true but do not do what the goal asks.",
      "Scan notes only for bullets that match the goal.",
      "Use the notes to confirm your pick or break a tie between two choices.",
    ],
  },
  "week-11-practice-test": {
    bullets: [
      "Full-length timed practice test under test conditions (2 hr 14 min).",
      "No new skill block this week. She takes the test after finishing Week 10 homework.",
      "We note timing, calculator use, and which question types still break under pressure.",
      "Week 12 we review those misses and map her next-step SAT plan.",
    ],
  },
  "week-12-review": {
    bullets: [
      "Review every miss from the week 11 practice test, question by question.",
      "Build a new plan for what to focus on next (timeline, tests, and skills).",
      "Walk through that plan together so everyone knows what comes after Phase 1.",
      "Homework targets misses from the week 11 test only.",
    ],
  },
};

export function approachForWeek(week: ShermeenPlanWeek): string[] | null {
  let key: string | null = null;
  if (week.phase === "diagnostic") key = "week-1-diagnostic";
  else if (week.phase === "mixed") key = "week-11-practice-test";
  else if (week.phase === "review") key = "week-12-review";
  else if (week.skillId) key = week.skillId;

  if (!key) return null;
  return PLAN_TOPIC_APPROACHES[key]?.bullets ?? null;
}
