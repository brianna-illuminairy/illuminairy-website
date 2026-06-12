/**
 * Manual lead merge — moves lead_calls, lead_emails, lead_tasks,
 * notes and follow-up state from the "duplicate" lead onto the "target"
 * lead. The duplicate is then marked stage=lost with a lost_reason of
 * "merged_into_<target_id>". We never delete leads — this preserves the
 * audit chain.
 *
 * POST body: { duplicateLeadId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { recordIdentityMerge } from "@/lib/crm/identity-stitching";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id: targetLeadId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { duplicateLeadId?: string };
  const dupId = body.duplicateLeadId;
  if (!dupId || dupId === targetLeadId) {
    return NextResponse.json({ error: "invalid_duplicate" }, { status: 400 });
  }

  const supabase = requireSupabaseAdmin();

  const { data: target } = await supabase
    .from("leads")
    .select("id, parent_email")
    .eq("id", targetLeadId)
    .maybeSingle();
  const { data: dup } = await supabase
    .from("leads")
    .select("id, parent_email, stage, sales_notes")
    .eq("id", dupId)
    .maybeSingle();

  if (!target || !dup) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Reassign related rows to the target lead.
  for (const tbl of ["lead_calls", "lead_emails", "lead_tasks", "identity_links"]) {
    await supabase.from(tbl).update({ lead_id: targetLeadId }).eq("lead_id", dupId);
  }

  const notesAppend = dup.sales_notes
    ? `\n\n[Merged from ${dup.parent_email} on ${new Date().toISOString().slice(0, 10)}]\n${dup.sales_notes}`
    : "";

  if (notesAppend) {
    const { data: tgtFull } = await supabase
      .from("leads")
      .select("sales_notes")
      .eq("id", targetLeadId)
      .maybeSingle();
    await supabase
      .from("leads")
      .update({ sales_notes: (tgtFull?.sales_notes ?? "") + notesAppend })
      .eq("id", targetLeadId);
  }

  await supabase
    .from("leads")
    .update({
      stage: "lost",
      lost_reason: `merged_into_${targetLeadId}`,
      updated_at: new Date().toISOString()
    })
    .eq("id", dupId);

  await recordIdentityMerge({
    targetLeadId,
    mergedFromLeadId: dupId,
    source: "manual_admin_merge"
  });

  await logAudit({
    entityType: "lead",
    entityId: targetLeadId,
    action: "lead_merged",
    source: "manual",
    actor: "admin",
    after: { merged_from_lead_id: dupId, duplicate_email: dup.parent_email },
    notes: `Manual merge: ${dup.parent_email} → ${target.parent_email}`
  });

  return NextResponse.json({ ok: true });
}
