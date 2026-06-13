import { getSupabaseAdmin } from "@/lib/supabase/server";
import { appendTouchEvent } from "@/lib/crm/touch";

export async function updateLeadPipeline(
  leadId: string,
  patch: {
    stage?: string;
    attended_at?: string | null;
    lost_reason?: string | null;
    sales_notes?: string | null;
    next_followup_at?: string | null;
    next_followup_note?: string | null;
    next_followup_kind?: string | null;
    parent_first?: string | null;
    parent_last?: string | null;
    parent_email?: string;
    parent_phone?: string | null;
    student_first?: string | null;
    student_grade?: string | null;
    student_school?: string | null;
    target_exam?: string | null;
    sat_baseline?: string | null;
    main_goal?: string | null;
  }
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const update: Record<string, unknown> = { ...patch };
  update.last_activity_at = new Date().toISOString();

  const { error } = await supabase.from("leads").update(update).eq("id", leadId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  await appendTouchEvent({
    lead_id: leadId,
    event_type: "lead_updated",
    source: "server",
    payload: patch
  });

  return { ok: true as const };
}

export async function updateEnrollment(
  enrollmentId: string,
  patch: {
    status?: string;
    tutor_assigned?: string | null;
    baseline_score?: string | null;
    target_score?: string | null;
  }
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const update: Record<string, unknown> = { ...patch };
  if (patch.tutor_assigned) {
    update.tutor_assigned_at = new Date().toISOString();
  }

  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .update(update)
    .eq("id", enrollmentId)
    .select("client_id, lead_id")
    .single();

  if (error) {
    return { ok: false as const, error: error.message };
  }

  await appendTouchEvent({
    lead_id: enrollment.lead_id ?? undefined,
    client_id: enrollment.client_id,
    enrollment_id: enrollmentId,
    event_type: "enrollment_updated",
    source: "server",
    payload: patch
  });

  return { ok: true as const };
}
