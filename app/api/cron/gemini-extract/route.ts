/**
 * Cron: Gemini extraction for attended Strategy Calls.
 *
 * Schedule: every 15 min via .github/workflows/crm-cron.yml.
 *
 * For each lead_calls row with call_status = "attended" and
 * transcript_extracted_at IS NULL:
 *   1. Find the Gemini Notes + Transcript doc in Drive (by event time +
 *      parent last name).
 *   2. Fetch transcript plain text via Docs API.
 *   3. Call Gemini Flash with extraction prompt → structured payload.
 *   4. Persist on lead_calls (summary, call_score, next_step_decision,
 *      notes_doc_url, transcript_doc_url, transcript_extracted_at).
 *   5. Create lead_tasks for each action_item.
 *   6. Create a Gmail draft for the post-call email.
 *
 * Caps at 8 calls per run to bound Gemini cost (≈ $0.005/call at flash rates).
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { createLeadTask } from "@/lib/admin/lead-tasks";
import { addLeadTag, setLeadUrgency } from "@/lib/admin/lead-tags";
import type { TagCategory } from "@/lib/admin/lead-tag-suggestions";
import {
  extractCallFromTranscript,
  type ExtractedTag
} from "@/lib/integrations/gemini/extract-call";
import { findCallNotesDoc } from "@/lib/integrations/google/drive";
import { getDocPlainText } from "@/lib/integrations/google/docs";
import { createGmailDraft } from "@/lib/integrations/google/gmail-drafts";
import { primaryGoogleOwnerEmail } from "@/lib/integrations/google/tokens";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PER_RUN = 8;

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
  const ownerEmail = primaryGoogleOwnerEmail();
  const supabase = requireSupabaseAdmin();

  const { data: pending, error } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, call_at, scheduled_start, scheduled_end, summary, attendance_decided_at, leads:lead_id(parent_first, parent_last, parent_email, student_first, student_grade, target_exam, sat_baseline, main_goal, additional_context, sales_notes)"
    )
    .eq("call_status", "attended")
    .is("transcript_extracted_at", null)
    .not("attendance_decided_at", "is", null)
    .order("attendance_decided_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<Record<string, unknown>> = [];

  for (const row of (pending ?? []) as ExtractRow[]) {
    try {
      results.push(await processOne({ row, ownerEmail }));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      results.push({ callId: row.id, error: message });
      void logAudit({
        entityType: "lead_call",
        entityId: row.id,
        action: "gemini_extract_failed",
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
    processed: results.length,
    results,
    elapsed_ms: Date.now() - startedAt
  });
}

type ExtractRow = {
  id: string;
  lead_id: string | null;
  call_at: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  summary: string | null;
  attendance_decided_at: string | null;
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
      }
    | null
    | Array<unknown>;
};

async function processOne(args: {
  row: ExtractRow;
  ownerEmail: string;
}): Promise<Record<string, unknown>> {
  const { row, ownerEmail } = args;
  const lead = Array.isArray(row.leads)
    ? ((row.leads[0] ?? null) as ExtractRow["leads"])
    : row.leads;

  if (!lead || typeof lead === "object" && Array.isArray(lead)) {
    return { callId: row.id, skipped: "no_lead" };
  }
  const l = lead as Exclude<ExtractRow["leads"], Array<unknown> | null>;

  const start = new Date(row.scheduled_start ?? row.call_at);
  const end = new Date(row.scheduled_end ?? new Date(start.getTime() + 60 * 60_000));

  const docs = await findCallNotesDoc({
    ownerEmail,
    callStart: start,
    callEnd: end,
    parentLast: l.parent_last
  });

  if (!docs.transcript) {
    return { callId: row.id, skipped: "no_transcript_doc_found" };
  }

  const transcript = await getDocPlainText({
    ownerEmail,
    documentId: docs.transcript.id
  });
  if (!transcript || transcript.length < 200) {
    return { callId: row.id, skipped: "transcript_too_short" };
  }

  const intakeBlob = [
    l.student_grade && `Grade: ${l.student_grade}`,
    l.target_exam && `Target exam: ${l.target_exam}`,
    l.sat_baseline && `SAT baseline: ${l.sat_baseline}`,
    l.main_goal && `Main goal: ${l.main_goal}`,
    l.additional_context && `Notes: ${l.additional_context}`,
    l.sales_notes && `Owner notes: ${l.sales_notes}`
  ]
    .filter(Boolean)
    .join("\n");

  const extracted = await extractCallFromTranscript({
    transcript,
    parentFirst: l.parent_first,
    studentFirst: l.student_first,
    intakeSummary: intakeBlob || null
  });

  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_calls")
    .update({
      summary: extracted.summary,
      transcript,
      transcript_extracted_at: new Date().toISOString(),
      next_step_decision: extracted.next_step_decision,
      notes_doc_url: docs.notes?.webViewLink ?? null,
      transcript_doc_url: docs.transcript.webViewLink ?? null,
      call_score: extracted.call_score as unknown as object
    })
    .eq("id", row.id);

  void logAudit({
    entityType: "lead_call",
    entityId: row.id,
    action: "gemini_extract:applied",
    source: "gemini",
    after: {
      next_step_decision: extracted.next_step_decision,
      call_score_overall: extracted.call_score.overall
    },
    notes: extracted.call_score.rationale
  });

  // Create tasks (owner-assigned items only; parent/student items are FYI).
  let tasksCreated = 0;
  if (row.lead_id) {
    for (const a of extracted.action_items) {
      if (a.assignee && a.assignee !== "owner") continue;
      try {
        await createLeadTask({
          leadId: row.lead_id,
          leadCallId: row.id,
          kind: a.kind,
          title: a.title,
          body: a.notes ?? null,
          dueAt: a.due_at ?? null,
          source: "gemini",
          sourceDetail: "gemini-extract",
          highlight: a.kind === "post_call"
        });
        tasksCreated += 1;
      } catch (e) {
        console.warn("createLeadTask failed", e instanceof Error ? e.message : e);
      }
    }
  }

  // Apply structured CRM tags + urgency.
  let tagsCreated = 0;
  if (row.lead_id) {
    const buckets: Array<{ category: TagCategory; items: ExtractedTag[] }> = [
      { category: "buying_trigger", items: extracted.buying_triggers ?? [] },
      { category: "objection", items: extracted.objections ?? [] },
      { category: "priority", items: extracted.priorities ?? [] }
    ];
    for (const b of buckets) {
      for (const item of b.items) {
        const slug = slugify(item.tag);
        if (!slug) continue;
        const r = await addLeadTag({
          leadId: row.lead_id,
          category: b.category,
          tag: slug,
          note: item.note ?? null,
          source: "gemini",
          sourceDetail: "gemini-extract",
          evidence: { call_id: row.id }
        });
        if (r.ok && r.inserted) tagsCreated += 1;
      }
    }

    if (extracted.urgency?.level) {
      await setLeadUrgency({
        leadId: row.lead_id,
        level: extracted.urgency.level,
        reason: extracted.urgency.reason ?? null,
        source: "gemini",
        actor: "gemini-extract"
      });
    }
  }

  // Create the Gmail draft.
  let draftId: string | null = null;
  try {
    const draft = await createGmailDraft({
      ownerEmail,
      to: l.parent_email,
      subject: extracted.draft_email.subject,
      bodyText: extracted.draft_email.body_text
    });
    draftId = draft.id;
    await supabase
      .from("lead_calls")
      .update({ gmail_draft_id: draftId })
      .eq("id", row.id);
  } catch (e) {
    console.warn("gmail draft creation failed", e instanceof Error ? e.message : e);
  }

  return {
    callId: row.id,
    nextStep: extracted.next_step_decision,
    score: extracted.call_score.overall,
    tasksCreated,
    tagsCreated,
    urgency: extracted.urgency?.level ?? null,
    draftId
  };
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}
