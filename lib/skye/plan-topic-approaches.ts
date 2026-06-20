/** How we teach each plan topic — a few bullets per week, no diagnostic miss detail. */

import type { SkyePlanWeek } from "@/lib/skye/weekly-plan";

export type PlanTopicApproach = {
  bullets: string[];
};

export const PLAN_TOPIC_APPROACHES: Record<string, PlanTopicApproach> = {
  "week-1-diagnostic": {
    bullets: [
      "Go question by question through every miss on the June 18 diagnostic.",
      "Session 1 (math): name the question type, walk the method, note if Desmos can finish it once set up.",
      "Session 2 (Reading and Writing): name the question type and how to answer it.",
      "Homework between sessions on the misses from that session.",
    ],
  },
  "rw-reading-logic": {
    bullets: [
      "Read the question stem first and name the job: main idea, detail, function, structure, or evidence.",
      "Answer that job only. Reject choices that sound like the passage but do a different job.",
      "Main idea must cover the whole passage, not one detail or example.",
      "Evidence questions must match the exact claim in the question, not a related idea.",
    ],
  },
  "math-nonlinear": {
    bullets: [
      "Know when to factor and when to use the quadratic formula.",
      "Discriminant b² − 4ac: zero = one solution, positive = two, negative = none.",
      "Graph the equation in Desmos once it is set up; read x- and y-values from the graph.",
      "Before submitting, check whether the question wants x, y, or a combined value.",
    ],
  },
  "rw-transitions": {
    bullets: [
      "Read the full passage and paraphrase each sentence before looking at choices.",
      "Name the relationship first: addition, contrast, cause-effect, example, or emphasis.",
      "Pick a transition word from that category only. Never start from the answer choices.",
      "If two choices are the same type (two contrast words), both are wrong.",
    ],
  },
  "math-slope": {
    bullets: [
      "Drill slope from two points: m = (y₂ − y₁) / (x₂ − x₁).",
      "Turn slope and a point into a line equation when the question asks for it.",
      "Before stopping, check what they want: slope, intercept, full equation, or a value like h + k.",
      "Graph the line in Desmos to confirm intercepts when the setup is unclear.",
    ],
  },
  "rw-words": {
    bullets: [
      "Read both sentences. The clue is often in the sentence that does not have the blank.",
      "Cover the choices, decide tone (positive, negative, neutral), predict a plain-English word.",
      "Check grammar: after \"to\" the blank needs a plain verb, not a prepositional phrase.",
      "Method first. Vocabulary study stays on a short list of words that show up often on the SAT.",
    ],
  },
  "math-systems": {
    bullets: [
      "Type both equations in Desmos exactly as written. Click where the graphs cross.",
      "Read what the question asks for: x, y, x + y, or a constant like k.",
      "Parallel lines = no solutions. Same line twice = infinite solutions.",
      "For perpendicular lines, use the negative reciprocal of the known slope.",
    ],
  },
  "rw-boundaries": {
    bullets: [
      "Label each side of the punctuation: full sentence or not.",
      "Two full sentences need a period, semicolon, or comma plus FANBOYS (for, and, nor, but, or, yet, so).",
      "A semicolon only joins two complete sentences. A comma alone between two full sentences is wrong.",
      "A phrase interrupting the sentence needs a comma on both sides.",
    ],
  },
  "math-circle": {
    bullets: [
      "Convert radians: degrees = radians × 180 / π.",
      "Arc length = (central angle ÷ 360) × circumference.",
      "Name which angle the question is asking for (often not the obvious one).",
      "Area and circumference formulas are on the reference sheet; radians and arc length are not.",
    ],
  },
  "rw-rhetorical": {
    bullets: [
      "Read the goal before the notes. Underline the key verb (compare, emphasize, introduce, support).",
      "Eliminate choices that are true but do not do what the goal asks.",
      "Scan notes only for bullets that match the goal. You rarely need all of them.",
      "Use the notes to confirm your pick or break a tie between two choices.",
    ],
  },
  "math-exponential": {
    bullets: [
      "Build f(x) = a · b^x from the word problem.",
      "\"Doubles every n days\" or percent decrease sets the b factor.",
      "Check x = 0 for starting value a and x = 1 to confirm the growth or decay rate.",
      "Graph in Desmos when the setup is hard to visualize.",
    ],
  },
  "rw-modifiers": {
    bullets: [
      "Find the opening phrase before the comma. Ask who or what does that action.",
      "The noun right after the comma must be the one the phrase describes.",
      "Watch possessive traps (\"Jose's brain\" is not the person doing the action).",
      "A phrase interrupting the sentence needs commas on both sides.",
    ],
  },
  "math-transforms": {
    bullets: [
      "Learn what each shift notation does (for example, h(x + k) moves the graph left or right).",
      "Graph the original and transformed function in Desmos.",
      "Read new intercepts or crossing points from the graph instead of guessing.",
      "Check whether the question wants a coordinate, a value, or a description of the shift.",
    ],
  },
  "math-manipulation": {
    bullets: [
      "When dividing or multiplying, apply the operation to every term on both sides.",
      "Isolate the variable step by step without skipping terms.",
      "Plug the result back into the original equation to confirm.",
      "Read whether the question wants the variable itself or an expression built from it.",
    ],
  },
  "week-15-review": {
    bullets: [
      "Mixed practice on the skills from Weeks 2–14.",
      "Pull in mistakes from the diagnostic and from practice tests on weeks 5, 9, and 13.",
      "Rework missed question types until she uses the same method every time.",
      "No new topics this week. Focus on speed and consistency.",
    ],
  },
};

export function approachForWeek(week: SkyePlanWeek): string[] | null {
  let key: string | null = null;
  if (week.phase === "diagnostic") key = "week-1-diagnostic";
  else if (week.phase === "review") key = "week-15-review";
  else if (week.skillId) key = week.skillId;

  if (!key) return null;
  return PLAN_TOPIC_APPROACHES[key]?.bullets ?? null;
}
