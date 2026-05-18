/** SAT guide hub + funnel copy — SEO queries, parent language, conversion labels. */

import type { LeadMagnetSlug } from "@/lib/lead-magnets";
import { site } from "@/lib/site";

export const guidesHub = {
  seoTitle: "SAT Guides: UGA, Georgia Tech & Emory | Illuminairy",
  seoDescription:
    "Free downloads for Georgia families — UGA, Georgia Tech, and Emory SAT and GPA ranges, an August SAT study plan by phase, and a digital SAT pacing checklist.",
  canonical: "/guides",
  eyebrow: "Free downloads · Georgia",
  h1: "SAT guides for UGA, Georgia Tech, and Emory",
  lead:
    "Each guide pulls SAT ranges from what those schools publish, adds GPA context, and includes a short worksheet. Enter your email to open one — then print or save as PDF.",
  trustLine: "Links to UGA, Tech, and Emory’s own admit pages inside each guide.",
  sections: {
    flagship: {
      title: "UGA, Georgia Tech, and Emory",
      intro: "One school per guide — middle-50% SAT ranges, GPA notes, and a place to write your numbers."
    },
    summer: {
      title: `August ${site.satDate} test — study plan by phase`,
      intro:
        "Baseline through taper — same sequence whether you start in May or two weeks out."
    },
    digital: {
      title: "Digital SAT — practice score higher than the real test",
      intro:
        "SAT Module 2 running out of time, Desmos, and the reference sheet — for students who know the material but need their score up by test day."
    }
  }
} as const;

export type GuideFunnelCopy = {
  hubSection: keyof typeof guidesHub.sections;
  eyebrow: string;
  formHeadline: string;
  formSubline: string;
  submitLabel: string;
  successOpenLabel: string;
  hubCardCta: string;
};

export const guideFunnelCopy: Record<LeadMagnetSlug, GuideFunnelCopy> = {
  "uga-sat-score": {
    hubSection: "flagship",
    eyebrow: "UGA · Free download",
    formHeadline: "Get the UGA SAT and GPA guide",
    formSubline: "Middle-50% ranges, worksheet, August priorities",
    submitLabel: "Email me the UGA guide",
    successOpenLabel: "Open the UGA guide",
    hubCardCta: "UGA SAT and GPA guide"
  },
  "georgia-tech-sat-score": {
    hubSection: "flagship",
    eyebrow: "Georgia Tech · Free download",
    formHeadline: "Get the Georgia Tech SAT guide",
    formSubline: "Total and Math ranges, GPA and rigor notes",
    submitLabel: "Email me the Tech guide",
    successOpenLabel: "Open the Georgia Tech guide",
    hubCardCta: "Georgia Tech SAT guide"
  },
  "emory-sat-score": {
    hubSection: "flagship",
    eyebrow: "Emory · Free download",
    formHeadline: "Get the Emory SAT guide",
    formSubline: "Submitter ranges and a send-or-skip worksheet",
    submitLabel: "Email me the Emory guide",
    successOpenLabel: "Open the Emory guide",
    hubCardCta: "Emory SAT guide"
  },
  "rising-junior-summer-timeline": {
    hubSection: "summer",
    eyebrow: `August ${site.satDate} test · Free download`,
    formHeadline: "Get the August SAT study plan",
    formSubline: "Six phases — baseline through taper",
    submitLabel: "Email me the study plan",
    successOpenLabel: "Open the August SAT study plan",
    hubCardCta: "August SAT study plan"
  },
  "module-2-pacing-check": {
    hubSection: "digital",
    eyebrow: "Digital SAT · Free download",
    formHeadline: "Get the digital SAT checklist",
    formSubline: "Module 2 time, Desmos, reference sheet — before test day",
    submitLabel: "Email me the checklist",
    successOpenLabel: "Open the checklist",
    hubCardCta: "Digital SAT checklist"
  }
};

export function getGuideFunnelCopy(slug: LeadMagnetSlug): GuideFunnelCopy {
  return guideFunnelCopy[slug];
}
