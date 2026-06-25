import type { DiagnosticMissRow } from "@/lib/diagnostic/skill-point-model";
import {
  MATH_MISS_TABLE,
  RW_MISS_TABLE,
  SHERMEEN_HERO,
} from "@/lib/shermeen/diagnostic-report-data";
import {
  SHERMEEN_MATH_SKILL_MODEL,
  SHERMEEN_RW_SKILL_MODEL,
} from "@/lib/shermeen/diagnostic-skill-points";

export type PlanSkill = {
  id: string;
  topic: string;
  points: number;
  misses: { m1: number; m2: number; total: number };
};

const RW_TOPIC_IDS: Record<string, string> = {
  Transitions: "rw-transitions",
  "Command of Evidence": "rw-coe",
  "Form, Structure, and Sense": "rw-form",
  Boundaries: "rw-boundaries",
  "Rhetorical Synthesis": "rw-rhetorical",
  Inferences: "rw-inferences",
  "Text Structure and Purpose": "rw-text-structure",
  "Central Ideas and Details": "rw-central-ideas",
  "Words in Context": "rw-words",
};

function mathTopicForMiss(row: DiagnosticMissRow): string {
  const key = `${row.mod}-${row.q}`;
  if (new Set(["1-9", "2-2", "2-9", "2-20"]).has(key)) {
    return "Factoring, zero-product, and factor theorem";
  }
  if (new Set(["1-13", "1-21", "2-10"]).has(key)) {
    return "Circles, arc length, and tangency";
  }
  if (new Set(["1-14", "2-4"]).has(key)) {
    return "Linear functions and word problems";
  }
  if (new Set(["2-8", "2-14"]).has(key)) {
    return "Finish-the-question and grid-in habits";
  }
  return row.topic;
}

function countMisses(
  rows: DiagnosticMissRow[],
  matchTopic: (row: DiagnosticMissRow) => string,
  topic: string
): { m1: number; m2: number; total: number } {
  let m1 = 0;
  let m2 = 0;
  for (const row of rows) {
    if (matchTopic(row) !== topic) continue;
    if (row.mod === "1") m1++;
    else m2++;
  }
  return { m1, m2, total: m1 + m2 };
}

function rwPlanSkill(topic: string, points: number): PlanSkill {
  const id = RW_TOPIC_IDS[topic] ?? `rw-${topic.toLowerCase().replace(/\s+/g, "-")}`;
  return {
    id,
    topic,
    points,
    misses: countMisses(RW_MISS_TABLE, (row) => row.topic, topic),
  };
}

function mathPlanSkill(topic: string, points: number): PlanSkill {
  const idMap: Record<string, string> = {
    "Factoring, zero-product, and factor theorem": "math-factoring",
    "Circles, arc length, and tangency": "math-circles",
    "Linear functions and word problems": "math-linear",
    "Finish-the-question and grid-in habits": "math-grid-in",
    "Nonlinear functions": "math-nonlinear",
  };
  return {
    id: idMap[topic] ?? `math-${topic.toLowerCase().replace(/\s+/g, "-")}`,
    topic,
    points,
    misses: countMisses(MATH_MISS_TABLE, mathTopicForMiss, topic),
  };
}

/** All modeled RW skills for the ledger (sorted by points in the model). */
export const RW_SKILLS: PlanSkill[] = SHERMEEN_RW_SKILL_MODEL.skills.map((skill) =>
  rwPlanSkill(skill.topic, skill.points)
);

/** Mentor math buckets at 12+ modeled pts for the ledger. */
export const MATH_SKILLS: PlanSkill[] = SHERMEEN_MATH_SKILL_MODEL.skills
  .filter((skill) => skill.points >= 12)
  .map((skill) => mathPlanSkill(skill.topic, skill.points));

/** Nine skills we teach in Weeks 2–10 (interleaved RW and Math). */
const ROTATION_TOPICS = [
  "Transitions",
  "Factoring, zero-product, and factor theorem",
  "Command of Evidence",
  "Circles, arc length, and tangency",
  "Form, Structure, and Sense",
  "Linear functions and word problems",
  "Boundaries",
  "Finish-the-question and grid-in habits",
  "Rhetorical Synthesis",
] as const;

function findRwPoints(topic: string): number {
  return SHERMEEN_RW_SKILL_MODEL.skills.find((s) => s.topic === topic)?.points ?? 0;
}

function findMathPoints(topic: string): number {
  return SHERMEEN_MATH_SKILL_MODEL.skills.find((s) => s.topic === topic)?.points ?? 0;
}

export const PLAN_ROTATION_SKILLS: PlanSkill[] = ROTATION_TOPICS.map((topic) => {
  if (
    topic === "Factoring, zero-product, and factor theorem" ||
    topic === "Circles, arc length, and tangency" ||
    topic === "Linear functions and word problems" ||
    topic === "Finish-the-question and grid-in habits"
  ) {
    return mathPlanSkill(topic, findMathPoints(topic));
  }
  return rwPlanSkill(topic, findRwPoints(topic));
});

function parseScoreMid(range: string): number {
  const [low, high] = range.split("–").map((part) => Number(part.trim()));
  return Math.round((low + high) / 2);
}

export const PLAN_TOTALS = {
  rwSection: SHERMEEN_RW_SKILL_MODEL.ceiling,
  mathSection: SHERMEEN_MATH_SKILL_MODEL.ceiling,
  missCount: 34,
  baselineScore: parseScoreMid(SHERMEEN_HERO.totalRange),
};
