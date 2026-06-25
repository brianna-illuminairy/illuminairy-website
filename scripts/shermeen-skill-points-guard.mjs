#!/usr/bin/env node
/**
 * Shermeen diagnostic skill point model — reconciliation guard.
 * Run: node scripts/shermeen-skill-points-guard.mjs
 */

import { buildSectionSkillPoints, sectionHeadroom } from "../lib/diagnostic/skill-point-model.ts";
import {
  MATH_MISS_TABLE,
  QUESTION_MAP,
  RW_MISS_TABLE,
  SHERMEEN_HERO,
} from "../lib/shermeen/diagnostic-report-data.ts";

function shermeenMathTopic(row) {
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

function parseRange(range) {
  const [low, high] = range.split("–").map((part) => Number(part.trim()));
  return { low, high, mid: Math.round((low + high) / 2) };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`shermeen-skill-points-guard: ${message}`);
    process.exitCode = 1;
    return false;
  }
  return true;
}

function sumSkillPoints(model) {
  return model.skills.reduce((sum, skill) => sum + skill.points, 0);
}

function missCountFromSummary(summary) {
  const match = summary.match(/(\d+)\s+of\s+(\d+)/i);
  if (!match) return null;
  return Number(match[2]) - Number(match[1]);
}

const rwRange = parseRange(SHERMEEN_HERO.rwRange);
const mathRange = parseRange(SHERMEEN_HERO.mathRange);
const rwHeadroom = sectionHeadroom(rwRange.low, rwRange.high);
const mathHeadroom = sectionHeadroom(mathRange.low, mathRange.high);

const reportedRwMisses = missCountFromSummary(QUESTION_MAP[0].summary);
const reportedMathMisses = missCountFromSummary(QUESTION_MAP[1].summary);

const rwModel = buildSectionSkillPoints({
  misses: RW_MISS_TABLE,
  scoreLow: rwRange.low,
  scoreHigh: rwRange.high,
  totalQuestions: 54,
});

const mathModel = buildSectionSkillPoints({
  misses: MATH_MISS_TABLE,
  scoreLow: mathRange.low,
  scoreHigh: mathRange.high,
  totalQuestions: 44,
  normalizeTopic: shermeenMathTopic,
});

assert(
  RW_MISS_TABLE.length === reportedRwMisses,
  `RW_MISS_TABLE has ${RW_MISS_TABLE.length} rows but score report implies ${reportedRwMisses} misses`
);
assert(
  MATH_MISS_TABLE.length === reportedMathMisses,
  `MATH_MISS_TABLE has ${MATH_MISS_TABLE.length} rows but score report implies ${reportedMathMisses} misses`
);

const rwSum = sumSkillPoints(rwModel);
const mathSum = sumSkillPoints(mathModel);

assert(
  Math.abs(rwSum - rwModel.ceiling) <= 1,
  `RW skill sum (${rwSum}) !== ceiling (${rwModel.ceiling})`
);
assert(
  Math.abs(mathSum - mathModel.ceiling) <= 1,
  `Math skill sum (${mathSum}) !== ceiling (${mathModel.ceiling})`
);

assert(
  Math.abs(rwModel.ceiling - rwHeadroom) <= 5,
  `RW ceiling (${rwModel.ceiling}) not within 5 of headroom (${rwHeadroom})`
);
assert(
  Math.abs(mathModel.ceiling - mathHeadroom) <= 5,
  `Math ceiling (${mathModel.ceiling}) not within 5 of headroom (${mathHeadroom})`
);

for (const skill of rwModel.skills) {
  if (skill.missCount >= 4) {
    assert(
      skill.points >= 35,
      `RW skill "${skill.topic}" has ${skill.missCount} misses but only ${skill.points} pts`
    );
  }
}

const transitions = rwModel.skills.find((s) => s.topic === "Transitions");
const coe = rwModel.skills.find((s) => s.topic === "Command of Evidence");
assert(transitions && transitions.points >= 50, `Transitions expected ~50+ pts, got ${transitions?.points}`);
assert(coe && coe.points >= 45, `Command of Evidence expected ~45+ pts, got ${coe?.points}`);

if (process.exitCode === 1) {
  console.error("shermeen-skill-points-guard: FAILED");
  process.exit(1);
}

console.log("shermeen-skill-points-guard: OK");
console.log(
  `  RW: ${rwModel.ceiling} pts (${RW_MISS_TABLE.length} misses, headroom ${rwHeadroom})`
);
console.log(
  `  Math: ${mathModel.ceiling} pts (${MATH_MISS_TABLE.length} misses, headroom ${mathHeadroom})`
);
