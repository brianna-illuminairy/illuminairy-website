/**
 * Cron: task reconciler. Every 30 minutes.
 *
 * Auto-completes open `lead_tasks` whose conditions have been met out-of-band:
 *
 *   - kind = "confirm_attendance" → mark done if the parent call's
 *     call_status is no longer booked/confirmed (i.e. we've decided
 *     attended/no_show/etc.).
 *
 *   - kind = "post_call" (Gemini draft email) → mark done if an outbound
 *     lead_emails row for the parent exists with sent_at >= task.created_at.
 *
 *   - kind = "general" with `lead_task.body` containing "Reply to" →
 *     mark done if leads.awaiting_reply_since is null OR more recent than
 *     task.created_at (i.e. they replied OR we replied).
 *
 *   - any task whose lead is now stage = "lost" or "won" → cancel.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return run(req);
}
export async function GET(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest): Promise<NextResponse> {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) return cronErrorResponse(auth);

  const startedAt = Date.now();
  const supabase = requireSupabaseAdmin();

  const { data: openTasks } = await supabase
    .from("lead_tasks")
    .select(
      "id, lead_id, lead_call_id, kind, title, body, created_at, leads:lead_id(stage, parent_email, awaiting_reply_since)"
    )
    .eq("status", "open")
    .limit(500);

  let completed = 0;
  let canceled = 0;

  for (const t of (openTasks ?? []) as TaskRow[]) {
    const lead = Array.isArray(t.leads) ? t.leads[0] : t.leads;
    if (!lead) continue;

    // Stage-based cancel
    if (lead.stage === "lost" || lead.stage === "won") {
      await supabase.from("lead_tasks").update({ status: "canceled" }).eq("id", t.id);
      void logAudit({
        entityType: "lead_task",
        entityId: t.id,
        action: "lead_task:canceled",
        source: "cron",
        notes: `Lead stage advanced to ${lead.stage}.`
      });
      canceled += 1;
      continue;
    }

    if (t.kind === "confirm_attendance" && t.lead_call_id) {
      const { data: call } = await supabase
        .from("lead_calls")
        .select("call_status")
        .eq("id", t.lead_call_id)
        .maybeSingle();
      if (call && !["booked", "confirmed"].includes(call.call_status)) {
        await complete(t.id, "Attendance was decided.");
        completed += 1;
      }
      continue;
    }

    if (t.kind === "post_call" || t.kind === "follow_up_email") {
      const { data: sent } = await supabase
        .from("lead_emails")
        .select("id")
        .eq("lead_id", t.lead_id)
        .eq("direction", "outbound")
        .gte("sent_at", t.created_at)
        .limit(1);
      if ((sent?.length ?? 0) > 0) {
        await complete(t.id, "Outbound email sent to this lead.");
        completed += 1;
      }
      continue;
    }

    if (t.kind === "general" || t.kind === "post_call_check_in") {
      // Mark done if a reply has been received since the task was created.
      if (
        lead.awaiting_reply_since === null ||
        (lead.awaiting_reply_since && new Date(lead.awaiting_reply_since) > new Date(t.created_at))
      ) {
        // No-op — too noisy to auto-complete general tasks. We only act on
        // post_call / follow_up_email / confirm_attendance.
        continue;
      }
    }
  }

  async function complete(taskId: string, reason: string): Promise<void> {
    await supabase
      .from("lead_tasks")
      .update({
        status: "done",
        completed_at: new Date().toISOString(),
        completed_by: "cron:reconciler"
      })
      .eq("id", taskId);
    void logAudit({
      entityType: "lead_task",
      entityId: taskId,
      action: "lead_task:auto_completed",
      source: "cron",
      notes: reason
    });
  }

  return NextResponse.json({
    ok: true,
    examined: openTasks?.length ?? 0,
    completed,
    canceled,
    elapsed_ms: Date.now() - startedAt
  });
}

type TaskRow = {
  id: string;
  lead_id: string;
  lead_call_id: string | null;
  kind: string;
  title: string;
  body: string | null;
  created_at: string;
  leads:
    | { stage: string; parent_email: string; awaiting_reply_since: string | null }
    | Array<{ stage: string; parent_email: string; awaiting_reply_since: string | null }>
    | null;
};
