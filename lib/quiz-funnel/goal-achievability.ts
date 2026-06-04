import { satProgramOutcomes } from "@/lib/site";
import { funnelToday } from "@/lib/funnel-today";
import type { QuizAnswersLike, ScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import { buildScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import { SCORE_PATH_DEFAULT_GAIN, SCORE_PATH_DEFAULT_WEEKS, hasTargetScore } from "@/lib/quiz-funnel/quiz-profile";
import { Q5_TEST_DATES } from "@/lib/quiz-funnel/gains";
import {
  buildPrepStruggleLead,
  buildRevealInsightParagraph,
  Q6_BLOCKER_ORDER,
  Q6_SOLUTION_COPY,
} from "@/lib/quiz-funnel/reveal-insight-copy";

/**
 * Reveal assessment — which quiz answers drive which UI.
 *
 * | Input | Question | Drives on reveal |
 * |-------|----------|------------------|
 * | q8 | Target score | Gap vs start → tier gauge, +pts headline |
 * | q5 | Test date | “by Sept 12” vs “over N weeks”, runway in tier math |
 * | q4 | Starting score | Gap vs target → tier gauge, +pts headline |
 *
 * Tier gauge uses satProgramOutcomes.achievabilityGainAnchors (100@4w, 150@6w, 182@12w…).
 * **Ambitious** when gap ≈ expected gain for their week count; more weeks or smaller gap → easier tier.
 * | q9 | GPA | Asked after the reveal; insight line stays GPA-agnostic |
 * | q2 | Why a higher SAT matters | Subheadline (scholarships, schools, etc.) |
 * | q6 | What seems to be the problem | “But to improve…” bridge + typical need |
 * | q7 | What they tried last time | Optional “after …” clause in insight |
 */
export const ACHIEVABILITY_INPUT_FIELDS = [
  "q8",
  "q5",
  "q4",
  "q9",
  "q2",
  "q6",
  "q7",
] as const;

export type GoalFeasibilityTier =
  | "effortless"
  | "realistic"
  | "ambitious"
  | "aggressive"
  | "extreme";

export const GOAL_FEASIBILITY_TIER_LABELS: Record<GoalFeasibilityTier, string> = {
  effortless: "Effortless",
  realistic: "Realistic",
  ambitious: "Ambitious",
  aggressive: "Aggressive",
  extreme: "Extreme",
};

export const GOAL_FEASIBILITY_TIER_ORDER: GoalFeasibilityTier[] = [
  "effortless",
  "realistic",
  "ambitious",
  "aggressive",
  "extreme",
];

const Q5_HEADLINE_DATE: Record<string, string> = {
  aug22: "Aug 22",
  sept12: "Sept 12",
  oct3: "Oct 3",
  nov7: "Nov 7",
  dec5: "Dec 5",
};

const Q9_GPA_SHORT: Record<string, string> = {
  "u3.0": "2.9",
  "3.0-3.3": "3.2",
  "3.3-3.5": "3.4",
  "3.5-3.7": "3.6",
  "3.7-3.9": "3.8",
  "4.0+": "4.0+",
};

/** Stat-bar values shown above the achievability rating. */
export type AchievabilityStats = {
  /** Target − starting, when a real goal is set (null when goal is tbd). */
  scoreGap: number | null;
  /** Short test date, e.g. "Oct 3" (null when no scheduled date). */
  testDateShort: string | null;
  daysToTest: number | null;
  /** Points per week needed to close the gap (null when goal is tbd). */
  ptsPerWeek: number | null;
  /** Whether q8 gave a real target score (vs tbd/na). */
  hasKnownGoal: boolean;
};

/** Point-gain band for each tier at the student's runway. */
export type AchievabilityTierRange = {
  tier: GoalFeasibilityTier;
  label: string;
  minGain: number;
  maxGain: number | null;
};

export type GoalAchievability = {
  tier: GoalFeasibilityTier;
  tierIndex: number;
  stats: AchievabilityStats;
  tierRanges: AchievabilityTierRange[];
  /** H1 — e.g. “+250 pts in 16 weeks.” */
  pointsLine: string;
  /** H2 — tier verdict (“Realistic and” / “Tight timeline,”). */
  verdictLead: string;
  verdictEm: string;
  /** Subheadline — q2 stakes. */
  stakesLead: string;
  /** Inside callout box, under the gauge. */
  outcomesMeta: string;
  /** Specifics paragraph — GPA + improve bridge + typical need. */
  insightParagraph: string;
  /** @deprecated Tests — use insightParagraph */
  gpaLabel: string | null;
  /** @deprecated Tests — q7 “after …” fragment */
  prepFailureClause: string | null;
  /** @deprecated Tests */
  skillSubject: string | null;
  /** @deprecated Tests */
  skillDetail: string;
  hitRatePct: number;
  hitRateBefore: string;
  hitRateEmphasis: string;
  hitRateAfter: string;
  varyDisclaimer: string;
};

const STAKES_ACHIEVABILITY_LEAD: Record<string, string> = {
  merit:
    "A higher score could unlock thousands of dollars in merit scholarships.",
  "top-choice":
    "A higher score could make them competitive for their top-choice school.",
  selective: "A higher score keeps selective colleges on the table.",
  "app-rounds": "A higher score helps them be ready for early application rounds.",
  early: "A higher score helps them be ready for early application rounds.",
};

function roundGainPoints(gain: number): number {
  if (gain <= 0) return 0;
  if (gain < 50) return Math.round(gain / 5) * 5;
  return Math.round(gain / 10) * 10;
}

/** Typical gain at `weeks` — linear interpolation between achievabilityGainAnchors. */
export function expectedGainForWeeks(weeks: number): number {
  const anchors = satProgramOutcomes.achievabilityGainAnchors;
  const w = Math.max(1, weeks);

  if (w <= anchors[0].weeks) {
    return Math.round((anchors[0].gain / anchors[0].weeks) * w);
  }

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (w <= b.weeks) {
      const t = (w - a.weeks) / (b.weeks - a.weeks);
      return Math.round(a.gain + t * (b.gain - a.gain));
    }
  }

  const last = anchors[anchors.length - 1];
  const prev = anchors[anchors.length - 2];
  const slope = (last.gain - prev.gain) / (last.weeks - prev.weeks);
  return Math.round(last.gain + slope * (w - last.weeks));
}

/** @deprecated Use expectedGainForWeeks(weeks) / weeks */
export function achievabilityBenchmarkPtsPerWeek(weeks = satProgramOutcomes.programWeeks): number {
  return expectedGainForWeeks(weeks) / Math.max(1, weeks);
}

/** Calendar days until the q5 test date (null when no scheduled date / past). */
function daysUntilTestDate(q5?: string): number | null {
  const date = Q5_TEST_DATES[q5 as keyof typeof Q5_TEST_DATES];
  if (!date) return null;
  const days = Math.round((date.getTime() - funnelToday().getTime()) / 86400000);
  return days > 0 ? days : null;
}

/**
 * Point-gain band each tier represents at this runway. Anchored on the average
 * student (+182 over 12 weeks ≈ Ambitious). Mirrors tierFromFeasibilityPressure
 * thresholds so the legend matches where a real goal would land.
 */
export function buildTierRanges(weeks: number): AchievabilityTierRange[] {
  const expected = expectedGainForWeeks(Math.max(1, weeks));
  const r = (x: number) => Math.round((x * expected) / 10) * 10;
  const cuts = { effortless: r(0.65), realistic: r(0.85), ambitious: r(1.15), aggressive: r(1.42) };
  return [
    { tier: "effortless", label: GOAL_FEASIBILITY_TIER_LABELS.effortless, minGain: 0, maxGain: cuts.effortless },
    { tier: "realistic", label: GOAL_FEASIBILITY_TIER_LABELS.realistic, minGain: cuts.effortless, maxGain: cuts.realistic },
    { tier: "ambitious", label: GOAL_FEASIBILITY_TIER_LABELS.ambitious, minGain: cuts.realistic, maxGain: cuts.ambitious },
    { tier: "aggressive", label: GOAL_FEASIBILITY_TIER_LABELS.aggressive, minGain: cuts.ambitious, maxGain: cuts.aggressive },
    { tier: "extreme", label: GOAL_FEASIBILITY_TIER_LABELS.extreme, minGain: cuts.aggressive, maxGain: null },
  ];
}

function buildAchievabilityStats(
  path: ScorePathOutput,
  pressure: FeasibilityPressure | null,
  q5: string | undefined,
  q8: string | undefined
): AchievabilityStats {
  const hasKnownGoal = hasTargetScore(q8);
  return {
    scoreGap: hasKnownGoal ? path.rawGap : null,
    testDateShort: q5 ? (Q5_HEADLINE_DATE[q5] ?? null) : null,
    daysToTest: daysUntilTestDate(q5),
    ptsPerWeek:
      hasKnownGoal && pressure ? Math.max(1, Math.round(pressure.neededPtsPerWeek)) : null,
    hasKnownGoal,
  };
}

export type FeasibilityPressure = {
  gap: number;
  weeks: number;
  expectedGainAtWeeks: number;
  neededPtsPerWeek: number;
  benchmarkPtsPerWeek: number;
  /** gap ÷ expectedGainAtWeeks — 1.0 = on-anchor (e.g. 182 pts with 12 weeks) */
  timePressure: number;
  /** Modeled gain ÷ gap — bumps tier when the curve cannot close the full gap */
  coverage: number;
};

export function computeFeasibilityPressure(
  path: ScorePathOutput
): FeasibilityPressure | null {
  const gap = path.rawGap;
  if (gap == null || gap <= 0) return null;

  const weeks = Math.max(1, path.chartWeeks);
  const expectedGainAtWeeks = expectedGainForWeeks(weeks);
  const neededPtsPerWeek = gap / weeks;
  const benchmarkPtsPerWeek = expectedGainAtWeeks / weeks;
  const timePressure = gap / expectedGainAtWeeks;
  const modeled = path.modeledGain ?? expectedGainAtWeeks;
  const coverage = modeled / gap;

  return {
    gap,
    weeks,
    expectedGainAtWeeks,
    neededPtsPerWeek,
    benchmarkPtsPerWeek,
    timePressure,
    coverage,
  };
}

/** Map time pressure (+ coverage shortfall) → Effortless … Extreme. */
export function tierFromFeasibilityPressure(
  timePressure: number,
  coverage: number,
  flags: ScorePathOutput["flags"]
): GoalFeasibilityTier {
  if (flags.pastTestDate) return "extreme";
  if (flags.shortRunway && coverage < 0.85) return "extreme";

  let adjusted = timePressure;
  if (coverage < 0.5) adjusted *= 1.35;
  else if (coverage < 0.75) adjusted *= 1.15;
  else if (coverage < 0.9) adjusted *= 1.05;

  // Anchor: 1.0 = gap matches expected gain for this runway (see achievabilityGainAnchors).
  if (adjusted <= 0.65) return "effortless";
  if (adjusted <= 0.85) return "realistic";
  if (adjusted <= 1.15) return "ambitious";
  if (adjusted <= 1.42) return "aggressive";
  return "extreme";
}

export function computeFeasibilityTier(path: ScorePathOutput): GoalFeasibilityTier {
  if (path.flags.targetAtOrBelowCurrent) return "effortless";

  const pressure = computeFeasibilityPressure(path);
  if (!pressure) return "effortless";

  return tierFromFeasibilityPressure(
    pressure.timePressure,
    pressure.coverage,
    path.flags
  );
}

function verdictForTier(
  tier: GoalFeasibilityTier,
  hasScheduledTestDate = true
): { lead: string; em: string } {
  switch (tier) {
    case "effortless":
      return { lead: "Comfortably", em: "achievable" };
    case "realistic":
      return { lead: "Realistic and", em: "achievable" };
    case "ambitious":
      return { lead: "Ambitious, but", em: "achievable" };
    case "aggressive":
      return { lead: "Tight timeline,", em: "still possible" };
    case "extreme":
      return hasScheduledTestDate
        ? { lead: "Unlikely by test day,", em: "let's map options" }
        : { lead: "Unlikely in this window,", em: "let's map options" };
    default:
      return { lead: "Ambitious, but", em: "achievable" };
  }
}

function achievabilityOutcomesMeta(): string {
  const label = satProgramOutcomes.achievabilityOutcomesSampleLabel;
  return `Based on outcomes from ${label} similar students.`;
}

function buildPointsLine(path: ScorePathOutput, q5?: string): string {
  const gain =
    path.modeledGain ??
    path.rawGap ??
    SCORE_PATH_DEFAULT_GAIN;
  const displayGain = roundGainPoints(gain);
  const shortDate = q5 ? Q5_HEADLINE_DATE[q5] : null;

  if (shortDate && path.hasScheduledTestDate) {
    return `+${displayGain} pts by ${shortDate}.`;
  }

  const weeks = path.chartWeeks || SCORE_PATH_DEFAULT_WEEKS;
  return `+${displayGain} pts in ${weeks} weeks.`;
}

/** q7 — prep-struggle lead sentence (reuses hit-q7 × q6 copy). */
export function buildQ7AfterPhrase(q7: unknown, q6: unknown = []): string | null {
  return buildPrepStruggleLead(q7, q6);
}

/** @deprecated Alias for tests. */
export function buildLastPrepClause(q7: unknown, q6: unknown = []): string | null {
  return buildPrepStruggleLead(q7, q6);
}

export type GoalSkillInsight = {
  skillSubject: string | null;
  /** Completes “they typically need to …” */
  skillDetail: string;
};

const MATH_SKILL_INSIGHT: GoalSkillInsight = {
  skillSubject: "Math",
  skillDetail:
    "focus on Advanced Algebra, Data Analysis, and pacing on word problems, and learn to use the SAT calculator to save time on test day",
};

const READING_SKILL_INSIGHT: GoalSkillInsight = {
  skillSubject: "Reading & writing",
  skillDetail:
    "focus on grammar in context, tricky passages, and inference under time pressure",
};

const BOTH_SKILL_INSIGHT: GoalSkillInsight = {
  skillSubject: "Math and Reading & writing",
  skillDetail:
    "focus on the handful of Math and Reading & writing topics the Skill Diagnostic ranks first, often Algebra or inference, not the whole test",
};

const BEHAVIORAL_SKILL_INSIGHT: Record<string, GoalSkillInsight> = {
  "self-study": {
    skillSubject: null,
    skillDetail:
      "rank the handful of skills worth the most points first instead of spreading across the whole test",
  },
  "no-plan": {
    skillSubject: null,
    skillDetail:
      "name the 5–6 skills to work first so time goes to the right topics",
  },
  wont: {
    skillSubject: null,
    skillDetail:
      "work the same problem types with someone tracking progress week to week until they stop missing them",
  },
  "too-busy": {
    skillSubject: null,
    skillDetail:
      "focus on the few skills that move the score most with the hours they have",
  },
};

const BEHAVIORAL_Q6_PRIORITY = ["self-study", "no-plan", "too-busy", "wont"] as const;

const GENERIC_SKILL_INSIGHT: GoalSkillInsight = {
  skillSubject: null,
  skillDetail:
    "focus on the handful of skills the Skill Diagnostic ranks first, usually 5–6, not the whole test",
};

/** Maps q6 selections to skill need clause (mirrors their answer). */
export function buildSkillInsight(q6: string[] = []): GoalSkillInsight {
  const ids = Array.isArray(q6) ? q6 : [];
  const hasMath = ids.includes("math");
  const hasReading = ids.includes("reading");

  if (hasMath && hasReading) return BOTH_SKILL_INSIGHT;
  if (hasMath) return MATH_SKILL_INSIGHT;
  if (hasReading) return READING_SKILL_INSIGHT;

  for (const id of BEHAVIORAL_Q6_PRIORITY) {
    if (ids.includes(id)) return BEHAVIORAL_SKILL_INSIGHT[id];
  }

  return GENERIC_SKILL_INSIGHT;
}

function gpaShortLabel(q9?: string): string | null {
  if (!q9) return null;
  return Q9_GPA_SHORT[q9] ?? null;
}

function gpaInsightLabel(q9?: string): string | null {
  const short = gpaShortLabel(q9);
  if (!short) return null;
  if (q9 === "u3.0") return short;
  if (q9 === "4.0+") return "4.0+";
  return `${short}+`;
}

/** Full specifics paragraph on the reveal screen. */
export function buildInsightParagraph(
  answers: QuizAnswersLike,
  path?: ScorePathOutput
): string {
  const resolved = path ?? buildScorePathOutput(answers);
  const pressure = computeFeasibilityPressure(resolved);
  const tier = computeFeasibilityTier(resolved);
  const ptsPerWeek =
    pressure != null ? Math.max(1, Math.round(pressure.neededPtsPerWeek)) : undefined;

  return buildRevealInsightParagraph(answers, { ptsPerWeek, tier });
}

function buildInsightParts(
  answers: QuizAnswersLike,
  path: ScorePathOutput
): {
  gpaLabel: string | null;
  prepFailureClause: string | null;
  skillSubject: string | null;
  skillDetail: string;
  insightParagraph: string;
} {
  const gpa = gpaInsightLabel(answers.q9);
  const insight = buildSkillInsight(answers.q6);
  return {
    gpaLabel: gpa,
    prepFailureClause: buildPrepStruggleLead(answers.q7, answers.q6),
    skillSubject: insight.skillSubject,
    skillDetail: insight.skillDetail,
    insightParagraph: buildInsightParagraph(answers, path),
  };
}

function buildStakesLead(q2?: string): string {
  return (
    STAKES_ACHIEVABILITY_LEAD[q2 ?? ""] ??
    STAKES_ACHIEVABILITY_LEAD["top-choice"]
  );
}

export function buildGoalAchievability(
  answers: QuizAnswersLike,
  path: ScorePathOutput = buildScorePathOutput(answers)
): GoalAchievability {
  const tier = computeFeasibilityTier(path);
  const tierIndex = GOAL_FEASIBILITY_TIER_ORDER.indexOf(tier);
  const verdict = verdictForTier(tier, path.hasScheduledTestDate);
  const insight = buildInsightParts(answers, path);
  const pointsLine = buildPointsLine(path, answers.q5);
  const pressure = computeFeasibilityPressure(path);

  return {
    tier,
    tierIndex: tierIndex >= 0 ? tierIndex : 2,
    stats: buildAchievabilityStats(path, pressure, answers.q5, answers.q8),
    tierRanges: buildTierRanges(pressure?.weeks ?? path.chartWeeks),
    pointsLine,
    verdictLead: verdict.lead,
    verdictEm: verdict.em,
    stakesLead: buildStakesLead(answers.q2),
    outcomesMeta: achievabilityOutcomesMeta(),
    insightParagraph: insight.insightParagraph,
    gpaLabel: insight.gpaLabel,
    prepFailureClause: insight.prepFailureClause,
    skillSubject: insight.skillSubject,
    skillDetail: insight.skillDetail,
    hitRatePct: satProgramOutcomes.targetHitRatePct,
    hitRateBefore: "of students who follow their Illuminairy plan ",
    hitRateEmphasis: "reach their score goal",
    hitRateAfter: "",
    varyDisclaimer: satProgramOutcomes.varyDisclaimer,
  };
}

/** Share payloads saved before achievability shipped — rebuild a minimal view. */
export function buildGoalAchievabilityFallback(
  plan: {
    metrics?: { gainRange?: string; weeks?: string };
    subhead?: string;
  }
): GoalAchievability {
  const tier: GoalFeasibilityTier = "ambitious";
  const verdict = verdictForTier(tier);
  const gainText = plan.metrics?.gainRange?.replace(/^\+?/, "+") ?? "+200";
  const weeksText = plan.metrics?.weeks?.replace(/\D/g, "") ?? "12";
  const pointsLine = `${gainText} pts in ${weeksText} weeks.`;

  return {
    tier,
    tierIndex: 2,
    stats: {
      scoreGap: null,
      testDateShort: null,
      daysToTest: null,
      ptsPerWeek: null,
      hasKnownGoal: false,
    },
    tierRanges: buildTierRanges(Number(weeksText) || 12),
    pointsLine,
    verdictLead: verdict.lead,
    verdictEm: verdict.em,
    stakesLead: plan.subhead ?? buildStakesLead("merit"),
    outcomesMeta: achievabilityOutcomesMeta(),
    insightParagraph: buildRevealInsightParagraph(
      { q9: undefined, q6: [] },
      { ptsPerWeek: undefined, tier: "ambitious" }
    ),
    gpaLabel: null,
    prepFailureClause: null,
    skillSubject: null,
    skillDetail: GENERIC_SKILL_INSIGHT.skillDetail,
    hitRatePct: satProgramOutcomes.targetHitRatePct,
    hitRateBefore: "of students who follow their Illuminairy plan ",
    hitRateEmphasis: "reach their score goal",
    hitRateAfter: "",
    varyDisclaimer: satProgramOutcomes.varyDisclaimer,
  };
}

/** Eyebrow for the goal-achievability screen (shown before the score projection). */
export function achievabilityEyebrow(_q2?: string): string {
  return "Goal score achievability";
}
