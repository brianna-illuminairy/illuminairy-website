/**
 * Modeled section-score impact from diagnostic misses.
 *
 * Digital SAT uses IRT (no public per-item chart). We estimate each miss as a
 * section-score point loss from difficulty (E/M/H) and module (M1 routing weight).
 * Skill totals sum misses in that tag; section total sums all misses, scaled to
 * section headroom (800 − section mid) when raw sum drifts >5%.
 *
 * SSOT: docs/data-visualization-sat-model.md
 */

export type MissDifficulty = "easy" | "med" | "hard";

export type DiagnosticMissRow = {
  mod: string;
  q: string;
  topic: string;
  diff: MissDifficulty;
};

export type SkillPointRow = {
  topic: string;
  points: number;
  pts: string;
  missCount: number;
};

export type SectionSkillPointModel = {
  /** Sum of skill points (= section subtotal after headroom scale). */
  ceiling: number;
  /** Raw sum before headroom scale (for guards). */
  rawSectionTotal: number;
  totalWeightedMisses: number;
  skills: SkillPointRow[];
  skills15Plus: number;
};

/** Modeled section-score impact per missed item (easy M1 highest, hard M2 lowest). */
const MISS_SECTION_POINTS: Record<MissDifficulty, { m1: number; m2: number }> = {
  easy: { m1: 18, m2: 14 },
  med: { m1: 13, m2: 11 },
  hard: { m1: 10, m2: 7 },
};

const HEADROOM_SCALE_THRESHOLD = 0.05;

/** @deprecated Use missQuestionPoints — kept for any external rank-only callers. */
export function missItemWeight(diff: MissDifficulty, mod: string): number {
  return missQuestionPoints(diff, mod);
}

export function missQuestionPoints(diff: MissDifficulty, mod: string): number {
  const band = MISS_SECTION_POINTS[diff];
  return mod === "1" ? band.m1 : band.m2;
}

export function sectionHeadroom(scoreLow: number, scoreHigh: number): number {
  const mid = (scoreLow + scoreHigh) / 2;
  return Math.round(800 - mid);
}

/** @deprecated Proportional ceiling replaced by additive miss sums + headroom scale. */
export function sectionRecoverableCeiling(
  scoreLow: number,
  scoreHigh: number,
  _missCount: number,
  _totalQuestions: number
): number {
  return sectionHeadroom(scoreLow, scoreHigh);
}

function formatPts(points: number): string {
  return `~${points} pts`;
}

function scaleSkillPoints(skills: SkillPointRow[], targetTotal: number, rawTotal: number): SkillPointRow[] {
  if (rawTotal <= 0 || targetTotal <= 0) return skills;

  const factor = targetTotal / rawTotal;
  const scaled = skills.map((skill) => {
    const points = Math.round(skill.points * factor);
    return { ...skill, points, pts: formatPts(points) };
  });

  const roundedSum = scaled.reduce((sum, skill) => sum + skill.points, 0);
  const drift = targetTotal - roundedSum;
  if (scaled.length > 0 && drift !== 0) {
    scaled[0] = {
      ...scaled[0],
      points: scaled[0].points + drift,
      pts: formatPts(scaled[0].points + drift),
    };
  }

  return scaled;
}

export function buildSectionSkillPoints(input: {
  misses: DiagnosticMissRow[];
  scoreLow: number;
  scoreHigh: number;
  totalQuestions: number;
  /** Ignored — kept for call-site compatibility; uses misses.length. */
  missCount?: number;
  normalizeTopic?: (row: DiagnosticMissRow) => string;
}): SectionSkillPointModel {
  const { misses, scoreLow, scoreHigh, normalizeTopic } = input;
  const headroom = sectionHeadroom(scoreLow, scoreHigh);

  const byTopic = new Map<string, { points: number; missCount: number }>();
  let rawSectionTotal = 0;

  for (const row of misses) {
    const topic = normalizeTopic ? normalizeTopic(row) : row.topic;
    const pts = missQuestionPoints(row.diff, row.mod);
    rawSectionTotal += pts;
    const hit = byTopic.get(topic) ?? { points: 0, missCount: 0 };
    hit.points += pts;
    hit.missCount += 1;
    byTopic.set(topic, hit);
  }

  if (rawSectionTotal <= 0 || headroom <= 0) {
    return {
      ceiling: 0,
      rawSectionTotal,
      totalWeightedMisses: misses.length,
      skills: [],
      skills15Plus: 0,
    };
  }

  let skills = Array.from(byTopic.entries())
    .map(([topic, data]) => ({
      topic,
      points: data.points,
      pts: formatPts(data.points),
      missCount: data.missCount,
    }))
    .sort((a, b) => b.points - a.points || b.missCount - a.missCount);

  const needsScale =
    Math.abs(rawSectionTotal - headroom) / headroom > HEADROOM_SCALE_THRESHOLD;
  const sectionTotal = needsScale ? headroom : rawSectionTotal;

  if (needsScale) {
    skills = scaleSkillPoints(skills, sectionTotal, rawSectionTotal);
  }

  const skills15Plus = skills.filter((skill) => skill.points >= 15).length;

  return {
    ceiling: sectionTotal,
    rawSectionTotal,
    totalWeightedMisses: misses.length,
    skills,
    skills15Plus,
  };
}

export const MODELED_SKILL_POINTS_FOOTNOTE =
  "Modeled section score impact per miss (difficulty and module weighted). Not official College Board scoring.";
