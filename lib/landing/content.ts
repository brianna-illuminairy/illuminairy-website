import { satProgramOutcomes, satTypicalStudentScoreBands } from "@/lib/site";
import { satBreadthVsFocusLine } from "@/lib/sat-skills-copy";

export type LandingSectionId =
  | "hero"
  | "nav"
  | "science"
  | "great_news"
  | "included"
  | "reviews"
  | "how_it_works"
  | "final_cta"
  | "footer"
  | "why"
  | "proof"
  | "compact_how_it_works"
  | "sticky_cta"
  | "trust_bar";

export type LandingReview = {
  before: string;
  after: string;
  months: number;
  quote: string;
  name: string;
  initials: string;
};

export const landingDisclaimers = {
  heroResults: `Students who completed our ${satProgramOutcomes.programWeeks}-week program averaged +${satProgramOutcomes.avgPointsGained} points (n=${satProgramOutcomes.plansBuiltCount}). ${satProgramOutcomes.varyDisclaimer}`,
  greatNews:
    "Numbers in the free plan are illustrative until a Strategy Call and Skill Diagnostic. Individual results vary.",
  reviews:
    "Before/after scores shared by parents. Results not independently verified. Individual results vary.",
  footer:
    "SAT and PSAT are trademarks of the College Board, which is not affiliated with this site. Individual results vary."
} as const;

/** Plan Builder entry — Skill Diagnostic is a separate proctored step. */
export const improvementPlanProduct = {
  name: "SAT Improvement Plan",
  builderName: "SAT Plan Builder",
  duration: "about 2 minutes",
  trust: "Free · parent only · your child does not take a test here"
} as const;

/** @deprecated Use improvementPlanProduct */
export const scorePathProduct = improvementPlanProduct;

export const landingCta = {
  hero: "Build their free SAT Improvement Plan",
  inline: "Build their free SAT Improvement Plan",
  sticky: "Get their free plan"
} as const;

/** Cold DR: outcomes parents came for (not program mechanics). */
export const landingParentChecklist = [
  "Why their last SAT score is stuck (even with good grades)",
  "Whether more Khan / Bluebook will actually move the official score",
  "What score is realistic before August, September, or October",
  "Whether 150–200+ points is still possible before applications",
  "What to study first so the fall retake is not the same result"
] as const;

export const landingHero = {
  subhead: satTypicalStudentScoreBands.summaryLine,
  /** Below CTA only — not lead copy. */
  finePrint: "Free for parents · about 2 minutes · no test for your child.",
  checklistIntro: "You'll see:",
  checklist: landingParentChecklist,
  ctaCopy:
    "Answer a few questions about your child. We show you why their score is stuck, what's realistic before their next test, and what to focus on first.",
  disclaimer: landingDisclaimers.heroResults
} as const;

export const landingShared = {
  heroCtaLabel: landingCta.hero,
  inlineCtaLabel: landingCta.inline,
  stickyCtaLabel: landingCta.sticky,
  whatItIs: {
    title: "What this is",
    lead: `A free ${improvementPlanProduct.builderName} (${improvementPlanProduct.duration}, ${improvementPlanProduct.trust}).`,
    deliverable:
      "You tell us their GPA, last SAT score, next test date, and what they've already tried. We build a free SAT Improvement Plan: why the last SAT likely struggled, a score projection for their fall date, and what to focus on so study time is not wasted on the whole test.",
    after:
      "If you want help after that, a free SAT Strategy Call leads to a Skill Diagnostic that ranks the 5–6 skills on their real misses. Nothing to buy to get the free plan."
  },
  science: {
    title: "More practice tests are not the missing piece",
    p1: satBreadthVsFocusLine(),
    p2: "Most families need to know which few skills will move the score fastest, not another month on everything on the test. The free plan starts there."
  },
  greatNews: {
    title: "What you get free in about 2 minutes",
    lead: "Why their score is stuck. A realistic range for their fall SAT date. What to focus on first. Clear next steps if you want them.",
    overlay: landingCta.inline,
    pillCta: landingCta.inline
  },
  includedTitle: "Optional after the free plan",
  includedItems: [
    "Free 15-minute SAT Strategy Call: schools, targets, timeline",
    "Skill Diagnostic ranks the 5–6 skills that matter on their real misses",
    "Tutoring works those skills in order",
    "Weekly parent update",
    "100% online"
  ],
  reviews: {
    title: "Scores parents shared after focusing on ranked skills"
  },
  howItWorks: {
    title: "How the free plan works",
    steps: [
      {
        title: "Answer parent questions",
        desc: "GPA, last SAT, test date, what they tried. Your child does not take a test on this page.",
        time: "~2 min"
      },
      {
        title: "Get the Improvement Plan",
        desc: "Score projection for their fall date, why the last SAT struggled, and what to focus on first.",
        time: "Instant"
      },
      {
        title: "Optional: Strategy Call",
        desc: "Free 15 minutes if you want help booking the Skill Diagnostic and confirming targets.",
        time: "15 min"
      },
      {
        title: "Optional: Skill Diagnostic",
        desc: "Proctored exam ranks the 5–6 highest-impact skills on their real SAT misses.",
        time: "After call"
      }
    ]
  },
  finalCta: {
    title: "See what's realistic before their fall SAT",
    checklist: [
      "Free · parent only · about 2 minutes",
      "No test for your child on this page",
      "Why stuck · realistic score · what to study first"
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
    quote: "+230 points. We finally knew which skills to work.",
    name: "David D.",
    initials: "D"
  },
  {
    before: "1080",
    after: "1290",
    months: 3,
    quote:
      "Khan and a group class did not fix timing. Focusing on ranked skills did.",
    name: "Priya S.",
    initials: "P"
  },
  {
    before: "1240",
    after: "1430",
    months: 3,
    quote: "We had a realistic target for October. +190 points.",
    name: "Tom B.",
    initials: "T"
  }
];

/** @deprecated PostHog may still bucket variants; UI uses unified `landingHero`. */
export const landingHeroes = {
  "b3a-problem": landingHero,
  "b3b-results": landingHero,
  "b3c-authority": landingHero
} as const;

export type HeroVariant = keyof typeof landingHeroes;
