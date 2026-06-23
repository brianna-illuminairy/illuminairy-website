import {
  upsertLeadFromQuizFunnel,
  type QuizAnswersPayload,
  type LeadMetaMatchInput,
} from "@/lib/crm/quiz-leads";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { AttributionSnapshot } from "@/lib/attribution";
import { SCORE_REVIEW_FUNNEL_KEY } from "@/lib/score-review-funnel/constants";

export type ScoreReviewAnswersPayload = QuizAnswersPayload & {
  srGrade?: string;
  srRecentScore?: string;
  srPrepared?: string[];
  srTestDate?: string;
  srTarget?: string;
  srSchoolReferral?: string;
  phoneVerifiedAt?: string;
};

export async function upsertLeadFromScoreReviewFunnel(
  answers: ScoreReviewAnswersPayload,
  options: {
    visitorId?: string;
    attribution?: AttributionSnapshot;
    metaMatch?: LeadMetaMatchInput;
  }
) {
  const quizAnswers = {
    srGrade: answers.srGrade,
    srRecentScore: answers.srRecentScore,
    srPrepared: answers.srPrepared,
    srTestDate: answers.srTestDate,
    srTarget: answers.srTarget,
    srSchoolReferral: answers.srSchoolReferral,
    q4: answers.srRecentScore,
    q5: answers.srTestDate,
    q7: answers.srPrepared,
    q8: answers.srTarget,
  };

  const result = await upsertLeadFromQuizFunnel(
    { ...answers, ...quizAnswers },
    {
      ...options,
      funnel: SCORE_REVIEW_FUNNEL_KEY,
    }
  );

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
      funnel: SCORE_REVIEW_FUNNEL_KEY,
      school_referral: answers.srSchoolReferral?.trim() || null,
      phone_verified_at: phoneVerifiedAt,
      updated_at: now,
    })
    .eq("id", result.leadId);

  return result;
}
