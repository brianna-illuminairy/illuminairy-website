/**
 * IRT-inspired modeled recoverable points from diagnostic misses.
 *
 * Full 3PL item parameters are not published for Digital SAT forms. This model uses
 * operational difficulty (E/M/H) as a difficulty proxy, weights Module 1 misses for
 * adaptive routing risk, groups by skill tag, then scales skill totals to a section
 * ceiling derived from the reported score band and miss count.
 *
 * SSOT process: docs/data-visualization-sat-model.md (steps 1–5).
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
  ceiling: number;
  totalWeightedMisses: number;
  skills: SkillPointRow[];
  skills15Plus: number;
};

/** Easy misses at moderate ability carry more score information (Soha routing narrative). */
const IRT_DIFF_WEIGHT: Record<MissDifficulty, number> = {
  easy: 3,
  med: 2,
  hard: 1,
};

/** Module 1 wrong answers can cap Module 2 difficulty (adaptive SAT). */
const MODULE1_ROUTING_FACTOR = 1.15;

const HEADROOM_CAL_FACTOR = 1.35;

export function missItemWeight(diff: MissDifficulty, mod: string): number {
  const base = IRT_DIFF_WEIGHT[diff];
  return mod === "1" ? base * MODULE1_ROUTING_FACTOR : base;
}

/**
 * Max plausible recoverable points for a section on this test.
 * Capped below 800 − sectionMid and below band-derived bound so skill totals
 * never exceed what the score report can support.
 */
export function sectionRecoverableCeiling(
  scoreLow: number,
  scoreHigh: number,
  missCount: number,
  totalQuestions: number
): number {
  const mid = (scoreLow + scoreHigh) / 2;
  const headroom = 800 - mid;
  const missShare = missCount / totalQuestions;
  const irtGap = headroom * missShare * HEADROOM_CAL_FACTOR;
  const bandCap = (scoreHigh - scoreLow) * 3 + missCount * 4;
  return Math.min(Math.round(irtGap), Math.round(bandCap), Math.round(headroom));
}

function roundSkillPoints(raw: number, ceiling: number, totalRaw: number): number {
  if (totalRaw <= 0 || ceiling <= 0) return 0;
  return Math.round((raw / totalRaw) * ceiling);
}

function formatPts(points: number): string {
  return `~${points} pts`;
}

export function buildSectionSkillPoints(input: {
  misses: DiagnosticMissRow[];
  scoreLow: number;
  scoreHigh: number;
  totalQuestions: number;
  /** When set, caps the model to score-report miss count instead of table row count. */
  missCount?: number;
  normalizeTopic?: (row: DiagnosticMissRow) => string;
}): SectionSkillPointModel {
  const { misses, scoreLow, scoreHigh, totalQuestions, normalizeTopic } = input;
  const reportedMisses = input.missCount ?? misses.length;
  const ceiling = sectionRecoverableCeiling(
    scoreLow,
    scoreHigh,
    reportedMisses,
    totalQuestions
  );

  const byTopic = new Map<string, { weight: number; missCount: number }>();
  let totalWeighted = 0;

  for (const row of misses) {
    const topic = normalizeTopic ? normalizeTopic(row) : row.topic;
    const weight = missItemWeight(row.diff, row.mod);
    totalWeighted += weight;
    const hit = byTopic.get(topic) ?? { weight: 0, missCount: 0 };
    hit.weight += weight;
    hit.missCount += 1;
    byTopic.set(topic, hit);
  }

  if (totalWeighted <= 0 || ceiling <= 0) {
    return { ceiling, totalWeightedMisses: totalWeighted, skills: [], skills15Plus: 0 };
  }

  const skills = Array.from(byTopic.entries())
    .map(([topic, data]) => {
      const points = roundSkillPoints(data.weight, ceiling, totalWeighted);
      return {
        topic,
        points,
        pts: formatPts(points),
        missCount: data.missCount,
      };
    })
    .sort((a, b) => b.points - a.points || b.missCount - a.missCount);

  const roundedSum = skills.reduce((sum, skill) => sum + skill.points, 0);
  const drift = ceiling - roundedSum;
  if (skills.length > 0 && drift !== 0) {
    skills[0] = {
      ...skills[0],
      points: skills[0].points + drift,
      pts: formatPts(skills[0].points + drift),
    };
  }

  const skills15Plus = skills.filter((skill) => skill.points >= 15).length;

  return {
    ceiling,
    totalWeightedMisses: totalWeighted,
    skills,
    skills15Plus,
  };
}

export const MODELED_SKILL_POINTS_FOOTNOTE =
  "Modeled recoverable points from missed items (difficulty-weighted), scaled to fit this section's score range. Results vary.";
