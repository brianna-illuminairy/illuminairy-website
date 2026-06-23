import { weeksUntilQ5Test } from "@/lib/quiz-funnel/gains";

export type PlanBMembershipPackage = "standard" | "intensive";

export type PlanBMembershipTier = {
  id: PlanBMembershipPackage;
  sessionsPerWeek: number;
  sessionLengthMinutes: number;
  listWeeklyPrice: number;
  chargeWeeklyPrice: number;
  label: string;
  cadenceLabel: string;
};

export const PLAN_B_REGIONAL_DISCOUNT_PCT = 10 as const;

export const PLAN_B_MEMBERSHIP_TIERS: Record<PlanBMembershipPackage, PlanBMembershipTier> = {
  standard: {
    id: "standard",
    sessionsPerWeek: 2,
    sessionLengthMinutes: 45,
    listWeeklyPrice: 110,
    chargeWeeklyPrice: 99,
    label: "Standard",
    cadenceLabel: "2×45 min/week",
  },
  intensive: {
    id: "intensive",
    sessionsPerWeek: 3,
    sessionLengthMinutes: 45,
    listWeeklyPrice: 165,
    chargeWeeklyPrice: 148,
    label: "Intensive",
    cadenceLabel: "3×45 min/week",
  },
};

/** ≥10 weeks (including exactly 10) → standard; <10 → intensive. */
export function planBRecommendedPackage(q5?: string | null): PlanBMembershipPackage {
  const weeks = weeksUntilQ5Test(q5 ?? undefined);
  if (weeks != null && weeks < 10) return "intensive";
  return "standard";
}

export function planBMembershipTierForQ5(q5?: string | null): PlanBMembershipTier {
  return PLAN_B_MEMBERSHIP_TIERS[planBRecommendedPackage(q5)];
}

export function formatPlanBWeeklyPrice(amount: number): string {
  return `$${amount}/wk`;
}

export function planBWeeklyPromoForPackage(pkg: PlanBMembershipPackage) {
  const tier = PLAN_B_MEMBERSHIP_TIERS[pkg];
  return {
    listPrice: tier.listWeeklyPrice,
    chargePrice: tier.chargeWeeklyPrice,
    label: `${tier.cadenceLabel} tutoring`,
  };
}

export function regionalStripeCouponId(regionId: string): string {
  const slug = regionId.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toUpperCase();
  return slug ? `SAT-${slug}-10` : "PLANB-REGIONAL-10";
}
