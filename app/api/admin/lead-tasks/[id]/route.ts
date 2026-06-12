import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  cancelLeadTask,
  completeLeadTask,
  highlightLeadTask,
  snoozeLeadTask
} from "@/lib/admin/lead-tasks";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;

  let body: { action?: string; dueAt?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* allow empty */
  }

  try {
    if (body.action === "complete") {
      await completeLeadTask(id);
    } else if (body.action === "snooze" && body.dueAt) {
      await snoozeLeadTask(id, body.dueAt);
    } else if (body.action === "cancel") {
      await cancelLeadTask(id);
    } else if (body.action === "highlight") {
      const supabase = requireSupabaseAdmin();
      const { data: row } = await supabase
        .from("lead_tasks")
        .select("lead_id")
        .eq("id", id)
        .maybeSingle();
      if (!row?.lead_id) {
        return NextResponse.json({ error: "task_not_found" }, { status: 404 });
      }
      await highlightLeadTask(id, row.lead_id);
    } else {
      return NextResponse.json({ error: "bad_action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
