import {
  deriveLeadSource,
  type AttributionSnapshot
} from "@/lib/attribution";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  weeksUntilQ5Test
} from "@/lib/quiz-funnel/gains";
import { appendTouchEvent, getFirstTouchForVisitor, linkVisitorTouches } from "@/lib/crm/touch";

export type QuizAnswersPayload = {
  q1?: string | null;
  q2?: string | null;
  q3?: string | null;
  q4?: string | null;
  q5?: string | null;
  q6?: string[];
  q7?: string[];
  q8?: string | null;
  q9?: string | null;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  kidName?: string;
  confirmTcpa?: boolean;
  planChoice?: string;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function buildQuizAnswersSnapshot(answers: QuizAnswersPayload) {
  return {
    q1: answers.q1 ?? null,
    q2: answers.q2 ?? null,
    q3: answers.q3 ?? null,
    q4: answers.q4 ?? null,
    q5: answers.q5 ?? null,
    q6: answers.q6 ?? [],
    q7: answers.q7 ?? [],
    q8: answers.q8 ?? null,
    q9: answers.q9 ?? null,
    planChoice: answers.planChoice ?? "full",
    confirmTcpa: Boolean(answers.confirmTcpa)
  };
}

export async function upsertLeadFromQuizFunnel(
  answers: QuizAnswersPayload,
  options: {
    visitorId?: string;
    attribution?: AttributionSnapshot;
  }
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const email = answers.parentEmail?.trim().toLowerCase() ?? "";
  if (!email) {
    return { ok: false as const, error: "missing_email" };
  }

  let attribution = options.attribution ?? {};
  let firstTouchAt: string | undefined;

  if (options.visitorId) {
    const first = await getFirstTouchForVisitor(options.visitorId);
    if (first) {
      attribution = { ...first.snap, ...attribution };
      firstTouchAt = first.first_touch_at;
    }
  }

  const { first, last } = splitName(answers.parentName ?? "");
  const leadSource = deriveLeadSource(attribution);
  const now = new Date().toISOString();
  const quizSnapshot = buildQuizAnswersSnapshot(answers);
  const promisedGain = promisedGainFromQuizAnswers(answers.q4, answers.q5, answers.q8);
  const gpaGap = showedGpaGapScreen(answers.q4, answers.q9);

  const leadRow = {
    parent_email: email,
    visitor_id: options.visitorId ?? null,
    parent_first: first,
    parent_last: last,
    parent_phone: answers.parentPhone?.trim() ?? "",
    student_first: answers.kidName?.trim() ?? "",
    student_grade: null,
    student_school: null,
    target_exam: "SAT",
    sat_baseline: answers.q4 ?? null,
    score_range: answers.q4 ?? null,
    main_goal: answers.q8 ?? null,
    target_score: answers.q8 ?? null,
    funnel: "sat_quiz",
    intake_submitted_at: now,
    quiz_trigger: answers.q1 ?? null,
    quiz_stakes: answers.q2 ?? null,
    quiz_tests_taken: answers.q3 ?? null,
    sat_next_test: answers.q5 ?? null,
    gpa_band: answers.q9 ?? null,
    quiz_blockers: answers.q6?.length ? answers.q6 : null,
    quiz_prep_tried: answers.q7?.length ? answers.q7 : null,
    showed_gpa_gap: gpaGap,
    promised_gain_pts: promisedGain,
    weeks_until_test: weeksUntilQ5Test(answers.q5),
    tcpa_consent: Boolean(answers.confirmTcpa),
    tcpa_consent_at: answers.confirmTcpa ? now : null,
    quiz_answers: quizSnapshot,
    additional_context: JSON.stringify({
      funnel: "sat_quiz",
      ...quizSnapshot,
      promised_gain_pts: promisedGain,
      showed_gpa_gap: gpaGap,
      weeks_until_test: weeksUntilQ5Test(answers.q5)
    }),
    stage: "intake_submitted" as const,
    lost_reason: null,
    utm_source: attribution.utm_source ?? null,
    utm_medium: attribution.utm_medium ?? null,
    utm_campaign: attribution.utm_campaign ?? null,
    utm_term: attribution.utm_term ?? null,
    utm_content: attribution.utm_content ?? null,
    gclid: attribution.gclid ?? null,
    fbclid: attribution.fbclid ?? null,
    msclkid: attribution.msclkid ?? null,
    landing_page: attribution.landing_page ?? null,
    referrer: attribution.referrer ?? null,
    lead_source: leadSource,
    first_touch_at: firstTouchAt ?? now,
    updated_at: now
  };

  const { data: existing } = await supabase
    .from("leads")
    .select("id, utm_source, first_touch_at")
    .eq("parent_email", leadRow.parent_email)
    .maybeSingle();

  let leadId: string;

  if (existing) {
    const preserveAttribution = Boolean(existing.utm_source || existing.first_touch_at);
    const updateRow = preserveAttribution
      ? {
          visitor_id: leadRow.visitor_id,
          parent_first: leadRow.parent_first,
          parent_last: leadRow.parent_last,
          parent_phone: leadRow.parent_phone,
          student_first: leadRow.student_first,
          sat_baseline: leadRow.sat_baseline,
          score_range: leadRow.score_range,
          main_goal: leadRow.main_goal,
          target_score: leadRow.target_score,
          funnel: leadRow.funnel,
          intake_submitted_at: leadRow.intake_submitted_at,
          quiz_trigger: leadRow.quiz_trigger,
          quiz_stakes: leadRow.quiz_stakes,
          quiz_tests_taken: leadRow.quiz_tests_taken,
          sat_next_test: leadRow.sat_next_test,
          gpa_band: leadRow.gpa_band,
          quiz_blockers: leadRow.quiz_blockers,
          quiz_prep_tried: leadRow.quiz_prep_tried,
          showed_gpa_gap: leadRow.showed_gpa_gap,
          promised_gain_pts: leadRow.promised_gain_pts,
          weeks_until_test: leadRow.weeks_until_test,
          tcpa_consent: leadRow.tcpa_consent,
          tcpa_consent_at: leadRow.tcpa_consent_at,
          quiz_answers: leadRow.quiz_answers,
          additional_context: leadRow.additional_context,
          stage: leadRow.stage,
          updated_at: now
        }
      : leadRow;

    const { data, error } = await supabase
      .from("leads")
      .update(updateRow)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false as const, error: error?.message ?? "update_failed" };
    }
    leadId = data.id;
  } else {
    const { data, error } = await supabase
      .from("leads")
      .insert(leadRow)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false as const, error: error?.message ?? "insert_failed" };
    }
    leadId = data.id;
  }

  if (options.visitorId) {
    await linkVisitorTouches(options.visitorId, leadId);
  }

  await appendTouchEvent({
    visitor_id: options.visitorId,
    lead_id: leadId,
    event_type: "quiz_lead_submitted",
    attribution,
    source: "server",
    payload: {
      parent_email: email,
      funnel: "sat_quiz",
      q4: answers.q4,
      q5: answers.q5,
      q8: answers.q8,
      promised_gain_pts: promisedGain,
      showed_gpa_gap: gpaGap
    }
  });

  return {
    ok: true as const,
    leadId,
    attribution,
    leadSource,
    email,
    promisedGain,
    showedGpaGap: gpaGap
  };
}
