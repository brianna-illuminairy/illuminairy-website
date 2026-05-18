import { getGuideFunnelCopy } from "@/lib/guides-marketing";
import { getLeadMagnet, type LeadMagnetSlug } from "@/lib/lead-magnets";
import { site } from "@/lib/site";

export type MagnetGrowthHero = {
  eyebrow: string;
  headline: string;
  subhead: string;
  bullets: string[];
  formHeadline: string;
  formSubline: string;
  submitLabel: string;
  successOpenLabel: string;
};

export function resolveMagnetGrowthHero(slug: LeadMagnetSlug): MagnetGrowthHero {
  const magnet = getLeadMagnet(slug)!;
  const funnel = getGuideFunnelCopy(slug);

  const subheads: Record<LeadMagnetSlug, string> = {
    "uga-sat-score":
      `You searched “SAT for UGA with a 3.8 GPA” or “UGA SAT score” — not a generic blog. Cited middle-50% ranges, GPA and rigor, a worksheet, and what works to get their score up before the ${site.satDate} SAT.`,
    "georgia-tech-sat-score":
      `Families search “Georgia Tech SAT with 4.0 GPA” or “Tech Math SAT.” Cited admit ranges, Math notes, a worksheet, and what to prioritize this summer before the ${site.satDate} test.`,
    "emory-sat-score":
      "Searched “Emory test optional SAT” or “Emory SAT with 3.9 GPA”? Submitter score ranges, send-or-skip worksheet, and what works if you still need their score up before you apply.",
    "rising-junior-summer-timeline":
      `August SAT study plan through the ${site.satDate} test — phases for baseline, diagnose, learn every domain, practice, Bluebook full lengths, Module 2 pace, and taper. Order stays the same even if the calendar gets tight.`,
    "module-2-pacing-check":
      `Searched “SAT Module 2 running out of time” or “practice SAT score higher than real test”? Parent checklist for patterns, Desmos, and pace before the ${site.satDate} SAT — what works to get their score up by test day.`
  };

  return {
    eyebrow: funnel.eyebrow,
    headline: magnet.title,
    subhead: subheads[slug],
    bullets: magnet.bullets,
    formHeadline: funnel.formHeadline,
    formSubline: funnel.formSubline,
    submitLabel: funnel.submitLabel,
    successOpenLabel: funnel.successOpenLabel
  };
}
