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
    call: number;
    engagement: number;
    recency: number;
    attended_count?: number;
    recent_email_in?: number;
    recent_email_out?: number;
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

type DbScoreHistoryRow = {
  id: string;
  lead_id: string;
  score: number;
  breakdown: Record<string, unknown> | null;
  reason: string | null;
  recorded_at: string;
};

/** Map DB `breakdown` JSON to the Score tab component shape. */
export function normalizeScoreBreakdown(
  breakdown: Record<string, unknown> | null | undefined
): ScoreHistoryRow["components"] {
  const b = breakdown ?? {};
  const num = (key: string) => {
    const v = b[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  return {
    call: num("call_score"),
    engagement: num("engagement"),
    recency: num("recency"),
    attended_count: num("attended_count"),
    recent_email_in: num("recent_email_in"),
    recent_email_out: num("recent_email_out")
  };
}

export async function listLeadScoreHistory(leadId: string, limit = 200): Promise<ScoreHistoryRow[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_score_history")
    .select("id, lead_id, score, breakdown, reason, recorded_at")
    .eq("lead_id", leadId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new Error(`listLeadScoreHistory failed: ${error.message}`);
  }
  return ((data ?? []) as DbScoreHistoryRow[]).map((row) => ({
    id: row.id,
    lead_id: row.lead_id,
    score: row.score,
    components: normalizeScoreBreakdown(row.breakdown),
    reason: row.reason ?? "recompute",
    created_at: row.recorded_at
  }));
}
