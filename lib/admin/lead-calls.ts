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
};

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
    .select(
      "id, lead_id, client_id, call_at, duration_minutes, summary, transcript, recording_url, created_at, updated_at"
    )
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
    .select(
      "id, lead_id, client_id, call_at, duration_minutes, summary, transcript, recording_url, created_at, updated_at"
    )
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
    .select(
      "id, lead_id, client_id, call_at, duration_minutes, summary, transcript, recording_url, created_at, updated_at"
    )
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
