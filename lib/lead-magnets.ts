/** Lead magnet registry — guides hub, Klaviyo sources, download routes. */

import type { FlagshipSchoolId } from "@/lib/georgia-flagship-scores";
import { flagshipGuideCopy } from "@/lib/flagship-guide-copy";
import { site } from "@/lib/site";

export type LeadMagnetSlug =
  | "uga-sat-score"
  | "georgia-tech-sat-score"
  | "emory-sat-score"
  | "rising-junior-summer-timeline"
  | "module-2-pacing-check";

export type LeadMagnet = {
  slug: LeadMagnetSlug;
  flagshipSchoolId?: FlagshipSchoolId;
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  klaviyoSource: string;
  bullets: string[];
};

function flagshipMagnet(
  slug: LeadMagnetSlug,
  schoolId: FlagshipSchoolId,
  klaviyoSource: string,
  bullets: string[]
): LeadMagnet {
  const copy = flagshipGuideCopy[schoolId];
  return {
    slug,
    flagshipSchoolId: schoolId,
    title: copy.title,
    subtitle: copy.subtitle,
    description: copy.description,
    seoTitle: copy.seoTitle,
    seoDescription: copy.seoDescription,
    klaviyoSource,
    bullets
  };
}

export const leadMagnets: LeadMagnet[] = [
  flagshipMagnet("uga-sat-score", "uga", "lead_magnet:uga-sat-score", [
    "UGA SAT score middle 50% — cited from UGA’s own admit page",
    "SAT for UGA with a 3.8 GPA — how rigor changes the picture",
    "Worksheet: your student’s SAT, GPA, and coursework",
    `What works to get their score up before the ${site.satDate} SAT`
  ]),
  flagshipMagnet("georgia-tech-sat-score", "georgia-tech", "lead_magnet:georgia-tech-sat-score", [
    "Georgia Tech SAT score ranges (total + Math)",
    "Georgia Tech SAT with 4.0 GPA — how Math and rigor read",
    "Worksheet: total SAT, Math section, and GPA",
    `Summer priorities before the ${site.satDate} test — not a score guarantee`
  ]),
  flagshipMagnet("emory-sat-score", "emory", "lead_magnet:emory-sat-score", [
    "Emory SAT score ranges for students who submitted scores",
    "Emory test optional — when to send SAT scores vs. skip",
    "Worksheet: GPA + score → send or test-optional?",
    `If you still need their score up before applications — realistic next steps`
  ]),
  {
    slug: "rising-junior-summer-timeline",
    title: `August SAT study plan — before the ${site.satDate} test`,
    subtitle: "Free download · six phases (order matters more than length)",
    description:
      "Phase-by-phase plan any family can follow: baseline, diagnose gaps, learn every SAT domain, targeted practice, full-length Bluebook tests, pacing and Module 2, then taper — plus what most people outsource.",
    seoTitle: `August SAT Study Plan | ${site.satDate} Test`,
    seoDescription:
      "Free August SAT study plan by phase — diagnose, cover content, practice, full-length tests, pacing. Works with weeks or days left. Illuminairy.",
    klaviyoSource: "lead_magnet:rising-junior-summer-timeline",
    bullets: [
      "Six phases: baseline → diagnose → learn → practice → pace → taper",
      "How to compress if you are short on time (without skipping the first two)",
      "Checklist: Bluebook, question bank, error log, pacing drills"
    ]
  },
  {
    slug: "module-2-pacing-check",
    title:
      "Digital SAT Module 2 checklist — when Bluebook scores beat the real test",
    subtitle: "Free digital SAT guide · Desmos · pace",
    description:
      `Searched “SAT Module 2 running out of time” or “practice SAT score higher than real test”? Parent checklist for patterns, Desmos, and pace on Bluebook — what works to get their score up by the ${site.satDate} SAT.`,
    seoTitle:
      "Digital SAT Module 2 Parent Checklist | Practice Score Higher Than Real",
    seoDescription:
      "Free digital SAT checklist for parents — Module 2 time, Desmos and reference sheet, question patterns, and ~2 hr 14 min pace. When Bluebook scores lie. Illuminairy, Atlanta.",
    klaviyoSource: "lead_magnet:module-2-pacing-check",
    bullets: [
      "Practice SAT score higher than the official test — what to check at home",
      "SAT Module 2 running out of time — patterns parents can watch on Bluebook",
      `Desmos and the reference sheet before the ${site.satDate} SAT (~2 hr 14 min)`
    ]
  }
];

export const leadMagnetSlugs = leadMagnets.map((m) => m.slug);

export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return leadMagnets.find((m) => m.slug === slug);
}

export function isLeadMagnetSlug(slug: string): slug is LeadMagnetSlug {
  return leadMagnetSlugs.includes(slug as LeadMagnetSlug);
}

/** sessionStorage key set after successful magnet signup */
export const LEAD_MAGNET_ACCESS_KEY = "illuminairy_lead_magnet_access";
