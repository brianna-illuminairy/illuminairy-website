import {
  upsertLeadFromQuizFunnel,
  type QuizAnswersPayload,
  type LeadMetaMatchInput,
} from "@/lib/crm/quiz-leads";
import { studentGradeFromPlanBGradeId } from "@/lib/quiz-funnel-b/grade-copy";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PLAN_BUILDER_FUNNEL_ID, PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";
import type { AttributionSnapshot } from "@/lib/attribution";

export type LabQuizAnswersPayload = QuizAnswersPayload & {
  parentZip?: string;
  qSchoolReferral?: string;
  childEmail?: string;
  phoneVerifiedAt?: string;
  targetSchoolIds?: string[];
  targetRegionId?: string;
  regionalDiscountCode?: string;
  regionalDiscountPct?: number;
};

export async function upsertLeadFromLabFunnel(
  answers: LabQuizAnswersPayload,
  options: {
    visitorId?: string;
    attribution?: AttributionSnapshot;
    metaMatch?: LeadMetaMatchInput;
  }
) {
  const result = await upsertLeadFromQuizFunnel(answers, {
    ...options,
    funnel: PLAN_BUILDER_FUNNEL_ID,
  });

  if (!result.ok) {
    return result;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return result;
  }

  const now = new Date().toISOString();
  const phoneVerifiedAt =
    typeof answers.phoneVerifiedAt === "string" && answers.phoneVerifiedAt.trim()
      ? answers.phoneVerifiedAt.trim()
      : null;

  const targetSchools =
    Array.isArray(answers.targetSchoolIds) && answers.targetSchoolIds.length
      ? answers.targetSchoolIds
      : null;

  await supabase
    .from("leads")
    .update({
      funnel: PLAN_BUILDER_FUNNEL_ID,
      plan_builder_variant: PLAN_BUILDER_VARIANT,
      parent_zip: answers.parentZip?.trim() || null,
      school_referral: answers.qSchoolReferral?.trim() || null,
      child_email: answers.childEmail?.trim().toLowerCase() || null,
      ...(phoneVerifiedAt ? { phone_verified_at: phoneVerifiedAt } : {}),
      target_schools: targetSchools,
      target_region: answers.targetRegionId?.trim() || null,
      regional_discount_code: answers.regionalDiscountCode?.trim() || null,
      regional_discount_pct:
        typeof answers.regionalDiscountPct === "number" && answers.regionalDiscountPct > 0
          ? answers.regionalDiscountPct
          : null,
      updated_at: now,
    })
    .eq("id", result.leadId);

  return result;
}
