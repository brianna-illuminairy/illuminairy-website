import { getSupabaseAdmin } from "@/lib/supabase/server";

export type LeadCall = {
  id: string;
  lead_id: string | null;
  client_id: string | null;
  call_at: string;
  duration_minutes: number | null;
  summary: string | null;
  transcript: string | null;
  recording_url: string | null;
  created_at: string;
  updated_at: string;
  // CRM v4 extensions
  call_status: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  meet_link: string | null;
  meet_conference_id: string | null;
  attendance_source: string | null;
  attendance_decided_at: string | null;
  attendance_decided_by: string | null;
  joined_at: string | null;
  left_at: string | null;
  participants: unknown[] | null;
  identity_match: string | null;
  confidence: number | null;
  calendly_no_show_uri: string | null;
  calendly_no_show_pending_until: string | null;
  transcript_extracted_at: string | null;
  notes_doc_url: string | null;
  transcript_doc_url: string | null;
  next_step_decision: string | null;
  call_score: Record<string, unknown> | null;
  gmail_draft_id: string | null;
  no_show_risk: boolean | null;
  no_show_risk_reason: string | null;
  no_show_risk_set_at: string | null;
  no_show_risk_source: string | null;
  confirmed_at: string | null;
  confirmation_source: string | null;
};

const LEAD_CALL_SELECT =
  "id, lead_id, client_id, call_at, duration_minutes, summary, transcript, recording_url, created_at, updated_at, call_status, scheduled_start, scheduled_end, meet_link, meet_conference_id, attendance_source, attendance_decided_at, attendance_decided_by, joined_at, left_at, participants, identity_match, confidence, calendly_no_show_uri, calendly_no_show_pending_until, transcript_extracted_at, notes_doc_url, transcript_doc_url, next_step_decision, call_score, gmail_draft_id, no_show_risk, no_show_risk_reason, no_show_risk_set_at, no_show_risk_source, confirmed_at, confirmation_source";

export type LeadCallInput = {
  lead_id?: string | null;
  client_id?: string | null;
  call_at?: string;
  duration_minutes?: number | null;
  summary?: string | null;
  transcript?: string | null;
  recording_url?: string | null;
};

export async function listLeadCalls(opts: {
  leadId?: string;
  clientId?: string;
}): Promise<LeadCall[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let q = supabase
    .from("lead_calls")
    .select(LEAD_CALL_SELECT)
    .order("call_at", { ascending: false })
    .limit(200);

  if (opts.leadId) {
    q = q.eq("lead_id", opts.leadId);
  } else if (opts.clientId) {
    q = q.eq("client_id", opts.clientId);
  }

  const { data, error } = await q;
  if (error) {
    console.error("listLeadCalls", error);
    return [];
  }
  return (data ?? []) as LeadCall[];
}

export async function createLeadCall(input: LeadCallInput): Promise<
  { ok: true; call: LeadCall } | { ok: false; error: string }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "supabase_not_configured" };

  if (!input.lead_id && !input.client_id) {
    return { ok: false, error: "must_specify_lead_or_client" };
  }

  const insertRow = {
    lead_id: input.lead_id ?? null,
    client_id: input.client_id ?? null,
    call_at: input.call_at ?? new Date().toISOString(),
    duration_minutes: input.duration_minutes ?? null,
    summary: input.summary ?? null,
    transcript: input.transcript ?? null,
    recording_url: input.recording_url ?? null
  };

  const { data, error } = await supabase
    .from("lead_calls")
    .insert(insertRow)
    .select(LEAD_CALL_SELECT)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  // Bump lead/client last_activity_at when applicable.
  if (input.lead_id) {
    await supabase
      .from("leads")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", input.lead_id);
  }

  return { ok: true, call: data as LeadCall };
}

export async function updateLeadCall(
  id: string,
  patch: Partial<LeadCallInput>
): Promise<{ ok: true; call: LeadCall } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("lead_calls")
    .update(patch)
    .eq("id", id)
    .select(LEAD_CALL_SELECT)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "update_failed" };
  }
  return { ok: true, call: data as LeadCall };
}

export async function deleteLeadCall(id: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "supabase_not_configured" };
  const { error } = await supabase.from("lead_calls").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
