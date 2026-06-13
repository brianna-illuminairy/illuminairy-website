/**
 * Cron: Calendly history reconcile. Every 6 hours. Pulls scheduled_events
 * over the last 30 days, ensures each event has a matching `lead_calls` row,
 * and notes divergences (e.g. Calendly says canceled but we still show
 * booked).
 *
 * Does NOT mark no-shows here — that's already handled by the
 * `invitee_no_show.*` webhooks + Meet attendance cron. This run is purely a
 * defense-in-depth backfill in case a webhook was missed.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { getCalendlyClient } from "@/lib/integrations/calendly/client";
import {
  extractMeetCode,
  meetLinkFromCalendlyPayload
} from "@/lib/integrations/google/meet";
import {
  getCalendarEvent,
  meetUrlFromCalendarEvent
} from "@/lib/integrations/google/calendar";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const LOOKBACK_DAYS = 30;

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
  const calendly = getCalendlyClient();

  let me;
  try {
    me = await calendly.me();
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "calendly_me_failed"
      },
      { status: 200 }
    );
  }

  const minStart = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000).toISOString();
  const events = await calendly.listScheduledEvents({
    organizationUri: me.current_organization,
    minStartTime: minStart,
    count: 100
  });

  let reconciled = 0;
  let inserted = 0;
  const divergences: Array<{ eventUri: string; reason: string }> = [];

  for (const ev of events) {
    let invitees;
    try {
      invitees = await calendly.listInvitees(ev.uri);
    } catch (e) {
      divergences.push({
        eventUri: ev.uri,
        reason: e instanceof Error ? e.message : "list_invitees_failed"
      });
      continue;
    }
    for (const inv of invitees) {
      const result = await reconcileInvitee({ supabase, event: ev, invitee: inv });
      reconciled += 1;
      if (result.inserted) inserted += 1;
      if (result.divergence) divergences.push(result.divergence);
    }
  }

  void recordHeartbeat({
    provider: "calendly",
    status: "ok",
    latencyMs: Date.now() - startedAt
  });

  return NextResponse.json({
    ok: true,
    events: events.length,
    reconciled,
    inserted,
    divergences,
    elapsed_ms: Date.now() - startedAt
  });
}

type SupabaseAdmin = ReturnType<typeof requireSupabaseAdmin>;

async function reconcileInvitee(args: {
  supabase: SupabaseAdmin;
  event: {
    uri: string;
    start_time: string;
    end_time: string;
    status: string;
    location?: unknown;
  };
  invitee: {
    uri: string;
    email: string;
    status: string;
    no_show?: { uri: string } | null;
  };
}): Promise<{ inserted: boolean; divergence?: { eventUri: string; reason: string } }> {
  const { supabase, event, invitee } = args;
  const inviteeUri = invitee.uri;
  const email = invitee.email.toLowerCase();

  const { data: leadRow } = await supabase
    .from("leads")
    .select("id")
    .eq("parent_email", email)
    .maybeSingle();
  const leadId = leadRow?.id ?? null;

  // Step 1: try to extract the Meet URL from the Calendly event payload. For
  // events booked into Calendly's Google integration this is usually a
  // redirector (calendly.com/events/<id>/google_meet) that doesn't contain
  // the real meet.google.com code.
  let { meetLink, meetCode } = meetLinkFromCalendlyPayload({
    location: event.location,
    scheduled_event: event
  });

  // Step 2: if we didn't get a real Meet code, look up the underlying Google
  // Calendar event. Calendly stores its id at calendar_event.external_id.
  // The Calendar event carries the real hangoutLink. We swallow lookup errors
  // (most likely scope/permissions) so the rest of the reconcile still runs.
  if (!meetCode) {
    const calEventId = (
      event as { calendar_event?: { external_id?: string } | null }
    ).calendar_event?.external_id;
    if (calEventId) {
      try {
        const cal = await getCalendarEvent({ eventId: calEventId });
        const url = cal ? meetUrlFromCalendarEvent(cal) : null;
        const code = extractMeetCode(url);
        if (url && code) {
          meetLink = url;
          meetCode = code;
        }
      } catch (e) {
        console.warn(
          "calendly-history: calendar lookup failed for",
          calEventId,
          e instanceof Error ? e.message : e
        );
      }
    }
  }

  // Compute the call_status implied by Calendly state:
  //   - invitee canceled  -> "canceled"
  //   - invitee no_show   -> "no_show"
  //   - else              -> we don't downgrade an already-attended/qualified row
  const calendlyStatus =
    invitee.status === "canceled"
      ? "canceled"
      : invitee.no_show
      ? "no_show"
      : null;

  const { data: existing } = await supabase
    .from("lead_calls")
    .select("id, call_status, lead_id")
    .eq("calendly_invitee_uri", inviteeUri)
    .maybeSingle();

  const baseFields = {
    lead_id: leadId,
    call_at: event.start_time,
    scheduled_start: event.start_time,
    scheduled_end: event.end_time,
    meet_link: meetLink,
    meet_space_code: meetCode,
    calendly_event_uri: event.uri,
    calendly_invitee_uri: inviteeUri,
    calendly_no_show_uri: invitee.no_show?.uri ?? null
  };

  if (!existing) {
    const { error } = await supabase.from("lead_calls").insert({
      ...baseFields,
      call_status: calendlyStatus ?? "booked"
    });
    if (error) {
      return {
        inserted: false,
        divergence: { eventUri: event.uri, reason: `insert_failed: ${error.message}` }
      };
    }
    void logAudit({
      entityType: "lead_call",
      action: "lead_call:reconciled_from_history",
      source: "cron",
      after: baseFields,
      notes: "Created retroactively from Calendly history reconcile."
    });
    return { inserted: true };
  }

  // Existing row: only patch metadata + downgrade to canceled/no_show if the
  // Calendly authority says so AND our row hasn't been promoted past those.
  const updates: Record<string, unknown> = {};
  if (calendlyStatus === "canceled" && existing.call_status === "booked") {
    updates.call_status = "canceled";
  }
  if (
    calendlyStatus === "no_show" &&
    !["attended", "qualified", "closed", "recovered"].includes(existing.call_status)
  ) {
    updates.call_status = "no_show";
    updates.attendance_source = "calendly_no_show";
  }
  // Backfill the Meet link/code if we have one from Calendly and the row
  // doesn't already store it. The old check `!existing.lead_id` was a typo
  // for `!existing.meet_space_code` — it permanently blocked backfill on every
  // real row (which always has a lead_id from the original webhook insert).
  if (meetCode) {
    const { data: existingMeet } = await supabase
      .from("lead_calls")
      .select("meet_space_code")
      .eq("id", existing.id)
      .maybeSingle();
    if (!existingMeet?.meet_space_code) {
      updates.meet_link = meetLink;
      updates.meet_space_code = meetCode;
    }
  }
  if (Object.keys(updates).length > 0) {
    await supabase.from("lead_calls").update(updates).eq("id", existing.id);
    void logAudit({
      entityType: "lead_call",
      entityId: existing.id,
      action: "lead_call:patched_from_history",
      source: "cron",
      before: { call_status: existing.call_status },
      after: updates,
      notes: "Calendly history reconcile."
    });
  }
  return { inserted: false };
}
