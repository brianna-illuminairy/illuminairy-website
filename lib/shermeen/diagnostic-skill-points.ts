import {
  buildSectionSkillPoints,
  MODELED_SKILL_POINTS_FOOTNOTE,
  type DiagnosticMissRow,
} from "@/lib/diagnostic/skill-point-model";
import {
  MATH_MISS_TABLE,
  QUESTION_MAP,
  RW_MISS_TABLE,
  SHERMEEN_HERO,
} from "@/lib/shermeen/diagnostic-report-data";

const RW_TOTAL_QUESTIONS = 54;
const MATH_TOTAL_QUESTIONS = 44;

function parseScoreRange(range: string): { low: number; high: number } {
  const [low, high] = range.split("–").map((part) => Number(part.trim()));
  return { low, high };
}

/** Miss count from section summary ("34 of 54" → 20), not raw table length. */
function missCountFromSectionSummary(summary: string): number {
  const match = summary.match(/(\d+)\s+of\s+(\d+)/i);
  if (!match) return 0;
  return Number(match[2]) - Number(match[1]);
}

/** Math priority buckets aligned with mentor gap sections in diagnostic-analysis-copy. */
function shermeenMathTopic(row: DiagnosticMissRow): string {
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

const rwRange = parseScoreRange(SHERMEEN_HERO.rwRange);
const mathRange = parseScoreRange(SHERMEEN_HERO.mathRange);
const rwReportedMisses = missCountFromSectionSummary(QUESTION_MAP[0].summary);
const mathReportedMisses = missCountFromSectionSummary(QUESTION_MAP[1].summary);

export const SHERMEEN_RW_SKILL_MODEL = buildSectionSkillPoints({
  misses: RW_MISS_TABLE,
  scoreLow: rwRange.low,
  scoreHigh: rwRange.high,
  totalQuestions: RW_TOTAL_QUESTIONS,
  missCount: rwReportedMisses,
});

export const SHERMEEN_MATH_SKILL_MODEL = buildSectionSkillPoints({
  misses: MATH_MISS_TABLE,
  scoreLow: mathRange.low,
  scoreHigh: mathRange.high,
  totalQuestions: MATH_TOTAL_QUESTIONS,
  missCount: mathReportedMisses,
  normalizeTopic: shermeenMathTopic,
});

export const RW_PRIORITY = SHERMEEN_RW_SKILL_MODEL.skills.map(({ topic, pts }) => ({
  topic,
  pts,
}));

/** Parent-facing list: mentor buckets and other skills at 12+ modeled pts. */
export const MATH_PRIORITY = SHERMEEN_MATH_SKILL_MODEL.skills
  .filter((skill) => skill.points >= 12)
  .map(({ topic, pts }) => ({ topic, pts }));

export const SHERMEEN_RW_SKILLS_15_PLUS = SHERMEEN_RW_SKILL_MODEL.skills15Plus;
export const SHERMEEN_MATH_SKILLS_15_PLUS = SHERMEEN_MATH_SKILL_MODEL.skills15Plus;
export const SHERMEEN_RW_SKILL_AREA_COUNT = SHERMEEN_RW_SKILL_MODEL.skills.length;
export const SHERMEEN_MATH_SKILL_AREA_COUNT = SHERMEEN_MATH_SKILL_MODEL.skills.length;

export const SHERMEEN_SKILL_POINT_MODEL = {
  rw: SHERMEEN_RW_SKILL_MODEL,
  math: SHERMEEN_MATH_SKILL_MODEL,
  rwSkills15Plus: SHERMEEN_RW_SKILLS_15_PLUS,
  mathSkills15Plus: SHERMEEN_MATH_SKILLS_15_PLUS,
  footnote: MODELED_SKILL_POINTS_FOOTNOTE,
};
