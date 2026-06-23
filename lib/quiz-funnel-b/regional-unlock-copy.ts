import { PLAN_B_REGIONAL_DISCOUNT_PCT } from "@/lib/plan-b/membership-pricing";

export const PLAN_B_TARGET_SCHOOLS_HEADLINE = "Select schools they're applying to:";

export const PLAN_B_TARGET_SCHOOLS_OTHER = "Other / not sure yet";

export type RegionalUnlockBenefit = {
  text: string;
  emphasize?: boolean;
};

function regionalCollegesPhrase(regionLabel: string): string {
  if (regionLabel === "your area" || regionLabel === "unknown") {
    return "top colleges in your area";
  }
  if (regionLabel === "District of Columbia") {
    return "top DC colleges";
  }
  return `top ${regionLabel} colleges`;
}

/** Second benefit line — state-specific social proof on regional unlock. */
export function planBRegionalUnlockStudentsLine(regionLabel: string): string {
  return `We've helped 20+ students raise their score and get accepted to ${regionalCollegesPhrase(regionLabel)}`;
}

export function planBRegionalUnlockBenefits(regionLabel: string): RegionalUnlockBenefit[] {
  return [
    { text: `${PLAN_B_REGIONAL_DISCOUNT_PCT}% off all tutoring programs`, emphasize: true },
    { text: planBRegionalUnlockStudentsLine(regionLabel) },
    { text: "Accelerated tutor placement times" },
    { text: "Dedicated Customer Support" },
  ];
}

/** Partner headline — short, state-specific, sans-serif in CSS. */
export function planBRegionalUnlockPartnerHeadline(regionLabel: string): string {
  if (regionLabel === "your area" || regionLabel === "unknown") {
    return "Regional Colleges Partner with Illuminairy!";
  }
  if (regionLabel === "District of Columbia") {
    return "DC Colleges Partner with Illuminairy!";
  }
  return `${regionLabel} Colleges Partner with Illuminairy!`;
}

export function planBRegionalUnlockIntro(): string {
  return "Parents with children aiming for one of your target schools have access to a host of benefits including:";
}
