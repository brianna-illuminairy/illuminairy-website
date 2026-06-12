import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCrmLeadDetail } from "@/lib/admin/crm-queries";
import { isFollowupKind } from "@/lib/admin/followup-kinds";
import { updateLeadPipeline } from "@/lib/crm/admin";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const detail = await getCrmLeadDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...detail });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  let body: {
    stage?: string;
    lost_reason?: string | null;
    sales_notes?: string | null;
    next_followup_at?: string | null;
    next_followup_note?: string | null;
    next_followup_kind?: string | null;
    attended?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const patch: Parameters<typeof updateLeadPipeline>[1] = {};
  if (body.stage) {
    patch.stage = body.stage;
  }
  if (body.lost_reason !== undefined) {
    patch.lost_reason = body.lost_reason;
  }
  if (body.sales_notes !== undefined) {
    patch.sales_notes = body.sales_notes;
  }
  if (body.next_followup_at !== undefined) {
    patch.next_followup_at = body.next_followup_at;
  }
  if (body.next_followup_note !== undefined) {
    patch.next_followup_note = body.next_followup_note;
  }
  if (body.next_followup_kind !== undefined) {
    if (body.next_followup_kind !== null && !isFollowupKind(body.next_followup_kind)) {
      return NextResponse.json(
        { error: "Invalid next_followup_kind." },
        { status: 400 }
      );
    }
    patch.next_followup_kind = body.next_followup_kind;
  }
  if (body.attended === true) {
    patch.attended_at = new Date().toISOString();
    if (!body.stage) {
      patch.stage = "call_attended";
    }
  } else if (body.attended === false) {
    patch.attended_at = null;
  }

  const result = await updateLeadPipeline(id, patch);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
