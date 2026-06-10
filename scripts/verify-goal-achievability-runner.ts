/**
 * Achievability variant matrix — keep in sync with lib/quiz-funnel/goal-achievability.ts
 */
import {
  buildGoalAchievability,
  buildProjectedRangeLine,
  buildSkillInsight,
  computeFeasibilityTier,
  expectedGainForWeeks,
  tierFromFeasibilityPressure,
  tierFromPtsPerWeekScale,
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
import {
  stakesAchievabilityEmphasis,
  stakesAchievabilityLead,
  stakesGoalPhrase,
  type StakesId,
} from "@/lib/quiz-funnel/stakes-copy";
import {
  doubtsOptions,
  doubtsQuestionHtml,
} from "@/lib/quiz-funnel/doubts-copy";
import {
  scoreLowerOptionLabel,
  urgencyOptionLabel,
} from "@/lib/quiz-funnel/opening-copy";
import { stakesOptionLabel } from "@/lib/quiz-funnel/subject-voice";

const STAKES_IDS: StakesId[] = ["top-choice", "merit", "selective", "app-rounds"];

type Case = {
  name: string;
  answers: QuizAnswersLike;
  expect: {
    skillSubject?: string | null;
    skillDetailIncludes?: string;
    stakesIncludes?: string;
    tier?: string | string[];
    pointsIncludes?: string | string[];
    pointsExcludes?: string;
    prepIncludes?: string;
    prepNull?: boolean;
    outcomesIncludes?: string;
    insightIncludes?: string;
    startingNoteIncludes?: string;
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
    expect: { stakesIncludes: "help them get into their top-choice school" },
  },
  {
    name: "q2 selective",
    answers: { ...BASE, q2: "selective" },
    expect: { stakesIncludes: "stay competitive at selective colleges" },
  },
  {
    name: "q2 app-rounds",
    answers: { ...BASE, q2: "app-rounds" },
    expect: { stakesIncludes: "early application" },
  },
];

const SCORE_CASES: Case[] = [
  {
    name: "canonical 1100→1400 sept12 ambitious/aggressive (runway-dependent)",
    answers: BASE,
    expect: {
      tier: ["ambitious", "aggressive"],
      pointsIncludes: ["Sept 12", "+250"],
      outcomesIncludes: "1,500+",
      insightExcludes: "calculator pacing",
    },
  },
  {
    name: "small gap effortless",
    answers: { ...BASE, q4: "1300-1400", q8: "1350" },
    expect: { tier: "effortless" },
  },
  {
    name: "Danielle baseline — 1125 start, 11wk, 1400 goal → aggressive",
    answers: {
      q2: "selective",
      q3: "none",
      q4: "na",
      q5: "aug22",
      q8: "1400",
      q9: "3.3-3.5",
    },
    expect: { tier: ["aggressive", "extreme"] },
  },
  {
    name: "First sit 4.0+ GPA, Aug 22, 1450 goal → ambitious (not extreme)",
    answers: {
      q2: "selective",
      q3: "none",
      q4: "na",
      q5: "aug22",
      q6: ["reading"],
      q7: ["nothing"],
      q8: "1450",
      q9: "4.0+",
    },
    expect: { tier: "ambitious" },
  },
  {
    name: "GPA note on inferred start",
    answers: {
      q2: "selective",
      q3: "none",
      q4: "na",
      q5: "aug22",
      q8: "1400",
      q9: "4.0+",
    },
    expect: {
      tier: "realistic",
      startingNoteIncludes: "4.0+ GPA",
    },
  },
  {
    name: "q4 na + q8 tbd → inferred gap, dated headline",
    answers: { ...BASE, q3: "none", q4: "na", q8: "tbd" },
    expect: { pointsIncludes: ["Sept 12", "+"], tier: ["ambitious", "aggressive", "extreme"] },
  },
  {
    name: "q5 tbd only → over weeks not by date",
    answers: { ...BASE, q5: "tbd" },
    expect: { pointsIncludes: "in", pointsExcludes: "by Sept" },
  },
  {
    name: "q8 tbd merit inferred target",
    answers: { ...BASE, q8: "tbd", q2: "merit" },
    expect: { tier: ["ambitious", "aggressive"] },
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

  if (tierFromPtsPerWeekScale(1125, 1400, 11) !== "aggressive") {
    errors.push("Danielle baseline: 1125→1400 in 11wk should be aggressive");
  }
  if (tierFromPtsPerWeekScale(1250, 1450, 11) !== "ambitious") {
    errors.push("4.0+ first sit: 1250→1450 in 11wk should be ambitious");
  }
  if (tierFromPtsPerWeekScale(1350, 1400, 11) !== "effortless") {
    errors.push("small gap: 1350→1400 in 11wk should be effortless");
  }

  const rangeLine = buildProjectedRangeLine(1350, 11);
  if (rangeLine.includes("1680") || rangeLine.includes("1625")) {
    errors.push(`projected range must cap at 1600: ${rangeLine}`);
  }
  if (!rangeLine.includes("1600")) {
    errors.push(`projected range should hit 1600 cap for high band: ${rangeLine}`);
  }

  const smallGap = buildGoalAchievability({
    q2: "merit",
    q3: "sat-1",
    q4: "1300-1400",
    q5: "aug22",
    q6: ["math"],
    q7: [],
    q8: "1400",
    q9: "3.7-3.9",
  });
  if (smallGap.tier !== "effortless") {
    errors.push(`1350→1400 achievability tier: expected effortless, got ${smallGap.tier}`);
  }
  if (smallGap.stats.ptsPerWeek !== 5) {
    errors.push(`1350→1400 pts/wk: expected 5, got ${smallGap.stats.ptsPerWeek}`);
  }
  if (smallGap.tierIndex !== 0) {
    errors.push(`1350→1400 tierIndex: expected 0 (effortless), got ${smallGap.tierIndex}`);
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
  if (exp.tier) {
    const allowedTiers = Array.isArray(exp.tier) ? exp.tier : [exp.tier];
    if (!allowedTiers.includes(result.tier)) {
      errors.push(`tier: expected ${allowedTiers.join(" or ")}, got ${result.tier}`);
    }
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
  if (
    exp.startingNoteIncludes &&
    !(result.startingScoreNote ?? "").includes(exp.startingNoteIncludes)
  ) {
    errors.push(
      `startingScoreNote missing "${exp.startingNoteIncludes}": ${result.startingScoreNote}`
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
  if (result.insightParagraph.trim()) {
    if (result.insightParagraph.includes("Skill Diagnostic")) {
      errors.push("insightParagraph must not repeat Skill Diagnostic pitch");
    }
    if (result.insightParagraph.includes("Improvement Plan")) {
      errors.push("insightParagraph must not repeat Improvement Plan pitch");
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
  }
  if (result.insightParagraph.includes("high GPAs")) {
    errors.push("insightParagraph must not include GPA capability line");
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

function assertSubjectVoiceCopyUnit(): string[] {
  const errors: string[] = [];
  if (!doubtsQuestionHtml("self").includes("thought")) {
    errors.push("self doubts question should use first-person framing");
  }
  if (!doubtsQuestionHtml("child").includes("child")) {
    errors.push("child doubts question should reference child");
  }
  const childCantRaise = doubtsOptions("child").find((o) => o.id === "cant-raise");
  if (!childCantRaise?.label.startsWith("They")) {
    errors.push("child cant-raise option should be third person");
  }
  const selfCantRaise = doubtsOptions("self").find((o) => o.id === "cant-raise");
  if (!selfCantRaise?.label.startsWith("I")) {
    errors.push("self cant-raise option should be first person");
  }
  if (!urgencyOptionLabel("get-ahead", "self").includes("I need")) {
    errors.push("self urgency get-ahead should use I");
  }
  if (!urgencyOptionLabel("score-low", "child").includes("Their")) {
    errors.push("child urgency score-low should use Their");
  }
  if (!scoreLowerOptionLabel("planning-ahead", "self").includes("I'm")) {
    errors.push("self score-lower planning-ahead should use I'm");
  }
  const selfRange = buildProjectedRangeLine(1200, 10, "self");
  if (!selfRange.includes("your weakest")) {
    errors.push("self projected range should use your");
  }
  const childRange = buildProjectedRangeLine(1200, 10, "child");
  if (!childRange.includes("their weakest")) {
    errors.push("child projected range should use their");
  }
  return errors;
}

function assertStakesAlignmentUnit(): string[] {
  const errors: string[] = [];
  for (const qWho of ["child", "self"] as const) {
    for (const q2 of STAKES_IDS) {
      const lead = stakesAchievabilityLead(q2, qWho);
      const emphasis = stakesAchievabilityEmphasis(q2, qWho);
      const goal = stakesGoalPhrase(q2, qWho);
      const option = stakesOptionLabel(q2, qWho).toLowerCase();

      if (emphasis !== goal) {
        errors.push(`q2=${q2} qWho=${qWho}: emphasis must match goal phrase`);
      }
      if (!lead.includes(emphasis)) {
        errors.push(`q2=${q2} qWho=${qWho}: lead must contain emphasis`);
      }
      if (!lead.includes(goal)) {
        errors.push(`q2=${q2} qWho=${qWho}: lead must contain goal phrase`);
      }

      const assessment = buildGoalAchievability({ ...BASE, q2, qWho });
      if (assessment.stakesLead !== lead) {
        errors.push(`q2=${q2} qWho=${qWho}: buildGoalAchievability stakesLead drift`);
      }
      if (assessment.stakesEmphasis !== emphasis) {
        errors.push(`q2=${q2} qWho=${qWho}: buildGoalAchievability stakesEmphasis drift`);
      }

      const goalWords = goal.split(/\s+/).filter((w) => w.length > 3);
      const optionHits = goalWords.filter((w) => option.includes(w.replace(/[^a-z-]/gi, "")));
      if (optionHits.length < Math.min(2, goalWords.length)) {
        errors.push(`q2=${q2} qWho=${qWho}: reveal goal phrase diverges from Q2 option`);
      }
    }
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

for (const err of assertStakesAlignmentUnit()) {
  console.error(`✗ stakes-align: ${err}`);
  failed++;
}

for (const err of assertSubjectVoiceCopyUnit()) {
  console.error(`✗ subject-voice: ${err}`);
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
