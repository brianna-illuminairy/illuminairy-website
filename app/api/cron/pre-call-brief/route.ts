/**
 * Cron: pre-call brief generation. Every 5 minutes.
 *
 * For each lead_calls row with:
 *   - call_status in (booked, confirmed)
 *   - scheduled_start between now and now+3h
 *   - no pre_call_briefs row yet (or context_hash changed)
 *
 * Generate a 1-page markdown briefing using `generatePreCallBriefMarkdown`
 * and store it in `pre_call_briefs`. Bound to 8 per run to limit Gemini cost.
 */

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { generatePreCallBriefMarkdown } from "@/lib/integrations/gemini/pre-call-brief";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PER_RUN = 8;
const LEAD_WINDOW_MS = 3 * 60 * 60 * 1000;

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
  const now = new Date();
  const lookAhead = new Date(now.getTime() + LEAD_WINDOW_MS);

  const { data: upcoming, error } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, scheduled_start, leads:lead_id(parent_first, parent_last, parent_email, student_first, student_grade, target_exam, sat_baseline, main_goal, additional_context, sales_notes, urgency_level, urgency_reason)"
    )
    .in("call_status", ["booked", "confirmed"])
    .gte("scheduled_start", now.toISOString())
    .lte("scheduled_start", lookAhead.toISOString())
    .order("scheduled_start", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<Record<string, unknown>> = [];

  for (const row of upcoming ?? []) {
    if (!row.lead_id) continue;
    try {
      results.push(await processOne(row as BriefRow));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      results.push({ callId: row.id, error: message });
      void logAudit({
        entityType: "lead_call",
        entityId: row.id,
        action: "pre_call_brief_failed",
        source: "cron",
        notes: message
      });
    }
  }

  void recordHeartbeat({
    provider: "gemini",
    status: "ok",
    latencyMs: Date.now() - startedAt
  });

  return NextResponse.json({
    ok: true,
    upcoming: upcoming?.length ?? 0,
    processed: results.length,
    results,
    elapsed_ms: Date.now() - startedAt
  });
}

type BriefRow = {
  id: string;
  lead_id: string;
  scheduled_start: string;
  leads:
    | {
        parent_first: string | null;
        parent_last: string | null;
        parent_email: string;
        student_first: string | null;
        student_grade: string | null;
        target_exam: string | null;
        sat_baseline: string | null;
        main_goal: string | null;
        additional_context: string | null;
        sales_notes: string | null;
        urgency_level: "low" | "medium" | "high" | "critical" | null;
        urgency_reason: string | null;
      }
    | Array<unknown>
    | null;
};

async function processOne(row: BriefRow): Promise<Record<string, unknown>> {
  const supabase = requireSupabaseAdmin();
  const lead = Array.isArray(row.leads)
    ? (row.leads[0] as BriefRow["leads"])
    : row.leads;
  if (!lead || Array.isArray(lead)) return { callId: row.id, skipped: "no_lead" };
  const l = lead as Exclude<BriefRow["leads"], Array<unknown> | null>;

  const pastCalls = await fetchPastCallsSummary(row.lead_id);
  const recentEmails = await fetchRecentEmailsSummary(row.lead_id);
  const tags = await fetchActiveTags(row.lead_id);

  const ctxHash = hashContext({
    callAt: row.scheduled_start,
    intake: l,
    pastCalls,
    recentEmails,
    tags
  });

  const { data: existing } = await supabase
    .from("pre_call_briefs")
    .select("context_hash")
    .eq("lead_call_id", row.id)
    .maybeSingle();
  if (existing?.context_hash === ctxHash) {
    return { callId: row.id, skipped: "unchanged" };
  }

  const markdown = await generatePreCallBriefMarkdown({
    parentFirst: l.parent_first,
    parentLast: l.parent_last,
    parentEmail: l.parent_email,
    studentFirst: l.student_first,
    studentGrade: l.student_grade,
    targetExam: l.target_exam,
    satBaseline: l.sat_baseline,
    mainGoal: l.main_goal,
    additionalContext: l.additional_context,
    salesNotes: l.sales_notes,
    pastCallsSummary: pastCalls,
    recentEmailsSummary: recentEmails,
    buyingTriggers: tags.buying_trigger,
    objections: tags.objection,
    priorities: tags.priority,
    urgencyLevel: l.urgency_level,
    urgencyReason: l.urgency_reason,
    callAt: new Date(row.scheduled_start).toLocaleString("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  });

  await supabase
    .from("pre_call_briefs")
    .upsert(
      {
        lead_id: row.lead_id,
        lead_call_id: row.id,
        context_hash: ctxHash,
        model: process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest",
        brief_markdown: markdown,
        generated_at: new Date().toISOString()
      },
      { onConflict: "lead_call_id" }
    );

  void logAudit({
    entityType: "lead_call",
    entityId: row.id,
    action: "pre_call_brief:generated",
    source: "gemini"
  });

  return { callId: row.id, generated: true, length: markdown.length };
}

async function fetchPastCallsSummary(leadId: string): Promise<string | null> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("lead_calls")
    .select("call_at, call_status, summary, next_step_decision")
    .eq("lead_id", leadId)
    .order("call_at", { ascending: false })
    .limit(5);
  if (!data || data.length === 0) return null;
  return data
    .map((c, i) => {
      const dt = new Date(c.call_at).toLocaleDateString("en-US", { timeZone: "America/New_York" });
      const status = c.call_status ?? "booked";
      const decision = c.next_step_decision ? ` (decision: ${c.next_step_decision})` : "";
      const summary = c.summary ? ` — ${String(c.summary).slice(0, 220)}` : "";
      return `${i + 1}. ${dt} [${status}]${decision}${summary}`;
    })
    .join("\n");
}

async function fetchRecentEmailsSummary(leadId: string): Promise<string | null> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("lead_emails")
    .select("direction, subject, snippet, sent_at")
    .eq("lead_id", leadId)
    .order("sent_at", { ascending: false })
    .limit(5);
  if (!data || data.length === 0) return null;
  return data
    .map((e, i) => {
      const dt = new Date(e.sent_at).toLocaleDateString("en-US", { timeZone: "America/New_York" });
      const dir = e.direction === "outbound" ? "→" : "←";
      return `${i + 1}. ${dir} ${dt} ${e.subject ?? "(no subject)"}: ${e.snippet ?? ""}`.slice(0, 280);
    })
    .join("\n");
}

async function fetchActiveTags(leadId: string): Promise<{
  buying_trigger: Array<{ tag: string; note?: string | null }>;
  objection: Array<{ tag: string; note?: string | null }>;
  priority: Array<{ tag: string; note?: string | null }>;
}> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("lead_tags")
    .select("category, tag, note, resolved_at")
    .eq("lead_id", leadId)
    .is("resolved_at", null);
  const out = {
    buying_trigger: [] as Array<{ tag: string; note?: string | null }>,
    objection: [] as Array<{ tag: string; note?: string | null }>,
    priority: [] as Array<{ tag: string; note?: string | null }>
  };
  for (const t of data ?? []) {
    const bucket = out[(t as { category: keyof typeof out }).category];
    if (!bucket) continue;
    bucket.push({ tag: t.tag as string, note: (t.note as string | null) ?? null });
  }
  return out;
}

function hashContext(ctx: unknown): string {
  return createHash("sha256").update(JSON.stringify(ctx)).digest("hex").slice(0, 32);
}
