import { satProgramOutcomes, satRetakeResearch } from "@/lib/site";
import {
  FOCUS_SKILL_COUNT,
  KHAN_SAT_SKILL_COUNT_LABEL,
  notAllKhanSkillsPhrase,
  notAllKhanSkillsTitleCase,
  satBreadthVsFocusLine,
} from "@/lib/sat-skills-copy";

export type LandingSectionId =
  | "hero"
  | "science"
  | "great_news"
  | "included"
  | "reviews"
  | "how_it_works"
  | "final_cta"
  | "footer";

export type LandingReview = {
  before: string;
  after: string;
  months: number;
  quote: string;
  name: string;
  initials: string;
};

export const landingDisclaimers = {
  heroResults:
    "*Based on average gains across the last 95 completed plans. Individual results vary.",
  heroAuthority:
    "*Aggregate score-improvement data from public College Board reports.",
  greatNews:
    "*Requires Skill Diagnostic after Strategy Call. Plans built from diagnostic data. Restrictions apply.",
  reviews:
    "Before/after scores shared by parents. Results not independently verified. Individual results vary.",
  footer:
    "SAT and PSAT are trademarks of the College Board, which is not affiliated with this site. Individual results vary."
} as const;

/** Plan Builder entry product — Skill Diagnostic is a separate proctored step. */
export const improvementPlanProduct = {
  name: "SAT Improvement Plan",
  duration: "~2 minutes",
  trust: "Free · for parents · no test for your child"
} as const;

/** @deprecated Use improvementPlanProduct */
export const scorePathProduct = improvementPlanProduct;

export const landingShared = {
  heroCtaLabel: "Get their improvement plan",
  inlineCtaLabel: "Get their improvement plan",
  includedTitle: "What's included",
  includedItems: [
    `Skill Diagnostic maps ${KHAN_SAT_SKILL_COUNT_LABEL} skill areas`,
    "Personalized weekly SAT plan",
    "Mistake-driven work on their weakest skills",
    "Weekly parent update",
    "SAT advisor support",
    "100% online"
  ],
  science: {
    title: "Diagnostic-driven plan",
    p1: satBreadthVsFocusLine(),
    p2: "We diagnose them. Then we drill the right skills — with a personalized weekly plan, not endless review."
  },
  greatNews: {
    titleMuted: "Good news:",
    titleRest: "a stronger score is in your child's future.",
    lead: "See if a focused path fits your child — built from their scores and timeline.",
    overlay: "Get their improvement plan",
    pillCta: "Start the Plan Builder →"
  },
  reviews: {
    title: "Parents are seeing real score movement."
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Answer a few questions",
        desc: "For parents — GPA, target score, timeline. Your child doesn't take a test.",
        time: "~2 min"
      },
      {
        title: "SAT Strategy Call",
        desc: "Free 15 min — confirm targets and schedule Week 1.",
        time: "15 min"
      },
      {
        title: "Skill Diagnostic",
        desc: "Proctored exam finds the 5–6 skills that move their score.",
        time: "After call"
      },
      {
        title: "Personalized weekly plan",
        desc: "Built from diagnostic results — weekly skill focus in order.",
        time: "Ongoing"
      }
    ]
  },
  finalCta: {
    title: "Your child's score, their plan, their pace.",
    checklist: [
      `Fix the gaps. ${notAllKhanSkillsTitleCase()}.`,
      "Built around the 5–6 skills that move their score",
      "100% online — no office required"
    ]
  },
  footer: {
    head: "Get the latest from Illuminairy"
  }
} as const;

export const landingReviews: LandingReview[] = [
  {
    before: "1180",
    after: "1410",
    months: 3,
    quote: "+230 points. The diagnostic was the difference.",
    name: "David D.",
    initials: "D"
  },
  {
    before: "1080",
    after: "1290",
    months: 3,
    quote:
      "Khan and a group class missed the speed problem. Illuminairy did not.",
    name: "Priya S.",
    initials: "P"
  },
  {
    before: "1240",
    after: "1430",
    months: 3,
    quote: "A plan that ends. That mattered. +190 points.",
    name: "Tom B.",
    initials: "T"
  }
];

const b3bGainMultiple = (
  satProgramOutcomes.avgPointsGained /
  satRetakeResearch.avgPointsWithoutNewApproach
).toFixed(1);

export const landingHeroes = {
  /** B3a — Problem / empathy: GPA–SAT gap, parent relief */
  "b3a-problem": {
    headline: ["High GPA.", "Low SAT.", "Fixable."],
    accentLine: 2,
    checklist: [
      "A realistic improvement path for their next test date",
      "The 5 skill gaps most likely costing points",
      `What to focus on first—${notAllKhanSkillsPhrase()}`
    ],
    ctaCopy: `Answer a few questions about your child. In ${improvementPlanProduct.duration} you'll get their ${improvementPlanProduct.name} with a free score projection — ${improvementPlanProduct.trust}.`,
    disclaimer: landingDisclaimers.heroResults
  },
  /** B3b — Results: social proof, “could this work for them?” */
  "b3b-results": {
    headline: ["+182 points.", "On a focused path.", "Could it work for them?"],
    accentLine: 0,
    checklist: [
      `${b3bGainMultiple}× the College Board avg gain on completed plans*`,
      `${satProgramOutcomes.targetHitRatePct}% of students hit their target score band`,
      `Free ${improvementPlanProduct.name} with score projection — before any call`
    ],
    ctaCopy: `In ${improvementPlanProduct.duration}, see whether a +${satProgramOutcomes.avgPointsGained} pt path fits their test date and starting score.`,
    stats: [
      { num: `${satProgramOutcomes.plansBuiltCount}+`, lbl: "PLANS BUILT" },
      {
        num: String(satProgramOutcomes.avgPointsGained),
        lbl: "AVG PTS",
        accent: true
      },
      { num: `${satProgramOutcomes.targetHitRatePct}%`, lbl: "HIT TARGET" }
    ],
    disclaimer: "*Across last 95 completed plans. Individual results vary."
  },
  /** B3c — Authority: College Board scale, data-backed path */
  "b3c-authority": {
    eyebrow: "BUILT ON COLLEGE BOARD DATA",
    headline: [
      "An improvement path built on",
      `${satRetakeResearch.cohortSizeLabel} student scores.`
    ],
    accentLine: 1,
    checklist: [
      "Grounded in public College Board score trends",
      "Personalized to their test date—not one-size-fits-all advice",
      `${improvementPlanProduct.duration} · ${improvementPlanProduct.trust}`
    ],
    ctaCopy: `Answer a few questions — we'll build their ${improvementPlanProduct.name} from the same data. ${improvementPlanProduct.duration}, free.`,
    disclaimer: landingDisclaimers.heroAuthority
  }
} as const;

export type HeroVariant = keyof typeof landingHeroes;
