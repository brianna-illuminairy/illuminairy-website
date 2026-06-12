/**
 * Thin helper around `crm_audit_log`. Writes are best-effort — never block the
 * main mutation because the audit insert failed. Use `logAudit()` from any
 * place that changes a tracked entity.
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type AuditSource = "manual" | "cron" | "webhook" | "gemini" | "trigger";
export type AuditEntityType = "lead" | "lead_call" | "lead_task" | "integration";

export type AuditEntry = {
  entityType: AuditEntityType;
  entityId?: string | null;
  action: string;
  source: AuditSource;
  actor?: string | null;
  before?: unknown;
  after?: unknown;
  notes?: string | null;
};

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const supabase = requireSupabaseAdmin();
    await supabase.from("crm_audit_log").insert({
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      action: entry.action,
      source: entry.source,
      actor: entry.actor ?? null,
      before_value: entry.before ?? null,
      after_value: entry.after ?? null,
      notes: entry.notes ?? null
    });
  } catch (e) {
    console.warn(
      "crm_audit_log insert failed",
      entry.action,
      e instanceof Error ? e.message : e
    );
  }
}
