import {
  upsertLeadFromQuizFunnel,
  type QuizAnswersPayload,
  type LeadMetaMatchInput,
} from "@/lib/crm/quiz-leads";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";
import type { AttributionSnapshot } from "@/lib/attribution";

export type LabQuizAnswersPayload = QuizAnswersPayload & {
  parentZip?: string;
  qSchoolReferral?: string;
  childEmail?: string;
  phoneVerifiedAt?: string;
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
    funnel: "sat_quiz_b",
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

  await supabase
    .from("leads")
    .update({
      funnel: "sat_quiz_b",
      plan_builder_variant: PLAN_BUILDER_VARIANT,
      parent_zip: answers.parentZip?.trim() || null,
      school_referral: answers.qSchoolReferral?.trim() || null,
      child_email: answers.childEmail?.trim().toLowerCase() || null,
      phone_verified_at: phoneVerifiedAt,
      updated_at: now,
    })
    .eq("id", result.leadId);

  return result;
}
