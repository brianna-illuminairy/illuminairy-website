import {
  PREP_OPTIONS,
  PREP_SELF_STUDY_IDS,
  normalizePrepMethods,
  type PrepId
} from "@/lib/sat-plan-funnel/prep-options";
import type { PrepContrastPair } from "@/lib/sat-plan-funnel/prep-path-images";
import { prepContrastPairAvailable } from "@/lib/sat-plan-funnel/prep-path-images";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import {
  guidedGapOverGroupClassPoints,
  guidedGapOverSelfStudyPoints,
  satPrepComparison,
  satProgramOutcomes,
  satRetakeResearch
} from "@/lib/site";

type PrepVoice = {
  subject: string;
  possessive: string;
  isSelf: boolean;
};

type PrepMirrorScope = "self_study" | "group" | "all";

function prepVoice(testTaker?: string): PrepVoice {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her", isSelf: false };
    case "test_taker_son":
      return { subject: "he", possessive: "his", isSelf: false };
    case "test_taker_self":
      return { subject: "you", possessive: "your", isSelf: true };
    default:
      return { subject: "they", possessive: "their", isSelf: false };
  }
}

function objectForVoice(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "her";
    case "test_taker_son":
      return "him";
    case "test_taker_self":
      return "you";
    default:
      return "them";
  }
}

function formatPrepLabels(prepIds: PrepId[]): string | null {
  if (prepIds.length === 0) return null;

  const labels = prepIds
    .map((id) => PREP_OPTIONS.find((opt) => opt.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  if (labels.length === 0) return null;
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;

  const last = labels[labels.length - 1];
  return `${labels.slice(0, -1).join(", ")}, and ${last}`;
}

function prepMirrorScope(prepIds: PrepId[]): PrepMirrorScope {
  const hasGroup = prepIds.includes("prep_class");
  const hasSelfStudy = prepIds.some((id) => PREP_SELF_STUDY_IDS.has(id));

  if (hasSelfStudy && !hasGroup) return "self_study";
  if (hasGroup && !hasSelfStudy) return "group";
  return "all";
}

function selfStudySentence(voice: PrepVoice, object: string): string {
  if (voice.isSelf) {
    return "Self-study requires you to know why you're struggling and teach yourself without support when you get stuck.";
  }

  if (voice.subject === "he") {
    return "Self-study requires him to know why he's struggling and teach himself without support when he gets stuck.";
  }
  if (voice.subject === "she") {
    return "Self-study requires her to know why she's struggling and teach herself without support when she gets stuck.";
  }

  return "Self-study requires them to know why they're struggling and teach themselves without support when they get stuck.";
}

/** Closing line for group-class plateau copy — topics he/she needs vs surface coverage. */
function groupClassSurfaceTail(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return ", and the topics your son needs, they likely never went deep enough on for him to actually learn.";
    case "test_taker_daughter":
      return ", and the topics your daughter needs, they likely never went deep enough on for her to actually learn.";
    case "test_taker_self":
      return ", and the topics you need, you likely never went deep enough on them to actually learn.";
    case "test_taker_other":
    default:
      return ", and the topics they need, they likely never went deep enough on for them to actually learn.";
  }
}

function groupClassPlateauShortCopy(testTaker?: string): string {
  const tail = groupClassSurfaceTail(testTaker);
  return `The SAT spans years of math and reading. Most group courses touch every topic at a surface level${tail}`;
}

function contrastPairForPlateau(scope: PrepMirrorScope): PrepContrastPair | null {
  if (scope === "self_study") return "home";
  if (scope === "group") return "crowd";
  return null;
}

function triptychFocusForPlateau(scope: PrepMirrorScope): Int8PrepPathTriptychFocus {
  if (scope === "self_study") return "home";
  if (scope === "group") return "crowd";
  return "full";
}

function groupClassPlateauCopy(testTaker?: string): string {
  const tail = groupClassSurfaceTail(testTaker);
  const intro =
    "Group class is a common choice, but it is rarely the most effective way to prepare for the SAT. The class runs the same lesson for everyone, while the SAT spans years of math and reading.";
  return `${intro} Most courses touch every topic at a surface level${tail}`;
}

const BLOOM_TWO_SIGMA_COPY =
  "Bloom's research compared 1:1 tutoring to classroom teaching and found tutored students pulled ahead by two standard deviations. That is one of the largest effects in education research.";

function proofAfterChartCopy(): string {
  const retakeAvg = satRetakeResearch.avgPointsWithoutNewApproach;
  const guidedAvg = satProgramOutcomes.avgPointsGained;
  const gap = guidedGapOverSelfStudyPoints();

  return `College Board reports the average student only gains ${retakeAvg} points between retakes, while Illuminairy's students gain on average ${guidedAvg} points between retakes, that's ${gap} pts higher than self-study.`;
}

const SAT_SKILL_AREA_COUNT = 28;
const SCORE_IMPACT_SKIPPED_COUNT = 23;

const ILLUSTRATIVE_SCORE_IMPACT_ROWS = [
  { rank: "01", label: "Right triangles & trigonometry", points: 38 },
  { rank: "02", label: "Linear functions", points: 34 },
  { rank: "03", label: "Boundaries (punctuation)", points: 32 },
  { rank: "04", label: "Systems of linear equations", points: 28 },
  { rank: "05", label: "Transitions", points: 24 }
] as const;

function guidedHeadlineCopy(): string {
  return "What actually works";
}

function guidedSubheadCopy(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return "A personalized SAT improvement plan focused on the few skills that will raise his score the fastest, prioritizing the highest-impact areas first.";
    case "test_taker_daughter":
      return "A personalized SAT improvement plan focused on the few skills that will raise her score the fastest, prioritizing the highest-impact areas first.";
    case "test_taker_self":
      return "A personalized SAT improvement plan focused on the few skills that will raise your score the fastest, prioritizing the highest-impact areas first.";
    case "test_taker_other":
    default:
      return "A personalized SAT improvement plan focused on the few skills that will raise their score the fastest, prioritizing the highest-impact areas first.";
  }
}

