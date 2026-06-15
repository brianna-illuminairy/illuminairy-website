import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCrmLeadDetail } from "@/lib/admin/crm-queries";
import { addLeadTag } from "@/lib/admin/lead-tags";
import { updateLeadPipeline } from "@/lib/crm/admin";
import { fireLeadMilestone } from "@/lib/crm/ga4-milestones";

export const dynamic = "force-dynamic";

/**
 * One-click ops: mark lead lost with invalid_contact_info, add data_quality tag,
 * clear follow-up slot, append sales note.
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: { note?: string | null } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }

  const detail = await getCrmLeadDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const leadRow = detail.lead as {
    sales_notes?: string | null;
    converted_client_id?: string | null;
  };

  if (leadRow.converted_client_id) {
    return NextResponse.json({ error: "lead_converted" }, { status: 400 });
  }

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const noteText = typeof body.note === "string" ? body.note.trim() : "";
  const line = noteText
    ? `[${stamp}] Invalid contact: ${noteText}`
    : `[${stamp}] Marked invalid contact (email/SMS bounce or fake lead).`;

  const priorNotes = leadRow.sales_notes?.trim() ?? "";
  const sales_notes = priorNotes ? `${priorNotes}\n\n${line}` : line;

  const result = await updateLeadPipeline(id, {
    stage: "lost",
    lost_reason: "invalid_contact_info",
    sales_notes,
    next_followup_at: null,
    next_followup_note: null,
    next_followup_kind: null
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  const tagResult = await addLeadTag({
    leadId: id,
    category: "data_quality",
    tag: "invalid_contact_info",
    note: noteText || null,
    source: "manual",
    sourceDetail: "mark_invalid_contact",
    createdBy: "admin"
  });

  if (!tagResult.ok) {
    console.warn("mark-invalid-contact: tag insert failed", tagResult.error);
  }

  void fireLeadMilestone({
    leadId: id,
    milestone: "lead_lost",
    extra: { lost_reason: "invalid_contact_info" }
  });

  return NextResponse.json({ ok: true, tagInserted: tagResult.ok ? tagResult.inserted : false });
}
