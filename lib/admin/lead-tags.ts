/**
 * Lead tagging helpers. Wraps the `lead_tags` table:
 *   - listLeadTags(leadId): grouped by category, unresolved first
 *   - addLeadTag(...): idempotent insert (skips if active duplicate)
 *   - removeLeadTag(tagId)
 *   - resolveLeadTag(tagId): for objections that have been addressed
 *   - unresolveLeadTag(tagId)
 *   - setUrgency(...): updates leads.urgency_* columns
 */

import { logAudit } from "@/lib/crm/audit-log";
import type { TagCategory, UrgencyLevel } from "@/lib/admin/lead-tag-suggestions";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type LeadTag = {
  id: string;
  lead_id: string;
  category: TagCategory;
  tag: string;
  note: string | null;
  source: string;
  source_detail: string | null;
  evidence: Record<string, unknown>;
  created_at: string;
  created_by: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolved_note: string | null;
};

export type LeadTagsByCategory = Record<TagCategory, LeadTag[]>;

export async function listLeadTags(leadId: string): Promise<LeadTag[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_tags")
    .select("*")
    .eq("lead_id", leadId)
    .order("category", { ascending: true })
    .order("resolved_at", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("listLeadTags failed", error.message);
    return [];
  }
  return (data ?? []) as LeadTag[];
}

export function groupTagsByCategory(tags: LeadTag[]): LeadTagsByCategory {
  const out: LeadTagsByCategory = {
    buying_trigger: [],
    objection: [],
    priority: [],
    data_quality: []
  };
  for (const t of tags) {
    if (out[t.category]) out[t.category].push(t);
  }
  return out;
}

export type AddLeadTagInput = {
  leadId: string;
  category: TagCategory;
  tag: string;
  note?: string | null;
  source?: "manual" | "gemini" | "intake" | "quiz" | "cron";
  sourceDetail?: string | null;
  evidence?: Record<string, unknown>;
  createdBy?: string | null;
};

export async function addLeadTag(
  input: AddLeadTagInput
): Promise<{ ok: true; inserted: boolean; tag: LeadTag } | { ok: false; error: string }> {
  const supabase = requireSupabaseAdmin();
  const tagSlug = input.tag.trim();
  if (!tagSlug) return { ok: false, error: "empty_tag" };

  // Check for existing unresolved with the same (lead, category, tag).
  const { data: existing } = await supabase
    .from("lead_tags")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("category", input.category)
    .eq("tag", tagSlug)
    .is("resolved_at", null)
    .maybeSingle();

  if (existing) {
    // Optionally append note / merge evidence on duplicate.
    const mergedEvidence = {
      ...(existing.evidence as Record<string, unknown> | null ?? {}),
      ...(input.evidence ?? {})
    };
    const nextNote = input.note
      ? existing.note
        ? `${existing.note}\n${input.note}`
        : input.note
      : existing.note;

    const { data: updated, error: updErr } = await supabase
      .from("lead_tags")
      .update({ note: nextNote, evidence: mergedEvidence })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (updErr || !updated) {
      return { ok: false, error: updErr?.message ?? "update_failed" };
    }
    return { ok: true, inserted: false, tag: updated as LeadTag };
  }

  const { data, error } = await supabase
    .from("lead_tags")
    .insert({
      lead_id: input.leadId,
      category: input.category,
      tag: tagSlug,
      note: input.note ?? null,
      source: input.source ?? "manual",
      source_detail: input.sourceDetail ?? null,
      evidence: input.evidence ?? {},
      created_by: input.createdBy ?? null
    })
    .select("*")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "insert_failed" };

  void logAudit({
    entityType: "lead",
    entityId: input.leadId,
    action: `tag:added:${input.category}`,
    source: input.source === "manual" ? "manual" : input.source === "gemini" ? "gemini" : "cron",
    actor: input.createdBy ?? null,
    after: { tag: tagSlug, note: input.note, source_detail: input.sourceDetail },
    notes: input.note ?? null
  });

  return { ok: true, inserted: true, tag: data as LeadTag };
}

export async function removeLeadTag(
  tagId: string,
  actor?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = requireSupabaseAdmin();
  const { data: before } = await supabase
    .from("lead_tags")
    .select("lead_id, category, tag")
    .eq("id", tagId)
    .maybeSingle();
  const { error } = await supabase.from("lead_tags").delete().eq("id", tagId);
  if (error) return { ok: false, error: error.message };

  if (before) {
    void logAudit({
      entityType: "lead",
      entityId: before.lead_id,
      action: `tag:removed:${before.category}`,
      source: "manual",
      actor: actor ?? null,
      before: { tag: before.tag }
    });
  }
  return { ok: true };
}

export async function resolveLeadTag(
  tagId: string,
  note?: string | null,
  actor?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = requireSupabaseAdmin();
  const { data: before } = await supabase
    .from("lead_tags")
    .select("lead_id, category, tag")
    .eq("id", tagId)
    .maybeSingle();
  const { error } = await supabase
    .from("lead_tags")
    .update({
      resolved_at: new Date().toISOString(),
      resolved_by: actor ?? null,
      resolved_note: note ?? null
    })
    .eq("id", tagId);
  if (error) return { ok: false, error: error.message };

  if (before) {
    void logAudit({
      entityType: "lead",
      entityId: before.lead_id,
      action: `tag:resolved:${before.category}`,
      source: "manual",
      actor: actor ?? null,
      after: { tag: before.tag, resolved_note: note ?? null }
    });
  }
  return { ok: true };
}

export async function unresolveLeadTag(
  tagId: string,
  actor?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = requireSupabaseAdmin();
  const { data: before } = await supabase
    .from("lead_tags")
    .select("lead_id, category, tag")
    .eq("id", tagId)
    .maybeSingle();
  const { error } = await supabase
    .from("lead_tags")
    .update({ resolved_at: null, resolved_by: null, resolved_note: null })
    .eq("id", tagId);
  if (error) return { ok: false, error: error.message };

  if (before) {
    void logAudit({
      entityType: "lead",
      entityId: before.lead_id,
      action: `tag:reopened:${before.category}`,
      source: "manual",
      actor: actor ?? null
    });
  }
  return { ok: true };
}

export type SetUrgencyInput = {
  leadId: string;
  level: UrgencyLevel | null;
  reason?: string | null;
  source?: "manual" | "gemini" | "intake";
  actor?: string | null;
};

export async function setLeadUrgency(
  input: SetUrgencyInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = requireSupabaseAdmin();
  const { data: before } = await supabase
    .from("leads")
    .select("urgency_level, urgency_reason")
    .eq("id", input.leadId)
    .maybeSingle();

  const { error } = await supabase
    .from("leads")
    .update({
      urgency_level: input.level,
      urgency_reason: input.reason ?? null,
      urgency_source: input.level ? input.source ?? "manual" : null,
      urgency_set_at: input.level ? new Date().toISOString() : null
    })
    .eq("id", input.leadId);

  if (error) return { ok: false, error: error.message };

  void logAudit({
    entityType: "lead",
    entityId: input.leadId,
    action: "urgency_updated",
    source: input.source === "gemini" ? "gemini" : "manual",
    actor: input.actor ?? null,
    before: {
      urgency_level: before?.urgency_level ?? null,
      urgency_reason: before?.urgency_reason ?? null
    },
    after: { urgency_level: input.level, urgency_reason: input.reason ?? null }
  });

  return { ok: true };
}
