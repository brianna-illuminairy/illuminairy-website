import type { StandardEnrollLead } from "@/lib/standard-enroll";
import {
  planBMembershipTierForQ5,
  planBRecommendedPackage,
  planBWeeklyPromoForPackage,
  type PlanBMembershipPackage,
} from "@/lib/plan-b/membership-pricing";
import { site } from "@/lib/site";

export type PlanBLeadRow = {
  id: string;
  parent_first?: string | null;
  parent_last?: string | null;
  parent_email?: string | null;
  student_first?: string | null;
  sat_next_test?: string | null;
  regional_discount_code?: string | null;
  regional_discount_pct?: number | null;
  plan_b_membership_package?: string | null;
  booked_call_at?: string | null;
};

const PLAN_B_WEEKLY_2X_PRODUCT =
  process.env.STRIPE_PLAN_B_WEEKLY_2X_PRODUCT_ID ?? "prod_plan_b_2x";
const PLAN_B_WEEKLY_3X_PRODUCT =
  process.env.STRIPE_PLAN_B_WEEKLY_3X_PRODUCT_ID ?? "prod_plan_b_3x";

export function resolvePlanBMembershipPackage(
  row: PlanBLeadRow
): PlanBMembershipPackage {
  const stored = row.plan_b_membership_package;
  if (stored === "intensive" || stored === "standard") return stored;
  return planBRecommendedPackage(row.sat_next_test);
}

export function buildPlanBPortalEnrollLead(row: PlanBLeadRow): StandardEnrollLead {
  const pkg = resolvePlanBMembershipPackage(row);
  const tier = planBMembershipTierForQ5(row.sat_next_test);
  const parentFirst = row.parent_first?.trim() || "Parent";
  const parentLast = row.parent_last?.trim() || "";
  const studentFirst = row.student_first?.trim() || "Your student";
  const weeklyProductId =
    pkg === "intensive" ? PLAN_B_WEEKLY_3X_PRODUCT : PLAN_B_WEEKLY_2X_PRODUCT;

  return {
    slug: `plan-b-${row.id}`,
    parent: {
      first: parentFirst,
      last: parentLast || undefined,
      full: [parentFirst, parentLast].filter(Boolean).join(" "),
      email: row.parent_email ?? undefined,
    },
    student: {
      first: studentFirst,
      full: studentFirst,
      gradeNote: "SAT program",
    },
    pricing: {
      diagPrice: 0,
      weeklyPrice: tier.chargeWeeklyPrice,
      stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
      stripeWeeklyProductId: weeklyProductId,
      weeklyTrialDays: 0,
      stripeFallbackLink: "mailto:support@illuminairy.com",
    },
    advisor: {
      first: "Brianna",
      full: "Brianna Zajicek",
      email: site.supportEmail,
    },
    call: {
      dateLabel: row.booked_call_at
        ? new Date(row.booked_call_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Your free lesson",
    },
    programVariant: "plan-b-post-lesson",
    faqPreset: "plan-b-portal",
    weeklyPromo: planBWeeklyPromoForPackage(pkg),
    bootcamp: {
      sessionsPerWeek: tier.sessionsPerWeek,
      sessionLengthMinutes: tier.sessionLengthMinutes,
      totalSessions: tier.sessionsPerWeek * 12,
      startLabel: "After enrollment",
      endLabel: "Before your next SAT",
      examLabel: "Next SAT",
      diagnosticComplete: true,
    },
    regionalDiscountCode: row.regional_discount_code?.trim() || undefined,
    membershipPackage: pkg,
  };
}
