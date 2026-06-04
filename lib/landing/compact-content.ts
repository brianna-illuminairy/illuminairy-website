import {
  landingDisclaimers,
  landingHero,
  landingParentChecklist,
  landingShared
} from "@/lib/landing/content";

/** Compact LP — cold DR: hero + short proof + 2 steps. */
export const landingCompact = {
  why: {
    title: landingHero.checklistIntro,
    bullets: [...landingParentChecklist]
  },
  proof: {
    line: landingDisclaimers.heroResults
  },
  howItWorks: {
    title: "How the free plan works",
    subhead: "Free. Parent only. Your child does not take a test here.",
    steps: [
      {
        stepNum: "01",
        title: "Answer a few questions",
        desc: "GPA, last SAT, fall test date, what they already tried.",
        time: "~2 min",
        slotLabel: "lp-step-assessment.jpg"
      },
      {
        stepNum: "02",
        title: "Get the Improvement Plan",
        desc: "Why their score is stuck, a realistic range for their date, and what to focus on first.",
        time: "Instant",
        slotLabel: "lp-step-strategy-call.jpg"
      }
    ]
  },
  finalCta: landingShared.finalCta
} as const;
