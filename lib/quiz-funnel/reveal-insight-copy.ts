/**
 * Reveal specifics — one sentence under the achievability gauge:
 * a GPA-agnostic capability statement (weekly pace) that bridges into the GPA
 * question (q9), which now follows the reveal screen.
 *
 * No echoing Q6 back. No last-test claims. No diagnostic/plan pitch. No em dashes.
 */

import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";
import { satFirstMonthOutcomes } from "@/lib/site";
import { normalizeQ7, Q7_PREP_PRIORITY, selectedPrepLabels, formatEnglishList } from "@/lib/quiz-funnel/prep-copy";

export type Q6BlockerId =
  | "math"
  | "reading"
  | "self-study"
  | "no-plan"
  | "wont"
  | "too-busy";

export type RevealAchievabilityContext = {
  /** gap ÷ weeks, rounded */
  ptsPerWeek?: number;
  tier?: string;
};

export const Q6_BLOCKER_ORDER: Q6BlockerId[] = [
  "math",
  "reading",
  "self-study",
  "no-plan",
  "wont",
  "too-busy",
];

/** Short timing fix — embeds in “once they fix …”. */
const Q6_TIMING_FIX: Record<"math" | "reading" | "both" | "behavioral" | "generic", string> = {
  math: "calculator pacing on test day",
  reading: "question-first reading on test day",
  both: "calculator pacing and question-first reading",
  behavioral: "where they spend time on test day",
  generic: "pacing on test day",
};

/** Short content fix — embeds in “once they fix …”. */
const Q6_CONTENT_FIX: Record<Q6BlockerId | "generic", string> = {
  math: "Advanced Algebra and Data Analysis set-ups",
  reading: "grammar in context and transitions",
  "self-study": "the question types they keep rehearsing the easy way",
  "no-plan": "the same recurring question types",
  wont: "sticking with hard question types week to week",
  "too-busy": "the slow skills that need reps, not easy fill-in topics",
  generic: "the handful of question types that repeat on every test",
};

const Q7_ROOT_CAUSE_BRIDGE: Record<string, string> = {
  khan: "Broad video and question banks often never isolate which question types to fix first.",
  group: "Group class moves at one pace, not the lesson types where points usually slip.",
  online: "Online courses often use one sequence for everyone, not a student's actual miss pattern.",
  app: "SAT apps often serve questions without naming which types to fix first.",
  book: "Books cover the whole test without showing where wrong answers cluster.",
  nothing: "Without focused practice, there is often no list of which types to work first.",
};

export function selectedQ6Blockers(q6: unknown): Q6BlockerId[] {
  const ids = Array.isArray(q6) ? q6.filter(Boolean) : [];
  return Q6_BLOCKER_ORDER.filter((id) => ids.includes(id));
}

function timingFixKey(ids: Q6BlockerId[]): keyof typeof Q6_TIMING_FIX {
  const hasMath = ids.includes("math");
  const hasReading = ids.includes("reading");
  if (hasMath && hasReading) return "both";
  if (hasMath) return "math";
  if (hasReading) return "reading";
  if (ids.some((id) => id !== "math" && id !== "reading")) return "behavioral";
  return "generic";
}

export function buildTimingFixPhrase(q6: unknown): string {
  const ids = selectedQ6Blockers(q6);
  return Q6_TIMING_FIX[timingFixKey(ids)];
}

export function buildContentFixPhrase(q6: unknown): string {
  const ids = selectedQ6Blockers(q6);
  if (!ids.length) return Q6_CONTENT_FIX.generic;

  const subjects = ids.filter((id) => id === "math" || id === "reading");
  const behavioral = ids.filter((id) => id !== "math" && id !== "reading");

  if (subjects.length === 2) {
    return "Advanced Algebra and Data Analysis set-ups on Math, plus grammar and transitions on Reading & writing";
  }
  if (subjects.length === 1) {
    return Q6_CONTENT_FIX[subjects[0]];
  }
  if (behavioral.length === 1) {
    return Q6_CONTENT_FIX[behavioral[0]];
  }

  return Q6_CONTENT_FIX[behavioral[0]];
}

function buildCapabilityOpener(ptsPerWeek?: number): string {
  const pace =
    ptsPerWeek != null && ptsPerWeek > 0
      ? `${ptsPerWeek} pts per week`
      : "the steady weekly movement they need";
  return `Students with high GPAs are smart and capable of ${pace}.`;
}

/** Second reveal sentence — first-month outcome stat only. */
export function buildFirstMonthMovementSentence(): string {
  const firstMonthPts = satFirstMonthOutcomes.minPointsFirstMonth;
  return `Similar students usually see ${firstMonthPts}+ points in the first month.`;
}

/** @deprecated Tests — fix + outcome sentence (timing/content detail). */
export function buildAchievabilityFixSentence(q6: unknown, _tier?: string): string {
  const timing = buildTimingFixPhrase(q6);
  const content = buildContentFixPhrase(q6);
  const firstMonthPts = satFirstMonthOutcomes.minPointsFirstMonth;

  return `Similar students usually see ${firstMonthPts}+ points in the first month once they fix ${timing} and ${content}.`;
}

/** @deprecated Tests — fix + outcome sentence only. */
export function buildQ6SolutionBlock(q6: unknown, tier?: string): string {
  return buildAchievabilityFixSentence(q6, tier);
}

export function buildPrepStruggleLead(q7: unknown, _q6: unknown = []): string | null {
  const ids = normalizeQ7(q7);
  if (!ids.length) return null;

  const primary = Q7_PREP_PRIORITY.find((id) => ids.includes(id));
  if (primary && Q7_ROOT_CAUSE_BRIDGE[primary]) {
    return Q7_ROOT_CAUSE_BRIDGE[primary];
  }

  const named = selectedPrepLabels(q7);
  if (named.length === 1) {
    return `${named[0]} often never isolated which question types to fix first.`;
  }
  if (named.length > 1) {
    return `${formatEnglishList(named)} often never isolated which question types to fix first.`;
  }

  return Q7_ROOT_CAUSE_BRIDGE.nothing;
}

export function buildRevealInsightParagraph(
  _answers: QuizAnswersLike,
  context: RevealAchievabilityContext = {}
): string {
  // Shown before the GPA question — a general capability statement that bridges
  // into q9, so it stays GPA-agnostic and carries the weekly pace only.
  return buildCapabilityOpener(context.ptsPerWeek).replace(/\s+/g, " ").trim();
}

export function countInsightSentences(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim()).length;
}

/** @deprecated tests */
export const Q6_COMMON_TRAPS = Q6_CONTENT_FIX;

/** @deprecated tests */
export const Q6_ROOT_CAUSE = Q6_CONTENT_FIX;

/** @deprecated tests */
export const Q6_ROOT_CLAUSE = Q6_CONTENT_FIX;

export const Q6_SOLUTION_COPY = Object.fromEntries(
  Q6_BLOCKER_ORDER.map((id) => [
    id,
    { label: id, problem: Q6_CONTENT_FIX[id], diagnostic: "", plan: "" },
  ])
) as Record<
  Q6BlockerId,
  { label: string; problem: string; diagnostic: string; plan: string }
>;
