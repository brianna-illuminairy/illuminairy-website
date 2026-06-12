/**
 * Audit-log + score-history readers for the per-lead Audit and Score tabs.
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type AuditRow = {
  id: string;
  entity_type: "lead" | "lead_call" | "lead_task" | "integration";
  entity_id: string | null;
  action: string;
  source: "manual" | "cron" | "webhook" | "gemini" | "trigger";
  actor: string | null;
  before_value: unknown;
  after_value: unknown;
  notes: string | null;
  created_at: string;
};

export type ScoreHistoryRow = {
  id: string;
  lead_id: string;
  score: number;
  components: {
    base: number;
    intake: number;
    engagement: number;
    decay: number;
    call: number;
    explanation?: string;
  };
  reason: string;
  created_at: string;
};

export async function listLeadAudit(leadId: string, limit = 200): Promise<AuditRow[]> {
  const supabase = requireSupabaseAdmin();
  // Fetch direct entries on the lead + entries on related lead_calls + lead_tasks.
  const { data: leadEntries } = await supabase
    .from("crm_audit_log")
    .select("id, entity_type, entity_id, action, source, actor, before_value, after_value, notes, created_at")
    .eq("entity_type", "lead")
    .eq("entity_id", leadId)
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data: callIds } = await supabase
    .from("lead_calls")
    .select("id")
    .eq("lead_id", leadId);
  const callIdList = (callIds ?? []).map((r) => r.id);

  const { data: taskIds } = await supabase
    .from("lead_tasks")
    .select("id")
    .eq("lead_id", leadId);
  const taskIdList = (taskIds ?? []).map((r) => r.id);

  const callEntriesQuery = callIdList.length
    ? supabase
        .from("crm_audit_log")
        .select(
          "id, entity_type, entity_id, action, source, actor, before_value, after_value, notes, created_at"
        )
        .eq("entity_type", "lead_call")
        .in("entity_id", callIdList)
        .order("created_at", { ascending: false })
        .limit(limit)
    : Promise.resolve({ data: [] });

  const taskEntriesQuery = taskIdList.length
    ? supabase
        .from("crm_audit_log")
        .select(
          "id, entity_type, entity_id, action, source, actor, before_value, after_value, notes, created_at"
        )
        .eq("entity_type", "lead_task")
        .in("entity_id", taskIdList)
        .order("created_at", { ascending: false })
        .limit(limit)
    : Promise.resolve({ data: [] });

  const [callEntries, taskEntries] = await Promise.all([callEntriesQuery, taskEntriesQuery]);

  const all = [
    ...(leadEntries ?? []),
    ...(callEntries.data ?? []),
    ...(taskEntries.data ?? [])
  ] as AuditRow[];
  all.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return all.slice(0, limit);
}

export async function listLeadScoreHistory(leadId: string, limit = 200): Promise<ScoreHistoryRow[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_score_history")
    .select("id, lead_id, score, components, reason, created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new Error(`listLeadScoreHistory failed: ${error.message}`);
  }
  return (data ?? []) as ScoreHistoryRow[];
}
