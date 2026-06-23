/**
 * SAT Landing v4 copy — ported verbatim from the offline design
 * (growth/lp-designs/sat-landing-v4.standalone.html).
 *
 * NOTE: kept verbatim per owner decision. Some claims are not backed by
 * `lib/site.ts` and are flagged in growth/lp-designs/README.md:
 *   - trust bar "500+ families helped" / "4.8 avg parent rating"
 *   - authority line "Backed by College Board data from 250,000+ students."
 * `+182 avg pts` is backed (n=95).
 */

/** Default v4 hero headline — two lines, fold-tested (shown when no ad hook). */
export const v4Headline = {
  lines: ["Your child has good grades.", "So why a low SAT score?"],
  /** index of the line rendered in the accent color */
  accentLine: 1
} as const;

export const v4Authority = "Backed by College Board data from 250,000+ students.";

export const v4Cta = {
  intro: "Your free SAT plan shows:",
  bullets: [
    "Why smart students struggle on the SAT",
    "If 150\u2013200+ points is realistic before their next test",
    "What their SAT improvement plan looks like between now and test day"
  ],
  button: "Build my child\u2019s free SAT plan",
  finePrint: "Takes about 2 minutes. No student required."
} as const;

/** Plan Builder B lab LP — free 1:1 lesson offer (not Strategy Call / improvement plan). */
export const v4PlanBCta = {
  intro: "Your free 1:1 SAT lesson includes:",
  bullets: [
    "A mentor walks through their personalized weekly plan",
    "The first skills holding their score back",
    "What to work on before their next test"
  ],
  button: "Claim my child\u2019s free SAT lesson",
  finePrint: "About 2 minutes to claim. No payment required."
} as const;

export const v4TrustStats = [
  { value: "+182", unit: "avg pts", em: true, label: "After Following a 12-Week Plan" },
  { value: "500+", unit: null, em: false, label: "Families helped" },
  { value: "4.8", unit: null, star: true, em: true, label: "Avg parent rating" }
] as const;

/** Tutor-hook LP (`hook=tutor`) — message-match with ad3 CTA bullets. */
export const v4TutorCta = {
  intro: "Your free SAT Improvement Plan shows:",
  bullets: [
    "Why smart kids struggle on the SAT",
    "What score is achievable by test day",
    "Which skills to focus on and their plan through test day"
  ],
  button: "Build my child\u2019s free SAT plan",
  finePrint: "Takes about 2 minutes. No student required."
} as const;

/** Nav trust — not in `lib/site.ts`; matches v4 trust bar claim. */
export const v4NavParentRating = {
  value: "4.8",
  numeric: 4.8,
  /** Visual fill on the 5th star (slightly under literal 80% for 4.8). */
  partialStarFill: 0.65,
  label: "Avg parent rating"
} as const;

export type V4PlanBuilderTestimonial = {
  quote: string;
  byline: string;
};

/** Plan-builder social proof — tutor LP trust bar (desktop shows all three). */
export const v4TutorPlanTestimonials: readonly V4PlanBuilderTestimonial[] = [
  {
    quote:
      "It gives us confidence seeing where she is and what can actually be targeted. With other programs we were so much in the blind.",
    byline: "Nada N., parent · after plan review"
  },
  {
    quote:
      "The diagnostic and plan showed what to focus on first. Started below 1100 and moved past 1380.",
    byline: "Ethan T., student"
  },
  {
    quote:
      "We tried Khan and a group course first. She's up 190 points from her diagnostic.",
    byline: "Priya M., parent · Atlanta"
  }
] as const;
