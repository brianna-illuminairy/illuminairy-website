/**
 * Cron: poll Google Meet for attendance + commit queued Calendly no-shows.
 *
 * Run schedule: every 15 minutes via `.github/workflows/crm-cron.yml`.
 *
 * Phase A — attendance scan:
 *   For each lead_calls row with call_status in (booked, confirmed) and
 *   scheduled_end <= now - 5 min, look up the Meet conference, list
 *   participants, run identity match, and apply the decision.
 *
 * Phase B — no-show commit:
 *   For each lead_calls row with call_status = no_show and
 *   calendly_no_show_pending_until <= now, POST to Calendly
 *   invitee_no_shows. If the owner overrode the no-show during the 10-min
 *   window, the row's status will no longer be no_show — skip.
 *
 * Both phases are wrapped in try/catch per-call so one failure doesn't block
 * the rest of the batch.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { applyCallAttendance } from "@/lib/crm/lead-call-attendance";
import { logAudit } from "@/lib/crm/audit-log";
import { matchInviteeToParticipants } from "@/lib/crm/identity-match";
import { getCalendlyClient } from "@/lib/integrations/calendly/client";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";
import {
  getMeetSpaceByCode,
  listConferenceParticipants,
  listConferenceRecordsForSpace,
  participantIdentity
} from "@/lib/integrations/google/meet";
import { primaryGoogleOwnerEmail } from "@/lib/integrations/google/tokens";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type CallRow = {
  id: string;
  lead_id: string | null;
  call_status: string;
  call_at: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  meet_link: string | null;
  meet_space_code: string | null;
  meet_conference_id: string | null;
  calendly_invitee_uri: string | null;
  calendly_no_show_uri: string | null;
  leads: { parent_email: string; parent_first: string | null; parent_last: string | null } | null;
};

export async function POST(req: NextRequest) {
  return run(req);
}

export async function GET(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest): Promise<NextResponse> {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) {
    return cronErrorResponse(auth);
  }

  const startedAt = Date.now();
  const supabase = requireSupabaseAdmin();
  const ownerEmail = primaryGoogleOwnerEmail();

  // Phase A — attendance scan (calls whose scheduled_end is at least 5 min in
  // the past). We cap at 50 per run to bound API spend.
  const cutoff = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data: pending, error: pendingErr } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, call_status, call_at, scheduled_start, scheduled_end, meet_link, meet_space_code, meet_conference_id, calendly_invitee_uri, calendly_no_show_uri, leads:lead_id(parent_email, parent_first, parent_last)"
    )
    .in("call_status", ["booked", "confirmed"])
    .lte("scheduled_end", cutoff)
    .limit(50)
    .order("scheduled_end", { ascending: true });

  const scanResults: Array<Record<string, unknown>> = [];

  if (pendingErr) {
    return NextResponse.json({ error: pendingErr.message }, { status: 500 });
  }

  for (const call of (pending ?? []) as unknown as CallRow[]) {
    try {
      scanResults.push(await processOneCall(call, ownerEmail));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      scanResults.push({ callId: call.id, error: msg });
      void logAudit({
        entityType: "lead_call",
        entityId: call.id,
        action: "meet_attendance_scan_failed",
        source: "cron",
        notes: msg
      });
    }
  }

  // Phase B — commit queued no-shows whose 10-min window has elapsed.
  const { data: pendingNoShow, error: nsErr } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, call_status, calendly_invitee_uri, calendly_no_show_uri, calendly_no_show_pending_until"
    )
    .eq("call_status", "no_show")
    .is("calendly_no_show_uri", null)
    .lte("calendly_no_show_pending_until", new Date().toISOString())
    .limit(50);

  const commitResults: Array<Record<string, unknown>> = [];
  if (!nsErr) {
    for (const row of pendingNoShow ?? []) {
      try {
        commitResults.push(
          await commitCalendlyNoShow(
            row as {
              id: string;
              call_status: string;
              calendly_invitee_uri: string | null;
              calendly_no_show_pending_until: string | null;
            }
          )
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        commitResults.push({ callId: row.id, error: msg });
        void logAudit({
          entityType: "lead_call",
          entityId: row.id,
          action: "calendly_no_show_commit_failed",
          source: "cron",
          notes: msg
        });
      }
    }
  }

  void recordHeartbeat({
    provider: "google_meet",
    status: "ok",
    latencyMs: Date.now() - startedAt
  });

  return NextResponse.json({
    ok: true,
    scanned: scanResults.length,
    scanResults,
    committed: commitResults.length,
    commitResults,
    elapsed_ms: Date.now() - startedAt
  });
}

async function processOneCall(call: CallRow, ownerEmail: string): Promise<Record<string, unknown>> {
  if (!call.meet_space_code) {
    void logAudit({
      entityType: "lead_call",
      entityId: call.id,
      action: "meet_attendance_skipped",
      source: "cron",
      notes: "No meet_space_code on lead_calls row."
    });
    return { callId: call.id, skipped: "no_meet_space_code" };
  }

  const space = await getMeetSpaceByCode(call.meet_space_code);
  if (!space) {
    return { callId: call.id, skipped: "meet_space_not_found" };
  }

  const conferences = await listConferenceRecordsForSpace(space.name, 5);
  if (conferences.length === 0) {
    // The space exists but no conference has happened — clear no-show signal.
    if (!call.leads) {
      return { callId: call.id, skipped: "no_lead_relation" };
    }
    const decision = matchInviteeToParticipants({
      parentEmail: call.leads.parent_email,
      parentFirst: call.leads.parent_first,
      parentLast: call.leads.parent_last,
      ownerEmail,
      participants: [],
      scheduledEndAt: call.scheduled_end ? new Date(call.scheduled_end) : null
    });
    if (decision.confidence >= 0.9) {
      await applyCallAttendance({
        callId: call.id,
        decision: "no_show",
        source: "cron",
        attendanceSource: "meet_api",
        confidence: decision.confidence,
        identityMatch: decision.tier,
        notes: decision.notes
      });
    }
    return { callId: call.id, tier: decision.tier, decision: decision.confidence >= 0.9 ? "no_show" : "kept_booked" };
  }

  // Choose the most recent conference for this space.
  const conference = conferences[0];
  const participants = await listConferenceParticipants(conference.name, 50);

  if (!call.leads) {
    return { callId: call.id, skipped: "no_lead_relation" };
  }

  const match = matchInviteeToParticipants({
    parentEmail: call.leads.parent_email,
    parentFirst: call.leads.parent_first,
    parentLast: call.leads.parent_last,
    ownerEmail,
    participants,
    scheduledEndAt: call.scheduled_end ? new Date(call.scheduled_end) : null
  });

  const joinedAt = earliestJoin(participants);
  const leftAt = latestLeave(participants);

  if (match.confidence >= 0.9 && match.attended) {
    await applyCallAttendance({
      callId: call.id,
      decision: "attended",
      source: "cron",
      attendanceSource: "meet_api",
      confidence: match.confidence,
      identityMatch: match.tier,
      joinedAt,
      leftAt,
      participants: participants.map((p) => participantIdentity(p)),
      meetConferenceId: conference.name,
      notes: match.notes
    });
    return { callId: call.id, decision: "attended", tier: match.tier, confidence: match.confidence };
  }

  if (match.confidence >= 0.9 && !match.attended) {
    await applyCallAttendance({
      callId: call.id,
      decision: "no_show",
      source: "cron",
      attendanceSource: "meet_api",
      confidence: match.confidence,
      identityMatch: match.tier,
      participants: participants.map((p) => participantIdentity(p)),
      meetConferenceId: conference.name,
      notes: match.notes
    });
    return { callId: call.id, decision: "no_show", tier: match.tier, confidence: match.confidence };
  }

  // Ambiguous or one-token match: keep booked, create confirm task.
  await applyCallAttendance({
    callId: call.id,
    decision: "confirm",
    source: "cron",
    attendanceSource: "meet_api",
    confidence: match.confidence,
    identityMatch: match.tier,
    notes: match.notes
  });
  return {
    callId: call.id,
    decision: "confirm",
    tier: match.tier,
    confidence: match.confidence
  };
}

async function commitCalendlyNoShow(row: {
  id: string;
  call_status: string;
  calendly_invitee_uri: string | null;
  calendly_no_show_pending_until: string | null;
}): Promise<Record<string, unknown>> {
  if (!row.calendly_invitee_uri) {
    return { callId: row.id, skipped: "no_calendly_invitee_uri" };
  }
  const calendly = getCalendlyClient();
  const result = await calendly.markNoShow(row.calendly_invitee_uri);
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("lead_calls")
    .update({
      calendly_no_show_uri: result.uri,
      calendly_no_show_pending_until: null
    })
    .eq("id", row.id);

  void logAudit({
    entityType: "lead_call",
    entityId: row.id,
    action: "calendly_no_show_committed",
    source: "cron",
    after: { calendly_no_show_uri: result.uri },
    notes: "10-min owner-override window elapsed; Calendly no-show POSTed."
  });

  return { callId: row.id, calendly_no_show_uri: result.uri };
}

function earliestJoin(participants: Array<{ earliestStartTime?: string }>): Date | null {
  let best: number | null = null;
  for (const p of participants) {
    if (!p.earliestStartTime) continue;
    const t = new Date(p.earliestStartTime).getTime();
    if (!Number.isFinite(t)) continue;
    if (best === null || t < best) best = t;
  }
  return best ? new Date(best) : null;
}

function latestLeave(participants: Array<{ latestEndTime?: string }>): Date | null {
  let best: number | null = null;
  for (const p of participants) {
    if (!p.latestEndTime) continue;
    const t = new Date(p.latestEndTime).getTime();
    if (!Number.isFinite(t)) continue;
    if (best === null || t > best) best = t;
  }
  return best ? new Date(best) : null;
}