function guidedIntroCopy(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return `The digital SAT tests ${SAT_SKILL_AREA_COUNT} distinct skill areas. Your son does not need to drill all of them — just the ones that are costing him the most points.`;
    case "test_taker_daughter":
      return `The digital SAT tests ${SAT_SKILL_AREA_COUNT} distinct skill areas. Your daughter does not need to drill all of them — just the ones that are costing her the most points.`;
    case "test_taker_self":
      return `The digital SAT tests ${SAT_SKILL_AREA_COUNT} distinct skill areas. You do not need to drill all of them — just the ones that are costing you the most points.`;
    case "test_taker_other":
    default:
      return `The digital SAT tests ${SAT_SKILL_AREA_COUNT} distinct skill areas. They do not need to drill all of them — just the ones that are costing them the most points.`;
  }
}

function scoreImpactMapTitle(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return "His score impact map";
    case "test_taker_daughter":
      return "Her score impact map";
    case "test_taker_self":
      return "Your score impact map";
    case "test_taker_other":
    default:
      return "Score impact map";
  }
}

function buildScoreImpactMapCopy(testTaker?: string): Int8ScoreImpactMapCopy {
  const title = scoreImpactMapTitle(testTaker);
  return {
    title,
    rows: ILLUSTRATIVE_SCORE_IMPACT_ROWS.map((row) => ({ ...row })),
    skippedCount: SCORE_IMPACT_SKIPPED_COUNT,
    ariaLabel: `${title}. Example priority topics with illustrative point gains. ${SCORE_IMPACT_SKIPPED_COUNT} lower-priority areas skipped.`
  };
}

function guidedPlanCopy(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return "A tutor builds a plan around the specific topics your son needs to focus on and goes deep on what is most likely to move his score.";
    case "test_taker_daughter":
      return "A tutor builds a plan around the specific topics your daughter needs to focus on and goes deep on what is most likely to move her score.";
    case "test_taker_self":
      return "A tutor builds a plan around the specific topics you need to focus on and goes deep on what is most likely to move your score.";
    case "test_taker_other":
    default:
      return "A tutor builds a plan around the specific topics they need to focus on and goes deep on what is most likely to move their score.";
  }
}

function buildMirrorBody(
  scope: PrepMirrorScope,
  voice: PrepVoice,
  object: string,
  testTaker?: string
): string {
  const parts: string[] = [];

  if (scope === "self_study") {
    parts.push(selfStudySentence(voice, object));
  } else if (scope === "group") {
    parts.push(groupClassPlateauCopy(testTaker));
  } else {
    parts.push(selfStudySentence(voice, object), groupClassPlateauCopy(testTaker));
  }

  return parts.join(" ");
}

function buildAfterChartCopy(
  scope: PrepMirrorScope,
  testTaker?: string
): string {
  if (scope === "self_study") {
    return tutorProcessCopy(testTaker);
  }

  return guidedPlanCopy(testTaker);
}

function tutorProcessCopy(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return "A tutor works through the questions that your son missed, then has him work through them live. Once he knows it, the tutor assigns practice problems to reinforce the learning.";
    case "test_taker_daughter":
      return "A tutor works through the questions that your daughter missed, then has her work through them live. Once she knows it, the tutor assigns practice problems to reinforce the learning.";
    case "test_taker_self":
      return "A tutor works through the questions you missed, then has you work through them live. Once you know it, the tutor assigns practice problems to reinforce the learning.";
    case "test_taker_other":
    default:
      return "A tutor works through the questions they missed, then has them work through them live. Once they know it, the tutor assigns practice problems to reinforce the learning.";
  }
}

