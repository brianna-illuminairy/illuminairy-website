import {
  deriveLeadSource,
  type AttributionSnapshot
} from "@/lib/attribution";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { QualificationIntakePayload } from "@/lib/sat-qualification";
import { appendTouchEvent, getFirstTouchForVisitor, linkVisitorTouches } from "@/lib/crm/touch";

export async function upsertLeadFromIntake(
  payload: QualificationIntakePayload,
  options: {
    visitorId?: string;
    attribution?: AttributionSnapshot;
    stage?: "intake_submitted" | "lost";
    lostReason?: string;
  }
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
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

  const leadSource = deriveLeadSource(attribution);
  const now = new Date().toISOString();

  const leadRow = {
    parent_email: payload.parentEmail.toLowerCase(),
    visitor_id: options.visitorId ?? null,
    parent_first: payload.parentFirst,
    parent_last: payload.parentLast,
    parent_phone: payload.parentPhone,
    student_first: payload.studentFirst,
    student_grade: payload.studentGrade,
    student_school: payload.studentSchool || null,
    target_exam: payload.targetExam,
    sat_baseline: payload.satBaseline,
    score_range: payload.scoreRange || null,
    main_goal: payload.mainGoal,
    additional_context: payload.additionalContext || null,
    stage: (options.stage ?? "intake_submitted") as "intake_submitted" | "lost",
    lost_reason: options.lostReason ?? null,
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
          student_grade: leadRow.student_grade,
          student_school: leadRow.student_school,
          target_exam: leadRow.target_exam,
          sat_baseline: leadRow.sat_baseline,
          score_range: leadRow.score_range,
          main_goal: leadRow.main_goal,
          additional_context: leadRow.additional_context,
          stage: leadRow.stage,
          lost_reason: leadRow.lost_reason,
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
      console.error("update lead:", error);
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
      console.error("insert lead:", error);
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
    event_type: "intake_submitted",
    attribution,
    source: "server",
    payload: { parent_email: payload.parentEmail }
  });

  return { ok: true as const, leadId, attribution, leadSource };
}
