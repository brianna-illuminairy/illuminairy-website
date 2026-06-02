/**
 * Achievability variant matrix — keep in sync with lib/quiz-funnel/goal-achievability.ts
 */
import {
  buildGoalAchievability,
  buildSkillInsight,
  computeFeasibilityTier,
  expectedGainForWeeks,
  tierFromFeasibilityPressure,
} from "@/lib/quiz-funnel/goal-achievability";
import {
  buildQ6SolutionBlock,
  countInsightSentences,
  Q6_BLOCKER_ORDER,
  Q6_ROOT_CAUSE,
  Q6_ROOT_CLAUSE,
} from "@/lib/quiz-funnel/reveal-insight-copy";
import { buildScorePathOutput, type ScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";

type Case = {
  name: string;
  answers: QuizAnswersLike;
  expect: {
    skillSubject?: string | null;
    skillDetailIncludes?: string;
    stakesIncludes?: string;
    tier?: string;
    pointsIncludes?: string | string[];
    pointsExcludes?: string;
    prepIncludes?: string;
    prepNull?: boolean;
    outcomesIncludes?: string;
    insightIncludes?: string;
    prepExcludes?: string;
    insightExcludes?: string;
  };
};

const BASE: QuizAnswersLike = {
  q2: "merit",
  q3: "sat-1",
  q4: "1100-1200",
  q5: "sept12",
  q6: ["math"],
  q7: ["khan"],
  q8: "1400",
  q9: "3.7-3.9",
};

const Q6_CASES: Case[] = [
  {
    name: "q6 math → Math topics",
    answers: { ...BASE, q6: ["math"] },
    expect: {
      skillSubject: "Math",
      skillDetailIncludes: "Data Analysis",
    },
  },
  {
    name: "q6 reading → R&W topics",
    answers: { ...BASE, q6: ["reading"] },
    expect: {
      skillSubject: "Reading & writing",
      skillDetailIncludes: "grammar",
    },
  },
  {
    name: "q6 math+reading → both",
    answers: { ...BASE, q6: ["math", "reading"] },
    expect: { skillSubject: "Math and Reading & writing" },
  },
  {
    name: "q6 math+self-study → Math wins",
    answers: { ...BASE, q6: ["math", "self-study"] },
    expect: {
      skillSubject: "Math",
      skillDetailIncludes: "calculator",
    },
  },
  {
    name: "q6 self-study only → no subject line",
    answers: { ...BASE, q6: ["self-study"], q7: [] },
    expect: {
      skillSubject: null,
      skillDetailIncludes: "rank the handful",
      insightIncludes: "pts per week",
      prepNull: true,
    },
  },
  {
    name: "q6 no-plan only",
    answers: { ...BASE, q6: ["no-plan"], q7: [] },
    expect: {
      skillSubject: null,
      skillDetailIncludes: "5–6 skills",
      prepNull: true,
    },
  },
  {
    name: "q6 wont only",
    answers: { ...BASE, q6: ["wont"], q7: [] },
    expect: {
      skillSubject: null,
      skillDetailIncludes: "tracking progress",
      prepNull: true,
    },
  },
  {
    name: "q6 too-busy only",
    answers: { ...BASE, q6: ["too-busy"], q7: [] },
    expect: {
      skillSubject: null,
      skillDetailIncludes: "hours they have",
      prepNull: true,
    },
  },
  {
    name: "q6 empty → generic",
    answers: { ...BASE, q6: [] },
    expect: { skillSubject: null, skillDetailIncludes: "Skill Diagnostic ranks" },
  },
];

const Q2_CASES: Case[] = [
  {
    name: "q2 merit",
    answers: { ...BASE, q2: "merit" },
    expect: { stakesIncludes: "merit scholarships" },
  },
  {
    name: "q2 top-choice",
    answers: { ...BASE, q2: "top-choice" },
    expect: { stakesIncludes: "competitive for their top-choice school" },
  },
  {
    name: "q2 selective",
    answers: { ...BASE, q2: "selective" },
    expect: { stakesIncludes: "selective colleges" },
  },
  {
    name: "q2 app-rounds",
    answers: { ...BASE, q2: "app-rounds" },
    expect: { stakesIncludes: "early application" },
  },
];

const SCORE_CASES: Case[] = [
  {
    name: "canonical 1100→1400 sept12 ambitious",
    answers: BASE,
    expect: {
      tier: "ambitious",
      pointsIncludes: ["Sept 12", "+250"],
      outcomesIncludes: "1,500+",
      insightIncludes: "smart and capable",
      insightExcludes: "calculator pacing",
    },
  },
  {
    name: "small gap effortless",
    answers: { ...BASE, q4: "1300-1400", q8: "1350" },
    expect: { tier: "effortless" },
  },
  {
    name: "q4 na + q8 tbd → inferred gap, dated headline",
    answers: { ...BASE, q3: "none", q4: "na", q8: "tbd" },
    expect: { pointsIncludes: ["Sept 12", "+"], tier: "extreme" },
  },
  {
    name: "q5 tbd only → over weeks not by date",
    answers: { ...BASE, q5: "tbd" },
    expect: { pointsIncludes: "in", pointsExcludes: "by Sept" },
  },
  {
    name: "q8 tbd merit inferred target",
    answers: { ...BASE, q8: "tbd", q2: "merit" },
    expect: { tier: "aggressive" },
  },
];

function mockPath(
  gap: number,
  weeks: number,
  modeledGain: number,
  flags: Partial<ScorePathOutput["flags"]> = {}
): ScorePathOutput {
  return {
    rawGap: gap,
    chartWeeks: weeks,
    modeledGain,
    flags: {
      targetAtOrBelowCurrent: false,
      pastTestDate: false,
      shortRunway: weeks < 4,
      gapExceedsModeledGain: gap > modeledGain,
      ...flags,
    },
  } as ScorePathOutput;
}

function assertTierScalingUnit(): string[] {
  const errors: string[] = [];
  const flags = {
    targetAtOrBelowCurrent: false,
    pastTestDate: false,
    shortRunway: false,
    gapExceedsModeledGain: false,
  };

  const checks: [number, number, number, string][] = [
    [100, 4, 100, "ambitious"],
    [150, 6, 150, "ambitious"],
    [182, 12, 182, "ambitious"],
    [200, 14, 200, "ambitious"],
    [240, 16, 240, "ambitious"],
    [150, 12, 182, "realistic"],
    [182, 6, 150, "aggressive"],
    [250, 12, 250, "aggressive"],
    [80, 12, 80, "effortless"],
  ];

  const anchorWeeks: [number, number][] = [
    [4, 100],
    [6, 150],
    [12, 182],
    [14, 200],
    [16, 240],
    [15, 220],
  ];
  for (const [weeks, gain] of anchorWeeks) {
    const got = expectedGainForWeeks(weeks);
    if (got !== gain) {
      errors.push(`expectedGainForWeeks(${weeks}): expected ${gain}, got ${got}`);
    }
  }

  for (const [gap, weeks, modeled, tier] of checks) {
    const got = computeFeasibilityTier(mockPath(gap, weeks, modeled));
    if (got !== tier) {
      errors.push(`gap=${gap} weeks=${weeks}: expected ${tier}, got ${got}`);
    }
  }

  if (tierFromFeasibilityPressure(1.0, 1, flags) !== "ambitious") {
    errors.push("pressure 1.0 should map to ambitious");
  }
  if (tierFromFeasibilityPressure(0.75, 1, flags) !== "realistic") {
    errors.push("pressure 0.75 should map to realistic");
  }

  return errors;
}

const Q7_CASES: Case[] = [
  {
    name: "q7 khan + q6 math",
    answers: { ...BASE, q6: ["math"], q7: ["khan"] },
    expect: {
      skillSubject: "Math",
      prepIncludes: "Broad video and question banks",
      insightExcludes: "111",
    },
  },
  {
    name: "q7 group only",
    answers: { ...BASE, q6: ["reading"], q7: ["group"] },
    expect: {
      prepIncludes: "Group class moves at one pace",
    },
  },
  {
    name: "q7 nothing",
    answers: { ...BASE, q6: ["math"], q7: ["nothing"] },
    expect: {
      prepIncludes: "Without focused practice",
    },
  },
  {
    name: "q7 empty → no prep clause",
    answers: { ...BASE, q6: ["math"], q7: [] },
    expect: { prepNull: true, prepExcludes: "Khan" },
  },
];

const GPA_CASES: Case[] = [
  {
    name: "q9 4.0+",
    answers: { ...BASE, q9: "4.0+" },
    expect: { skillSubject: "Math" },
  },
  {
    name: "q9 missing → grades fallback",
    answers: { ...BASE, q9: undefined },
    expect: { skillSubject: "Math" },
  },
];

function assertCase(testCase: Case): string[] {
  const errors: string[] = [];
  const path = buildScorePathOutput(testCase.answers);
  const result = buildGoalAchievability(testCase.answers, path);
  const { expect: exp } = testCase;

  if (exp.skillSubject !== undefined && result.skillSubject !== exp.skillSubject) {
    errors.push(
      `skillSubject: expected ${JSON.stringify(exp.skillSubject)}, got ${JSON.stringify(result.skillSubject)}`
    );
  }
  if (exp.skillDetailIncludes && !result.skillDetail.includes(exp.skillDetailIncludes)) {
    errors.push(`skillDetail missing "${exp.skillDetailIncludes}": ${result.skillDetail}`);
  }
  if (exp.stakesIncludes && !result.stakesLead.includes(exp.stakesIncludes)) {
    errors.push(`stakesLead missing "${exp.stakesIncludes}": ${result.stakesLead}`);
  }
  if (exp.tier && result.tier !== exp.tier) {
    errors.push(`tier: expected ${exp.tier}, got ${result.tier}`);
  }
  if (exp.pointsIncludes) {
    const needles = Array.isArray(exp.pointsIncludes) ? exp.pointsIncludes : [exp.pointsIncludes];
    for (const needle of needles) {
      if (!result.pointsLine.includes(needle)) {
        errors.push(`pointsLine missing "${needle}": ${result.pointsLine}`);
      }
    }
  }
  if (exp.pointsExcludes && result.pointsLine.includes(exp.pointsExcludes)) {
    errors.push(`pointsLine should not include "${exp.pointsExcludes}": ${result.pointsLine}`);
  }
  if (exp.prepIncludes) {
    const prepHay = result.prepFailureClause ?? result.insightParagraph;
    if (!prepHay.includes(exp.prepIncludes)) {
      errors.push(
        `prep/q7 missing "${exp.prepIncludes}": ${prepHay ?? "(null)"}`
      );
    }
  }
  if (exp.prepNull && result.prepFailureClause != null) {
    errors.push(`prepFailureClause expected null, got ${result.prepFailureClause}`);
  }
  if (exp.insightIncludes && !result.insightParagraph.includes(exp.insightIncludes)) {
    errors.push(
      `insightParagraph missing "${exp.insightIncludes}": ${result.insightParagraph}`
    );
  }
  if (exp.prepExcludes && result.insightParagraph.includes(exp.prepExcludes)) {
    errors.push(
      `insightParagraph should not include "${exp.prepExcludes}": ${result.insightParagraph}`
    );
  }
  if (exp.insightExcludes && result.insightParagraph.includes(exp.insightExcludes)) {
    errors.push(
      `insightParagraph should not include "${exp.insightExcludes}": ${result.insightParagraph}`
    );
  }
  if (exp.outcomesIncludes && !result.outcomesMeta.includes(exp.outcomesIncludes)) {
    errors.push(`outcomesMeta missing "${exp.outcomesIncludes}": ${result.outcomesMeta}`);
  }
  if (result.insightParagraph.includes("Skill Diagnostic")) {
    errors.push("insightParagraph must not repeat Skill Diagnostic pitch");
  }
  if (result.insightParagraph.includes("Improvement Plan")) {
    errors.push("insightParagraph must not repeat Improvement Plan pitch");
  }
  const expectedSentences = 2;
  const sentenceCount = countInsightSentences(result.insightParagraph);
  if (sentenceCount !== expectedSentences) {
    errors.push(
      `insightParagraph must be exactly ${expectedSentences} sentences, got ${sentenceCount}: ${result.insightParagraph}`
    );
  }
  if (
    !result.insightParagraph.includes("pts per week") &&
    !result.insightParagraph.includes("steady weekly movement")
  ) {
    errors.push("insightParagraph must include weekly pace");
  }
  if (!result.insightParagraph.includes("100+ points in the first month")) {
    errors.push("insightParagraph must mention first-month movement");
  }
  if (result.insightParagraph.includes("once they fix")) {
    errors.push("insightParagraph must not list timing/content fixes");
  }
  if (result.insightParagraph.includes("You reported")) {
    errors.push("insightParagraph must not echo Q6 selections");
  }
  if (result.insightParagraph.includes("—")) {
    errors.push("insightParagraph must not use em dashes");
  }
  if (/last-test/i.test(result.insightParagraph)) {
    errors.push('insightParagraph must not use "last-test"');
  }

  return errors;
}

function assertQ6SolutionUnit(): string[] {
  const errors: string[] = [];
  for (const id of Q6_BLOCKER_ORDER) {
    const block = buildQ6SolutionBlock([id]);
    const root = Q6_ROOT_CAUSE[id];
    if (!block.includes(root.slice(0, 20))) {
      errors.push(`Q6 ${id}: block missing content-fix fragment`);
    }
    if (!block.includes("once they fix")) {
      errors.push(`Q6 ${id}: block must tie fixes to movement`);
    }
    if (block.includes("Skill Diagnostic") || block.includes("Improvement Plan")) {
      errors.push(`Q6 ${id}: block must not pitch diagnostic/plan`);
    }
  }
  const multi = buildQ6SolutionBlock(["math", "no-plan"]);
  if (countInsightSentences(multi) !== 1) {
    errors.push(`multi Q6 block must be 1 sentence, got ${countInsightSentences(multi)}`);
  }
  if (multi.includes("You reported")) {
    errors.push("multi Q6 block must not echo Q6 selections");
  }
  if (!multi.includes(Q6_ROOT_CLAUSE.math.slice(0, 12))) {
    errors.push("multi Q6 missing math content fix");
  }
  if (!multi.includes("calculator pacing")) {
    errors.push("multi Q6 missing timing fix");
  }
  return errors;
}

function assertSkillInsightUnit(): string[] {
  const errors: string[] = [];
  const math = buildSkillInsight(["math"]);
  if (math.skillSubject !== "Math") errors.push("buildSkillInsight(['math']) subject");
  const behavioral = buildSkillInsight(["no-plan"]);
  if (behavioral.skillSubject !== null) errors.push("buildSkillInsight(['no-plan']) should be null subject");
  if (behavioral.skillDetail.includes("Algebra")) {
    errors.push("behavioral insight must not mention Algebra");
  }
  const generic = buildSkillInsight([]);
  if (!generic.skillDetail.includes("Skill Diagnostic ranks")) {
    errors.push("generic insight should mention Skill Diagnostic ranks");
  }
  return errors;
}

const ALL = [
  ...Q6_CASES,
  ...Q2_CASES,
  ...SCORE_CASES,
  ...Q7_CASES,
  ...GPA_CASES,
];
let failed = 0;

for (const err of assertTierScalingUnit()) {
  console.error(`✗ tier-scale: ${err}`);
  failed++;
}

for (const err of assertQ6SolutionUnit()) {
  console.error(`✗ q6-solution: ${err}`);
  failed++;
}

for (const err of assertSkillInsightUnit()) {
  console.error(`✗ unit: ${err}`);
  failed++;
}

for (const testCase of ALL) {
  const errors = assertCase(testCase);
  if (errors.length) {
    failed++;
    console.error(`✗ ${testCase.name}`);
    for (const e of errors) console.error(`    ${e}`);
  } else {
    console.log(`✓ ${testCase.name}`);
  }
}

if (failed) {
  console.error(`\n${failed} achievability check(s) failed.`);
  process.exit(1);
}

console.log(`\nOK: ${ALL.length + 1} achievability variants passed.`);
