import type { QuizAnswersPayload } from "@/lib/crm/quiz-leads";
import {
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  weeksUntilQ5Test
} from "@/lib/quiz-funnel/gains";
import type { AttributionSnapshot } from "@/lib/attribution";
import { PLAN_BUILDER_PATH } from "@/lib/plan-builder-routes";

export type KlaviyoQuizContext = {
  answers: QuizAnswersPayload;
  attribution?: AttributionSnapshot;
  quizFurthestStep?: string;
  satLpVariant?: string;
};

export function buildKlaviyoQuizProperties(ctx: KlaviyoQuizContext) {
  const { answers, attribution, quizFurthestStep, satLpVariant } = ctx;
  const promisedGain = promisedGainFromQuizAnswers(
    answers.q4,
    answers.q5,
    answers.q8
  );
  const showedGpaGap = showedGpaGapScreen(answers.q4, answers.q9);
  const weeksUntil = weeksUntilQ5Test(answers.q5);
  const step = quizFurthestStep ?? "s5";
  const resumeUrl = `https://illuminairy.com${PLAN_BUILDER_PATH}?step=${encodeURIComponent(step)}`;

  return {
    qWho: answers.qWho ?? "",
    qScoreLower: answers.qScoreLower ?? "",
    q1: answers.q1 ?? "",
    quiz_urgency: answers.q1 ?? "",
    quiz_is_self_taker: answers.qWho === "self" ? "yes" : "no",
    q2: answers.q2 ?? "",
    q3: answers.q3 ?? "",
    q4: answers.q4 ?? "",
    q5: answers.q5 ?? "",
    q8: answers.q8 ?? "",
    q9: answers.q9 ?? "",
    q6: (answers.q6 ?? []).join(","),
    q7: (answers.q7 ?? []).join(","),
    target_score: answers.q8 ?? "",
    gpa_band: answers.q9 ?? "",
    promised_gain_pts: promisedGain ?? "",
    showed_gpa_gap: showedGpaGap ? "yes" : "no",
    weeks_until_test: weeksUntil ?? "",
    quiz_furthest_step: step,
    resume_plan_url: resumeUrl,
    sat_lp_variant: satLpVariant ?? answers.sat_lp_variant ?? "",
    utm_campaign: attribution?.utm_campaign ?? "",
    utm_source: attribution?.utm_source ?? "",
    utm_content: attribution?.utm_content ?? "",
    creative_version: attribution?.version ?? "",
    first_touch_utm_campaign: attribution?.utm_campaign ?? "",
    funnel: "sat_quiz"
  };
}
