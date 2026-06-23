import {
  illuminairyFirstMonthOutcomeLine,
  satFirstMonthOutcomes,
} from "@/lib/site";

export const PORTAL_PLANS_INTRO =
  "We'll develop a personalized SAT improvement plan for your child after their SAT Diagnostic. Your tutor will rank the skills holding their score back on the SAT, and schedule lessons on them one by one, targeting the ones with the highest score impact first. This means you'll start seeing results fast.";

export function portalPlansOutcomeParagraph(): string {
  return `${illuminairyFirstMonthOutcomeLine()} ${satFirstMonthOutcomes.varyDisclaimer}`;
}

export const PORTAL_DIAGNOSTIC_FREE_SESSION =
  "During their free session, we run a 30-minute mini diagnostic to identify mistake patterns and which skills to focus on before their next test.";

export const PORTAL_DIAGNOSTIC_ENROLLED =
  "For students who enroll, we schedule a full 2 hr 14 min adaptive Skill Diagnostic (same adaptive format as the real SAT) for deeper personalization.";
