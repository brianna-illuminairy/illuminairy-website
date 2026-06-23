/**
 * Apply an attendance decision to a `lead_calls` row. Used by:
 *   - `app/api/cron/meet-attendance/route.ts` (auto from Meet API)
 *   - admin override buttons in the Calls tab (Phase 5)
 *   - Calendly `invitee_no_show.created` webhook (Phase 4)
 *
 * Handles four cases:
 *   1. `attended`     — mark attended, advance lead.stage, audit log.
 *   2. `no_show`      — mark no_show, schedule Calendly no-show POST for
 *                       (now + 10 min) via `calendly_no_show_pending_until`,
 *                       audit log. The actual POST is performed by the cron
 *                       once the window elapses (and only if status is still
 *                       no_show).
 *   3. `confirm`      — keep call_status as-is, create a "confirm_attendance"
 *                       lead_task so the owner can decide manually.
 *   4. `override`     — owner cancels a pending no-show during the 10-min
 *                       window. Clears pending_until + audit + reverts status.
 */

import { logAudit, type AuditSource } from "@/lib/crm/audit-log";
import { fireLeadMilestone } from "@/lib/crm/ga4-milestones";
import { requireSupabaseAdmin } from "@/lib/supabase/server";
import {
  attributionFromLeadFbclid,
  makeMetaEventId,
  metaCapiUserFromLead,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import { appendTouchEvent } from "@/lib/crm/touch";
import { PLAN_BUILDER_FUNNEL_ID, PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";
import { trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { KlaviyoEvents } from "@/lib/analytics-registry";

const NO_SHOW_WINDOW_MIN = 10;

export type CallAttendanceUpdate = {
  callId: string;
  decision:
    | "attended"
    | "no_show"
    | "confirm" // create a manual "confirm whether attended" task (ambiguous Meet)
    | "override"
    | "confirm_received" // parent confirmed they will attend (pre-call)
    | "flag_risk" // mark the call as a no-show risk
    | "clear_risk"; // owner clears the risk flag (false alarm)
  source: AuditSource;
  actor?: string | null;
  attendanceSource?: "meet_api" | "manual" | "calendly_no_show" | "webhook";
  confidence?: number | null;
  identityMatch?: string | null;
  joinedAt?: Date | null;
  leftAt?: Date | null;
  participants?: unknown[];
  meetConferenceId?: string | null;
  notes?: string | null;
  /** Where the confirmation came from, when decision === "confirm_received". */
  confirmationSource?: "manual" | "reply" | "sms" | "calendly";
  /** Why this is a risk, when decision === "flag_risk". */
  riskReason?:
    | "confirmation_email_bounced"
    | "email_suppressed"
    | "no_reply_24h"
    | "manual_owner_flag";
  /** Where the risk signal came from, when decision === "flag_risk". */
  riskSource?: "gmail_sync" | "suppression_check" | "manual" | "cron";
};

export async function applyCallAttendance(update: CallAttendanceUpdate): Promise<void> {
  const supabase = requireSupabaseAdmin();

  const { data: before } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, call_status, call_type, attendance_source, confidence, identity_match, joined_at, left_at, participants, meet_conference_id, calendly_no_show_pending_until, no_show_risk, no_show_risk_reason, confirmed_at, confirmation_source"
    )
    .eq("id", update.callId)
    .maybeSingle();

  if (!before) {
    throw new Error(`lead_call ${update.callId} not found`);
  }

  if (update.decision === "attended") {
    await supabase
      .from("lead_calls")
      .update({
        call_status: "attended",
        attendance_source: update.attendanceSource ?? "manual",
        attendance_decided_at: new Date().toISOString(),
        attendance_decided_by: update.source,
        confidence: update.confidence ?? null,
        identity_match: update.identityMatch ?? null,
        joined_at: update.joinedAt?.toISOString() ?? null,
        left_at: update.leftAt?.toISOString() ?? null,
        participants: (update.participants ?? []) as object,
        meet_conference_id: update.meetConferenceId ?? null,
        calendly_no_show_pending_until: null
      })
      .eq("id", update.callId);

    if (before.lead_id) {
      // Advance lead stage if currently in call_booked. This fires the
      // existing `auto_schedule_lead_followup` trigger which sets the next
      // post-call task.
      await supabase
        .from("leads")
        .update({ stage: "call_attended" })
        .eq("id", before.lead_id)
        .in("stage", ["intake_submitted", "call_booked", "no_show"]);
    }

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "call_status:attended",
      source: update.source,
      actor: update.actor ?? null,
      before: { call_status: before.call_status },
      after: { call_status: "attended", attendance_source: update.attendanceSource },
      notes: update.notes ?? null
    });

    if (before.lead_id) {
      void fireLeadMilestone({
        leadId: before.lead_id,
        milestone: "lead_call_attended",
        extra: { call_id: update.callId, attendance_source: update.attendanceSource ?? "manual" }
      });

      if (before.call_type === "free_lesson") {
        const { data: lead } = await supabase
          .from("leads")
          .select(
            "id, parent_email, parent_first, parent_last, parent_phone, fbclid, meta_fbp, meta_fbc, meta_fbc_ts, meta_client_ip, meta_client_user_agent"
          )
          .eq("id", before.lead_id)
          .maybeSingle();

        if (lead?.parent_email) {
          const eventId = makeMetaEventId("free_lesson_attended", update.callId);
          void sendMetaCapiEvent(
            "FreeLessonAttended",
            eventId,
            metaCapiUserFromLead({ ...lead, parent_email: lead.parent_email }),
            { funnel: PLAN_BUILDER_FUNNEL_ID, call_type: "free_lesson" },
            attributionFromLeadFbclid(lead.fbclid)
          );
          void trackKlaviyoEvent(lead.parent_email, KlaviyoEvents.freeLessonAttended, {
            call_id: update.callId,
            funnel: PLAN_BUILDER_FUNNEL_ID,
          });

          void appendTouchEvent({
            lead_id: before.lead_id,
            event_type: "lab_lesson_attended",
            source: update.source === "webhook" ? "webhook" : "server",
            payload: {
              call_id: update.callId,
              funnel: "sat_quiz_b",
              plan_builder_variant: PLAN_BUILDER_VARIANT,
              attendance_source: update.attendanceSource ?? "manual",
            },
          });

          void fireLeadMilestone({
            leadId: before.lead_id,
            milestone: "lab_lesson_attended",
            extra: {
              call_id: update.callId,
              call_type: "free_lesson",
              funnel: PLAN_BUILDER_FUNNEL_ID,
            },
          });
        }
      }
    }
    return;
  }

  if (update.decision === "no_show") {
    const pendingUntil = new Date(Date.now() + NO_SHOW_WINDOW_MIN * 60_000);
    await supabase
      .from("lead_calls")
      .update({
        call_status: "no_show",
        attendance_source: update.attendanceSource ?? "manual",
        attendance_decided_at: new Date().toISOString(),
        attendance_decided_by: update.source,
        confidence: update.confidence ?? null,
        identity_match: update.identityMatch ?? null,
        joined_at: update.joinedAt?.toISOString() ?? null,
        left_at: update.leftAt?.toISOString() ?? null,
        participants: (update.participants ?? []) as object,
        meet_conference_id: update.meetConferenceId ?? null,
        calendly_no_show_pending_until: pendingUntil.toISOString()
      })
      .eq("id", update.callId);

    if (before.lead_id) {
      await supabase
        .from("leads")
        .update({ stage: "no_show" })
        .eq("id", before.lead_id)
        .in("stage", ["intake_submitted", "call_booked"]);
    }

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "call_status:no_show",
      source: update.source,
      actor: update.actor ?? null,
      before: { call_status: before.call_status },
      after: {
        call_status: "no_show",
        attendance_source: update.attendanceSource,
        calendly_no_show_pending_until: pendingUntil.toISOString()
      },
      notes: update.notes ?? `Calendly no-show POST queued for ${pendingUntil.toISOString()}.`
    });

    if (before.lead_id) {
      void fireLeadMilestone({
        leadId: before.lead_id,
        milestone: "lead_call_no_show",
        extra: { call_id: update.callId }
      });
    }
    return;
  }

  if (update.decision === "confirm") {
    if (!before.lead_id) return;
    // Create or refresh a "confirm_attendance" task; skip if one already open.
    const { data: existing } = await supabase
      .from("lead_tasks")
      .select("id")
      .eq("lead_id", before.lead_id)
      .eq("lead_call_id", update.callId)
      .eq("kind", "confirm_attendance")
      .eq("status", "open")
      .maybeSingle();

    if (!existing) {
      await supabase.from("lead_tasks").insert({
        lead_id: before.lead_id,
        lead_call_id: update.callId,
        kind: "confirm_attendance",
        title: "Confirm whether the parent attended this Strategy Call",
        body: update.notes ?? "Meet attendance was ambiguous — check Drive recording or ask.",
        due_at: new Date().toISOString(),
        source: update.source,
        source_detail: "meet_api_ambiguous",
        status: "open",
        is_highlighted: true
      });
    }

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "call_status:confirm_requested",
      source: update.source,
      actor: update.actor ?? null,
      before: { call_status: before.call_status },
      after: { call_status: before.call_status, confidence: update.confidence ?? null },
      notes: update.notes ?? null
    });
    return;
  }

  if (update.decision === "confirm_received") {
    // Parent confirmed they will attend. Advance call_status to "confirmed"
    // if currently "booked", clear any risk flag, set confirmed_at + source.
    const now = new Date().toISOString();
    const nextStatus =
      before.call_status === "booked" || before.call_status === null
        ? "confirmed"
        : before.call_status;

    await supabase
      .from("lead_calls")
      .update({
        call_status: nextStatus,
        confirmed_at: now,
        confirmation_source: update.confirmationSource ?? "manual",
        no_show_risk: false,
        no_show_risk_reason: null,
        no_show_risk_set_at: null,
        no_show_risk_source: null
      })
      .eq("id", update.callId);

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "call_status:confirmed",
      source: update.source,
      actor: update.actor ?? null,
      before: {
        call_status: before.call_status,
        confirmed_at: before.confirmed_at,
        no_show_risk: before.no_show_risk
      },
      after: {
        call_status: nextStatus,
        confirmed_at: now,
        confirmation_source: update.confirmationSource ?? "manual"
      },
      notes: update.notes ?? null
    });
    return;
  }

  if (update.decision === "flag_risk") {
    // Mark this booking as at-risk of no-show. Does not change call_status —
    // just raises the owner's attention. Idempotent: if already flagged with
    // the same reason, no-op (avoids audit spam from cron).
    if (
      before.no_show_risk === true &&
      before.no_show_risk_reason === (update.riskReason ?? null)
    ) {
      return;
    }
    const now = new Date().toISOString();
    await supabase
      .from("lead_calls")
      .update({
        no_show_risk: true,
        no_show_risk_reason: update.riskReason ?? "manual_owner_flag",
        no_show_risk_source: update.riskSource ?? "manual",
        no_show_risk_set_at: now
      })
      .eq("id", update.callId);

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "no_show_risk:flagged",
      source: update.source,
      actor: update.actor ?? null,
      before: { no_show_risk: before.no_show_risk },
      after: {
        no_show_risk: true,
        no_show_risk_reason: update.riskReason ?? "manual_owner_flag",
        no_show_risk_source: update.riskSource ?? "manual"
      },
      notes: update.notes ?? null
    });
    return;
  }

  if (update.decision === "clear_risk") {
    if (before.no_show_risk !== true) return;
    await supabase
      .from("lead_calls")
      .update({
        no_show_risk: false,
        no_show_risk_reason: null,
        no_show_risk_set_at: null,
        no_show_risk_source: null
      })
      .eq("id", update.callId);

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "no_show_risk:cleared",
      source: update.source,
      actor: update.actor ?? null,
      before: {
        no_show_risk: true,
        no_show_risk_reason: before.no_show_risk_reason
      },
      after: { no_show_risk: false },
      notes: update.notes ?? null
    });
    return;
  }

  if (update.decision === "override") {
    // Owner cancels a pending no-show during the 10-min window. Revert call
    // back to booked/confirmed so it can re-decide later.
    await supabase
      .from("lead_calls")
      .update({
        call_status: "booked",
        calendly_no_show_pending_until: null,
        attendance_decided_at: new Date().toISOString(),
        attendance_decided_by: update.source,
        attendance_source: null
      })
      .eq("id", update.callId);

    if (before.lead_id) {
      await supabase
        .from("leads")
        .update({ stage: "call_booked" })
        .eq("id", before.lead_id)
        .eq("stage", "no_show");
    }

    void logAudit({
      entityType: "lead_call",
      entityId: update.callId,
      action: "call_status:no_show_canceled_by_owner",
      source: update.source,
      actor: update.actor ?? null,
      before: { call_status: before.call_status },
      after: { call_status: "booked" },
      notes: update.notes ?? "Owner overrode pending no-show within 10-min window."
    });
    return;
  }
}

export { NO_SHOW_WINDOW_MIN };
