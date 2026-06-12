/**
 * Multi-slot lead tasks. CRM v4 — replaces the single `next_followup_at`
 * field (which is still kept in sync via the `sync_highlighted_followup`
 * trigger for backward compatibility).
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type LeadTask = {
  id: string;
  lead_id: string;
  lead_call_id: string | null;
  kind: string;
  title: string;
  body: string | null;
  due_at: string | null;
  source: "manual" | "trigger" | "cron" | "webhook" | "gemini";
  source_detail: string | null;
  status: "open" | "done" | "snoozed" | "canceled";
  completed_at: string | null;
  completed_by: string | null;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;
};

export async function listLeadTasks(leadId: string, limit = 100): Promise<LeadTask[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_tasks")
    .select(
      "id, lead_id, lead_call_id, kind, title, body, due_at, source, source_detail, status, completed_at, completed_by, is_highlighted, created_at, updated_at"
    )
    .eq("lead_id", leadId)
    .order("status", { ascending: true }) // open first (lex order)
    .order("due_at", { ascending: true, nullsFirst: false })
    .limit(limit);
  if (error) {
    throw new Error(`listLeadTasks failed: ${error.message}`);
  }
  return (data ?? []) as LeadTask[];
}

export type CreateLeadTaskInput = {
  leadId: string;
  leadCallId?: string | null;
  kind: string;
  title: string;
  body?: string | null;
  dueAt?: string | null;
  source?: "manual" | "trigger" | "cron" | "webhook" | "gemini";
  sourceDetail?: string | null;
  highlight?: boolean;
};

export async function createLeadTask(input: CreateLeadTaskInput): Promise<LeadTask> {
  const supabase = requireSupabaseAdmin();

  // If `highlight` requested, clear other open highlighted tasks for this
  // lead first so the partial-unique index doesn't fire.
  if (input.highlight) {
    await supabase
      .from("lead_tasks")
      .update({ is_highlighted: false })
      .eq("lead_id", input.leadId)
      .eq("status", "open")
      .eq("is_highlighted", true);
  }

  const { data, error } = await supabase
    .from("lead_tasks")
    .insert({
      lead_id: input.leadId,
      lead_call_id: input.leadCallId ?? null,
      kind: input.kind,
      title: input.title,
      body: input.body ?? null,
      due_at: input.dueAt ?? null,
      source: input.source ?? "manual",
      source_detail: input.sourceDetail ?? null,
      is_highlighted: input.highlight ?? false
    })
    .select(
      "id, lead_id, lead_call_id, kind, title, body, due_at, source, source_detail, status, completed_at, completed_by, is_highlighted, created_at, updated_at"
    )
    .single();
  if (error || !data) {
    throw new Error(`createLeadTask failed: ${error?.message ?? "no data"}`);
  }
  return data as LeadTask;
}

export async function completeLeadTask(
  taskId: string,
  completedBy?: string
): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_tasks")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
      completed_by: completedBy ?? "admin"
    })
    .eq("id", taskId);
}

export async function snoozeLeadTask(taskId: string, dueAt: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_tasks")
    .update({ due_at: dueAt, status: "open" })
    .eq("id", taskId);
}

export async function cancelLeadTask(taskId: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_tasks")
    .update({ status: "canceled" })
    .eq("id", taskId);
}

export async function highlightLeadTask(taskId: string, leadId: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_tasks")
    .update({ is_highlighted: false })
    .eq("lead_id", leadId)
    .eq("status", "open")
    .eq("is_highlighted", true);
  await supabase
    .from("lead_tasks")
    .update({ is_highlighted: true })
    .eq("id", taskId);
}
