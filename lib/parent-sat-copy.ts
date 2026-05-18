/**
 * Parent search language + SEO phrases for SAT lead magnets.
 * Forum voice: docs/research/parent-voice-social-listening-2026-05.md
 * Keywords: docs/seo-georgia-parent-icp.md
 * Banned: .cursor/rules/banned-copy-phrases.mdc
 */
import { site } from "@/lib/site";

const augustSat = `August ${site.satDate} SAT`;

export const parentSatCopy = {
  summerRaiseScoreHeading: `If you're trying to help get their SAT score up this summer — what's realistic (not a guarantee)`,

  worksBeforeTestDayHeading:
    "What works to get their SAT score up by test day — and what usually does not",

  worksBeforeTestDayHelpsLabel: `Works before the ${augustSat}`,

  worksBeforeTestDayDoesNotLabel: "Usually does not raise the score on its own",

  worksBeforeTestDayHelps:
    "reviewing misses from timed Bluebook practice (where answers are visible), timed Module 2 practice, full-length tests every few weeks, and a mentor who changes focus when the same miss types keep showing up",

  worksBeforeTestDayDoesNot:
    "passive videos, untimed worksheets, or a marketed score guarantee",

  goodHelpBeforeTestHeading: "What to look for if you want their score up by test day",

  module2LpPreview: [
    "Practice SAT score higher than the official test — what parents can check",
    "SAT Module 2 running out of time — watch on Bluebook at home",
    `Desmos and the reference sheet before the ${augustSat}`
  ] as const
} as const;
