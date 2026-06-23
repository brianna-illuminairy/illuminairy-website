import { satProgramOutcomes } from "@/lib/site";
import {
  formatPlanBWeeklyPrice,
  planBMembershipTierForQ5,
  type PlanBMembershipTier,
} from "@/lib/plan-b/membership-pricing";

export const PLAN_B_TARGET_SCHOOLS_HEADLINE = "Is your student planning to apply to any of these schools?";

export const PLAN_B_TARGET_SCHOOLS_SUBLINE =
  "Pick every school on their list. We use this to personalize your plan and pricing.";

export const PLAN_B_TARGET_SCHOOLS_OTHER = "Other / not sure yet";

export function planBRegionalUnlockHeadline(regionLabel: string, schoolNames: string[]): string {
  if (schoolNames.length === 0) {
    return `Parents in ${regionLabel} get a regional tuition offer`;
  }
  if (schoolNames.length === 1) {
    return `We help students aiming for ${schoolNames[0]}`;
  }
  const lead = schoolNames.slice(0, 2).join(" and ");
  const extra = schoolNames.length > 2 ? ` and ${schoolNames.length - 2} more` : "";
  return `We help students aiming for ${lead}${extra}`;
}

export function planBRegionalUnlockBody(): string {
  const o = satProgramOutcomes;
  return `Among ${o.plansBuiltCount} recent program completers, the average gain was +${o.avgPointsGained} points and ${o.targetHitRatePct}% hit their target score. ${o.varyDisclaimer}`;
}

export function planBRegionalUnlockOfferLine(
  regionLabel: string,
  tier: PlanBMembershipTier,
  discountCode: string
): string {
  return `${regionLabel} families save 10% on tutoring (${formatPlanBWeeklyPrice(tier.listWeeklyPrice)} → ${formatPlanBWeeklyPrice(tier.chargeWeeklyPrice)}). Code ${discountCode}.`;
}

export function planBRegionalUnlockPricingForQ5(q5?: string) {
  return planBMembershipTierForQ5(q5);
}