function prepLeadLabel(prepIds: PrepId[], scope: PrepMirrorScope): string | null {
  if (scope === "all" && prepIds.length === 1 && prepIds[0] === "prep_little_none") {
    return null;
  }
  if (scope === "all" && prepIds.length === 0) {
    return null;
  }

  if (scope === "self_study") {
    const selfIds = prepIds.filter((id) => PREP_SELF_STUDY_IDS.has(id));
    return formatPrepLabels(selfIds);
  }

  if (scope === "group") {
    return "Group class";
  }

  const meaningful = prepIds.filter((id) => id !== "prep_little_none");
  return formatPrepLabels(meaningful);
}

function neverTestedEyebrow(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return "Before your son starts";
    case "test_taker_daughter":
      return "Before your daughter starts";
    case "test_taker_self":
      return "Before you start";
    case "test_taker_other":
    default:
      return "Before they start";
  }
}

export type Int8ScoreImpactRow = {
  rank: string;
  label: string;
  points: number;
};

export type Int8ScoreImpactMapCopy = {
  title: string;
  rows: Int8ScoreImpactRow[];
  skippedCount: number;
  ariaLabel: string;
};

export type Int8PrepBeat = "plateau" | "proof" | "guided";

export type Int8PrepPathTriptychFocus = "full" | "home" | "crowd" | "mentorship";

export type Int8PrepComparisonCopy = {
  gapOverSelfStudy: number;
  gapOverGroupClass: number;
  eyebrow: string | null;
  prepLead: string | null;
  mirrorBody: string;
  showPrepPathsVisual: boolean;
  contrastPairPlateau: PrepContrastPair | null;
  triptychFocusPlateau: Int8PrepPathTriptychFocus | null;
  triptychFocusGuided: Int8PrepPathTriptychFocus | null;
  plateauFollowUp: string | null;
  chartTitle: string;
  proofBloomCopy: string;
  proofAfterChartCopy: string;
  tutorProcessCopy: string;
  plateauHeadline: string;
  proofHeadlineGap: number;
  guidedHeadline: string;
  guidedSubhead: string;
  guidedIntro: string;
  scoreImpactMap: Int8ScoreImpactMapCopy;
  selfStudyPoints: number;
  groupClassPoints: number;
  guidedPoints: number;
};

export function buildInt8PrepComparisonCopy(
  answers: SatPlanAnswers
): Int8PrepComparisonCopy {
  const voice = prepVoice(answers.test_taker);
  const object = objectForVoice(answers.test_taker);
  const prepIds = normalizePrepMethods(answers.prep_method);
  const scope = prepMirrorScope(prepIds);
  const gapOverSelfStudy = guidedGapOverSelfStudyPoints();
  const gapOverGroupClass = guidedGapOverGroupClassPoints();
  const neverTested = answers.test_history === "history_none";
  const hasGroupClass = prepIds.includes("prep_class");
  const hasSelfStudy = prepIds.some((id) => PREP_SELF_STUDY_IDS.has(id));
  const showPrepPathsVisual = hasGroupClass || hasSelfStudy;

  return {
    gapOverSelfStudy,
    gapOverGroupClass,
    eyebrow: neverTested ? neverTestedEyebrow(answers.test_taker) : null,
    prepLead: prepLeadLabel(prepIds, scope),
    mirrorBody: buildMirrorBody(scope, voice, object, answers.test_taker),
    showPrepPathsVisual,
    contrastPairPlateau: (() => {
      if (!showPrepPathsVisual) return null;
      const pair = contrastPairForPlateau(scope);
      if (!pair) return null;
      return prepContrastPairAvailable(pair, answers.test_taker) ? pair : null;
    })(),
    triptychFocusPlateau: (() => {
      if (!showPrepPathsVisual) return null;
      const pair = contrastPairForPlateau(scope);
      if (pair && prepContrastPairAvailable(pair, answers.test_taker)) {
        return null;
      }
      return triptychFocusForPlateau(scope);
    })(),
    triptychFocusGuided: showPrepPathsVisual ? "mentorship" : null,
    plateauFollowUp: hasGroupClass
      ? groupClassPlateauShortCopy(answers.test_taker)
      : null,
    chartTitle: satPrepComparison.bloomChartTitle,
    proofBloomCopy: BLOOM_TWO_SIGMA_COPY,
    proofAfterChartCopy: proofAfterChartCopy(),
    tutorProcessCopy: buildAfterChartCopy(scope, answers.test_taker),
    plateauHeadline: "That explains a lot.",
    proofHeadlineGap:
      scope === "self_study" ? gapOverSelfStudy : gapOverGroupClass,
    guidedHeadline: guidedHeadlineCopy(),
    guidedSubhead: guidedSubheadCopy(answers.test_taker),
    guidedIntro: guidedIntroCopy(answers.test_taker),
    scoreImpactMap: buildScoreImpactMapCopy(answers.test_taker),
    selfStudyPoints: satPrepComparison.selfStudyAvgPoints,
    groupClassPoints: satPrepComparison.groupClassIllustrativePoints,
    guidedPoints: satPrepComparison.guidedAvgPoints
  };
}
