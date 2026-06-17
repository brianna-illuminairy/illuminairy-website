import { satProgramOutcomes } from "@/lib/site";

export type PostCallSalesPageType =
  | "diagnostic_only"
  | "diagnostic_plus_weekly";

export type PostCallSalesPageConfig = {
  pageType: PostCallSalesPageType;
  slug: string;
  eyebrow: string;
  headline: string;
  subcopy: string;
  stripeLink: string;
  paymentLines: string[];
  fitLine: string;
  ctaLabel: string;
  included: string[];
  testimonials: Array<{
    quote: string;
    byline: string;
  }>;
};

const proofLine = `Across ${satProgramOutcomes.plansBuiltCount} completed plans, students improved by +${satProgramOutcomes.avgPointsGained} points on average. ${satProgramOutcomes.varyDisclaimer}`;

export const postCallSalesPages: Record<
  PostCallSalesPageType,
  PostCallSalesPageConfig
> = {
  diagnostic_only: {
    pageType: "diagnostic_only",
    slug: "diagnostic-only",
    eyebrow: "Post-call next step",
    headline: "Lock in your student's Skill Diagnostic",
    subcopy:
      "You already completed the SAT Strategy Call. This is the step that turns the plan into exact weekly priorities.",
    stripeLink: "https://buy.stripe.com/cNi3co9LS315apScBjc7u03",
    paymentLines: [
      "Today: $249 for the Skill Diagnostic.",
      "Weekly tutoring cadence and pricing are finalized after your diagnostic review."
    ],
    fitLine:
      "If your student needs a higher weekly cadence, we confirm that recommendation before tutoring starts.",
    ctaLabel: "Pay $249 and reserve diagnostic",
    included: [
      "Proctored Skill Diagnostic (Part 1 + Part 2)",
      "Diagnostic results review with an SAT advisor",
      "Recommended weekly tutoring cadence based on diagnostic results",
      "Personalized weekly plan kickoff"
    ],
    testimonials: [
      {
        quote:
          "We wanted evidence before committing to weekly tutoring. The diagnostic made the path clear and specific.",
        byline: "Parent of a junior"
      },
      {
        quote:
          "The first useful step was seeing exactly what she kept missing. That gave us confidence in what to do next.",
        byline: "Parent of a senior"
      }
    ]
  },
  diagnostic_plus_weekly: {
    pageType: "diagnostic_plus_weekly",
    slug: "diagnostic-plus-weekly",
    eyebrow: "Post-call next step",
    headline: "Start now: Skill Diagnostic + weekly tutoring baseline",
    subcopy:
      "Built for families ready to start immediately after the SAT Strategy Call.",
    stripeLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01",
    paymentLines: [
      "Today: $249 for the Skill Diagnostic.",
      "Then: $99/week starts 7 days later (2 sessions/week baseline)."
    ],
    fitLine:
      "If diagnostic results show your student needs a different weekly cadence, we confirm that recommendation in the review.",
    ctaLabel: "Start with $249 today",
    included: [
      "Proctored Skill Diagnostic (Part 1 + Part 2)",
      "Diagnostic review and weekly plan kickoff",
      "Twice-weekly SAT tutoring baseline",
      "Weekly parent progress visibility"
    ],
    testimonials: [
      {
        quote:
          "Starting right away helped us keep momentum from the call. The weekly rhythm made it easier to stay consistent.",
        byline: "Parent of a junior"
      },
      {
        quote:
          "The structure removed guesswork. We knew what happened each week and where support was needed.",
        byline: "Parent of a junior"
      }
    ]
  }
};

export function getPostCallSalesPage(
  pageType: PostCallSalesPageType
): PostCallSalesPageConfig {
  return postCallSalesPages[pageType];
}

export const postCallRoutingRubric = {
  sendDiagnosticPlusWeeklyWhen: [
    "Parent is ready to start immediately.",
    "Student fit looks standard for baseline 2 sessions/week.",
    "No unresolved fit or timeline uncertainty came up on the call."
  ],
  sendDiagnosticOnlyWhen: [
    "Score gap or timeline appears aggressive.",
    "Parent wants diagnostic evidence before committing to weekly billing.",
    "You expect cadence could be 3 or 4 sessions/week.",
    "Parent asked to evaluate options first and needs a lower-friction first yes."
  ]
} as const;

export type PostCallFollowUpTemplate = {
  touchNumber: 1 | 2 | 3;
  timing: string;
  message: string;
};

export function buildPostCallFollowUpTemplates(
  pageLink: string
): PostCallFollowUpTemplate[] {
  return [
    {
      touchNumber: 1,
      timing: "Same day, ideally within 2 hours",
      message: `Thanks again for the call today. Here is the next step we discussed: ${pageLink}. This secures your student's Skill Diagnostic so we can confirm the right weekly plan.`
    },
    {
      touchNumber: 2,
      timing: "24 hours",
      message: `Quick follow-up from yesterday. Based on what you shared about [insert call-specific goal], this link is still the fastest next step: ${pageLink}.`
    },
    {
      touchNumber: 3,
      timing: "72 hours",
      message: `Wanted to close the loop. If you want to move forward, here is the link: ${pageLink}. If timing changed, reply and I will adjust the plan with you.`
    }
  ];
}

export const postCallProofLine = proofLine;
