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
    "*Requires diagnostic assessment. SAT plans built by vetted tutors. Restrictions apply.",
  reviews:
    "Before/after scores shared by parents. Results not independently verified. Individual results vary.",
  footer:
    "SAT and PSAT are trademarks of the College Board, which is not affiliated with this site. Individual results vary."
} as const;

/** Quiz artifact name — timed Skill Diagnostic is separate (after Strategy Call). */
export const scorePathProduct = {
  name: "SAT Score Path",
  duration: "~2 minutes",
  trust: "Free · no account · no payment"
} as const;

export const landingShared = {
  heroCtaLabel: "See their Score Path",
  inlineCtaLabel: "See their Score Path",
  includedTitle: "What's included",
  includedItems: [
    `Diagnostic across ${KHAN_SAT_SKILL_COUNT_LABEL} skill areas`,
    "Personalized weekly SAT plan",
    "1:1 vetted SAT tutor",
    "Weekly progress dashboard",
    "Unlimited tutor messaging",
    "100% online"
  ],
  science: {
    title: "Diagnostic-driven plan",
    p1: satBreadthVsFocusLine(),
    p2: "We diagnose them. Then we drill them — with a personalized weekly plan, not endless tutoring."
  },
  greatNews: {
    titleMuted: "Good news:",
    titleRest: "a stronger score is in your child's future.",
    lead: "Find the right plan for your child — built by a vetted SAT tutor.",
    overlay: "Explore SAT plans through Illuminairy",
    pillCta: "Start Illuminairy →"
  },
  reviews: {
    title: "Parents are seeing the score jump."
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Take the assessment",
        desc: "GPA, target score, prior tutoring.",
        time: "~2 min"
      },
      {
        title: "Skill diagnostic",
        desc: "Map the 5 gaps costing points.",
        time: "Instant"
      },
      {
        title: "Get your plan",
        desc: "Built around the gaps that matter.",
        time: "Same day"
      },
      {
        title: "1:1 tutor + support",
        desc: "Weekly sessions. Text in between.",
        time: "Weekly"
      }
    ]
  },
  finalCta: {
    title: "Your child's score, their plan, their pace.",
    checklist: [
      `Fix the gaps. ${notAllKhanSkillsTitleCase()}.`,
      "Personalized by a vetted tutor",
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
      "A realistic score path for their next test date",
      "The 5 skill gaps most likely costing points",
      `What to focus on first—${notAllKhanSkillsPhrase()}`
    ],
    ctaCopy: `Answer a few questions about your child. In ${scorePathProduct.duration} you'll see their personalized ${scorePathProduct.name}—${scorePathProduct.trust}.`,
    disclaimer: landingDisclaimers.heroResults
  },
  /** B3b — Results: social proof, “could this work for them?” */
  "b3b-results": {
    headline: ["+182 points.", "On a focused path.", "Could it work for them?"],
    accentLine: 0,
    checklist: [
      `${b3bGainMultiple}× the College Board avg gain on completed plans*`,
      `${satProgramOutcomes.targetHitRatePct}% of students hit their target score band`,
      `Free ${scorePathProduct.name} preview—before any call`
    ],
    ctaCopy: `In ${scorePathProduct.duration}, see whether a +${satProgramOutcomes.avgPointsGained} pt path fits their test date and starting score.`,
    stats: [
      { num: `${satProgramOutcomes.plansBuiltCount}+`, lbl: "PATHS BUILT" },
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
      "A score path built on",
      `${satRetakeResearch.cohortSizeLabel} student scores.`
    ],
    accentLine: 1,
    checklist: [
      "Grounded in public College Board score trends",
      "Personalized to their test date—not one-size-fits-all advice",
      `${scorePathProduct.duration} · ${scorePathProduct.trust}`
    ],
    ctaCopy: `Answer a few questions—we'll map their ${scorePathProduct.name} from the same data. ${scorePathProduct.duration}, free.`,
    disclaimer: landingDisclaimers.heroAuthority
  }
} as const;

export type HeroVariant = keyof typeof landingHeroes;
