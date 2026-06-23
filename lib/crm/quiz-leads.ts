import { createAdminAlert } from "@/lib/admin/alerts";
import {
  deriveLeadSource,
  type AttributionSnapshot
} from "@/lib/attribution";
import {
  buildQuizAnswersSnapshot,
  type QuizAnswersSnapshotInput
} from "@/lib/crm/quiz-answers-snapshot";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  weeksUntilQ5Test
} from "@/lib/quiz-funnel/gains";
import { appendTouchEvent, getFirstTouchForVisitor, linkVisitorTouches } from "@/lib/crm/touch";
import { getVisitorById } from "@/lib/crm/visitors";
import { recordIdentityLink } from "@/lib/crm/identity-stitching";
import { studentGradeFromPlanBGradeId } from "@/lib/quiz-funnel-b/grade-copy";

export type QuizAnswersPayload = QuizAnswersSnapshotInput;

export type LeadMetaMatchInput = {
  fbp?: string;
  fbc?: string;
  fbcTs?: number;
  clientIp?: string;
  clientUserAgent?: string;
};

function normalizeMetaMatch(input?: LeadMetaMatchInput) {
  if (!input) return null;
  const row = {
    meta_fbp: input.fbp?.trim() || null,
    meta_fbc: input.fbc?.trim() || null,
    meta_fbc_ts:
      typeof input.fbcTs === "number" && input.fbcTs > 0 ? input.fbcTs : null,
    meta_client_ip: input.clientIp?.trim() || null,
    meta_client_user_agent: input.clientUserAgent?.trim() || null
  };
  const hasAny = Object.values(row).some((v) => v != null);
  return hasAny ? row : null;
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function upsertLeadFromQuizFunnel(
  answers: QuizAnswersPayload,
  options: {
    visitorId?: string;
    attribution?: AttributionSnapshot;
    metaMatch?: LeadMetaMatchInput;
    funnel?: string;
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

  const visitorRow = options.visitorId
    ? await getVisitorById(options.visitorId)
    : null;
  const defaultFurthestStep =
    options.funnel === "sat_quiz_b" ? "b-phone" : "s5";
  const quizFurthestStep =
    (visitorRow?.quiz_furthest_step as string | undefined) ?? defaultFurthestStep;
  const satLpVariantFromVisitor =
    (visitorRow?.sat_lp_variant as string | undefined) ??
    answers.sat_lp_variant ??
    null;
  const posthogDistinctId =
    (visitorRow?.posthog_distinct_id as string | undefined) ?? null;

  const { first, last } = splitName(answers.parentName ?? "");
  const leadSource = deriveLeadSource(attribution);
  const now = new Date().toISOString();
  const quizSnapshot = buildQuizAnswersSnapshot(answers);
  const promisedGain = promisedGainFromQuizAnswers(answers.q4, answers.q5, answers.q8);
  const gpaGap = showedGpaGapScreen(answers.q4, answers.q9);
  const metaMatch = normalizeMetaMatch(options.metaMatch);

  const leadRow = {
    parent_email: email,
    visitor_id: options.visitorId ?? null,
    parent_first: first,
    parent_last: last,
    parent_phone: answers.parentPhone?.trim() ?? "",
    student_first: answers.kidName?.trim() ?? "",
    student_grade: studentGradeFromPlanBGradeId(answers.qGrade) ?? null,
    student_school: null,
    target_exam: "SAT",
    sat_baseline: answers.q4 ?? null,
    score_range: answers.q4 ?? null,
    main_goal: answers.q8 ?? null,
    target_score: answers.q8 ?? null,
    funnel: options.funnel ?? "sat_quiz",
    intake_submitted_at: now,
    quiz_who: answers.qWho ?? null,
    quiz_score_lower: answers.qScoreLower ?? null,
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
      funnel: options.funnel ?? "sat_quiz",
      ...quizSnapshot,
      promised_gain_pts: promisedGain,
      showed_gpa_gap: gpaGap,
      weeks_until_test: weeksUntilQ5Test(answers.q5),
      creative_version: attribution.version ?? null
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
    quiz_furthest_step: quizFurthestStep,
    sat_lp_variant: satLpVariantFromVisitor,
    posthog_distinct_id: posthogDistinctId,
    updated_at: now,
    ...(metaMatch ?? {})
  };

  const { data: existing } = await supabase
    .from("leads")
    .select("id, utm_source, first_touch_at")
    .eq("parent_email", leadRow.parent_email)
    .maybeSingle();

  let leadId: string;
  let isNewLead = false;

  if (existing) {
    const preserveAttribution = Boolean(existing.utm_source || existing.first_touch_at);
    const updateRow = preserveAttribution
      ? {
          visitor_id: leadRow.visitor_id,
          parent_first: leadRow.parent_first,
          parent_last: leadRow.parent_last,
          parent_phone: leadRow.parent_phone,
          student_first: leadRow.student_first,
          student_grade: leadRow.student_grade,
          sat_baseline: leadRow.sat_baseline,
          score_range: leadRow.score_range,
          main_goal: leadRow.main_goal,
          target_score: leadRow.target_score,
          funnel: leadRow.funnel,
          intake_submitted_at: leadRow.intake_submitted_at,
          quiz_who: leadRow.quiz_who,
          quiz_score_lower: leadRow.quiz_score_lower,
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
          updated_at: now,
          ...(metaMatch ?? {})
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
    isNewLead = true;
  }

  if (options.visitorId) {
    await linkVisitorTouches(options.visitorId, leadId);
  }

  try {
    await recordIdentityLink({
      leadId,
      visitorId: options.visitorId ?? null,
      email: email,
      phone: answers.parentPhone?.trim() ?? null,
      source: "quiz_submit"
    });
  } catch (e) {
    console.error("identity-link:quiz", e);
  }

  await appendTouchEvent({
    visitor_id: options.visitorId,
    lead_id: leadId,
    event_type: "quiz_lead_submitted",
    attribution,
    source: "server",
    payload: {
      parent_email: email,
      funnel: options.funnel ?? "sat_quiz",
      qWho: answers.qWho,
      qGrade: answers.qGrade,
      student_grade: leadRow.student_grade,
      qScoreLower: answers.qScoreLower,
      q1: answers.q1,
      q4: answers.q4,
      q5: answers.q5,
      q8: answers.q8,
      quiz_is_self_taker: answers.qWho === "self",
      promised_gain_pts: promisedGain,
      showed_gpa_gap: gpaGap
    }
  });

  if (isNewLead) {
    void createAdminAlert({
      alertType: "new_lead",
      severity: "info",
      title: `New lead: ${answers.parentName?.trim() || email}`,
      body: `SAT Score Path lead from ${leadSource}.`,
      source: "crm",
      linkUrl: "/admin/crm",
      dedupeKey: `lead:${leadId}`
    });
  }

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
