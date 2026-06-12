import { createAdminAlert } from "@/lib/admin/alerts";
import { logAudit } from "@/lib/crm/audit-log";
import { fireLeadMilestone } from "@/lib/crm/ga4-milestones";
import {
  scheduledEventUriFromCalendlyWebhook,
  strategyCallEndFromCalendlyWebhook,
  strategyCallStartFromCalendlyWebhook
} from "@/lib/crm/calendly-payload";
import { appendTouchEvent } from "@/lib/crm/touch";
import { meetLinkFromCalendlyPayload } from "@/lib/integrations/google/meet";
import { trackKlaviyoEvent, upsertKlaviyoProfile } from "@/lib/klaviyo-server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  attributionFromLeadFbclid,
  metaCapiUserFromLead,
  sendMetaCapiEvent
} from "@/lib/meta-capi";

type CalendlyWebhookBody = {
  event?: string;
  payload?: Record<string, unknown>;
};

export async function handleCalendlyInviteeCreated(body: CalendlyWebhookBody) {
  const invitee = body.payload;
  const email =
    typeof invitee?.email === "string" ? invitee.email.trim().toLowerCase() : "";
  if (!email) {
    return { ok: false as const, error: "missing_email" };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const bookedAt =
    typeof invitee?.created_at === "string"
      ? invitee.created_at
      : new Date().toISOString();
  const strategyCallAt = strategyCallStartFromCalendlyWebhook(invitee) ?? bookedAt;

  const { data: lead } = await supabase
    .from("leads")
    .select(
      "id, visitor_id, parent_first, parent_last, parent_phone, fbclid, meta_fbp, meta_fbc, meta_fbc_ts, meta_client_ip, meta_client_user_agent"
    )
    .eq("parent_email", email)
    .maybeSingle();

  const calendlyUri =
    typeof invitee?.uri === "string" ? invitee.uri : null;

  const strategyCallEnd = strategyCallEndFromCalendlyWebhook(invitee);
  const scheduledEventUri = scheduledEventUriFromCalendlyWebhook(invitee);
  const { meetLink, meetCode } = meetLinkFromCalendlyPayload(invitee);

  if (lead) {
    await supabase
      .from("leads")
      .update({
        stage: "call_booked",
        booked_call_at: strategyCallAt,
        calendly_event_uri: calendlyUri
      })
      .eq("id", lead.id);

    // Create or refresh the lead_calls row for this Strategy Call so the
    // meet-attendance cron has somewhere to record participants. We key on
    // calendly_invitee_uri (unique per booking).
    if (calendlyUri) {
      const { data: existing } = await supabase
        .from("lead_calls")
        .select("id")
        .eq("calendly_invitee_uri", calendlyUri)
        .maybeSingle();

      const callRow = {
        lead_id: lead.id,
        call_at: strategyCallAt,
        scheduled_start: strategyCallAt,
        scheduled_end: strategyCallEnd,
        meet_link: meetLink,
        meet_space_code: meetCode,
        calendly_event_uri: scheduledEventUri ?? null,
        calendly_invitee_uri: calendlyUri,
        call_status: "booked" as const
      };

      if (existing) {
        await supabase.from("lead_calls").update(callRow).eq("id", existing.id);
      } else {
        const { data: inserted } = await supabase
          .from("lead_calls")
          .insert(callRow)
          .select("id")
          .single();
        if (inserted?.id) {
          void logAudit({
            entityType: "lead_call",
            entityId: inserted.id,
            action: "lead_call:created",
            source: "webhook",
            after: callRow,
            notes: "Created by Calendly invitee.created webhook."
          });
        }
      }
    }

    await appendTouchEvent({
      visitor_id: lead.visitor_id ?? undefined,
      lead_id: lead.id,
      event_type: "call_booked",
      source: "webhook",
      payload: {
        calendly_uri: calendlyUri,
        invitee_email: email,
        strategy_call_at: strategyCallAt,
        meet_link: meetLink
      }
    });

    void createAdminAlert({
      alertType: "call_booked",
      severity: "info",
      title: `Strategy Call booked: ${email}`,
      body: `Scheduled for ${new Date(strategyCallAt).toLocaleString("en-US", { timeZone: "America/New_York" })} ET.`,
      source: "calendly",
      linkUrl: "/admin/crm",
      dedupeKey: calendlyUri ? `calendly:${calendlyUri}` : `calendly_book:${email}:${strategyCallAt}`
    });

    void fireLeadMilestone({
      leadId: lead.id,
      milestone: "lead_call_booked",
      extra: { calendly_uri: calendlyUri ?? "", strategy_call_at: strategyCallAt }
    });
  } else {
    await appendTouchEvent({
      event_type: "call_booked",
      source: "webhook",
      payload: {
        calendly_uri: calendlyUri,
        invitee_email: email,
        strategy_call_at: strategyCallAt,
        note: "no_matching_lead"
      }
    });
  }

  const klaviyoProps = {
    calendly_uri: calendlyUri ?? "",
    funnel: "sat_quiz",
    strategy_call_at: strategyCallAt
  };

  void upsertKlaviyoProfile(email, { properties: klaviyoProps });
  void trackKlaviyoEvent(email, "Quiz Call Booked", klaviyoProps);
  void trackKlaviyoEvent(email, "Consultation Booked", {
    calendly_uri: calendlyUri ?? "",
    strategy_call_at: strategyCallAt
  });

  // Deterministic event_id shared with the client pixel — Finale.tsx fires
  // `schedule_${inviteeUri.split('/').pop()}`, so deriving the same id from the
  // invitee uri lets Meta dedupe the pixel + CAPI Schedule into one conversion.
  const inviteeId = calendlyUri ? calendlyUri.split("/").pop() : null;
  const eventId = inviteeId
    ? `schedule_${inviteeId}`
    : `schedule_${lead?.id ?? email}`;
  const bookedAtSec = Math.floor(new Date(bookedAt).getTime() / 1000);
  const capiUser = lead
    ? metaCapiUserFromLead({ ...lead, parent_email: email }, email)
    : { email };
  void sendMetaCapiEvent(
    "Schedule",
    eventId,
    capiUser,
    { funnel: "sat_quiz" },
    lead ? attributionFromLeadFbclid(lead.fbclid) : undefined,
    { eventTimeSec: bookedAtSec }
  );

  return { ok: true as const, leadId: lead?.id, eventId, strategyCallAt };
}

export async function handleCalendlyInviteeCanceled(body: CalendlyWebhookBody) {
  const invitee = body.payload;
  const email =
    typeof invitee?.email === "string" ? invitee.email.trim().toLowerCase() : "";
  const supabase = getSupabaseAdmin();
  if (!email || !supabase) {
    return { ok: false as const };
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id, visitor_id")
    .eq("parent_email", email)
    .maybeSingle();

  const inviteeUri =
    typeof invitee?.uri === "string" ? invitee.uri : null;
  const rescheduled =
    typeof invitee?.rescheduled === "boolean" ? invitee.rescheduled : false;

  // Update the lead_calls row for this invitee. If rescheduled, mark
  // call_status = rescheduled (Phase 4 will chain it to the new event when
  // the new invitee.created webhook fires). Otherwise mark canceled.
  if (inviteeUri) {
    const newStatus = rescheduled ? "rescheduled" : "canceled";
    const { data: callRow } = await supabase
      .from("lead_calls")
      .select("id, call_status")
      .eq("calendly_invitee_uri", inviteeUri)
      .maybeSingle();
    if (callRow) {
      await supabase
        .from("lead_calls")
        .update({ call_status: newStatus })
        .eq("id", callRow.id);
      void logAudit({
        entityType: "lead_call",
        entityId: callRow.id,
        action: `call_status:${newStatus}`,
        source: "webhook",
        before: { call_status: callRow.call_status },
        after: { call_status: newStatus },
        notes: rescheduled
          ? "Invitee rescheduled (new event will arrive via invitee.created)."
          : "Invitee canceled."
      });
    }
  }

  if (lead) {
    await appendTouchEvent({
      visitor_id: lead.visitor_id ?? undefined,
      lead_id: lead.id,
      event_type: rescheduled ? "call_rescheduled" : "call_canceled",
      source: "webhook",
      payload: { calendly_uri: inviteeUri, rescheduled }
    });
  }

  void trackKlaviyoEvent(email, "Quiz Call Canceled", {
    calendly_uri: inviteeUri ?? "",
    funnel: "sat_quiz",
    rescheduled
  });

  return { ok: true as const, rescheduled };
}

/**
 * Calendly `invitee_no_show.created` webhook handler. Calendly sends this when
 * a user manually marks a no-show inside the Calendly UI. We mirror it onto
 * the lead_calls row.
 *
 * Payload shape:
 *   {
 *     "uri": "https://api.calendly.com/invitee_no_shows/{uuid}",
 *     "invitee": "https://api.calendly.com/scheduled_events/{ev}/invitees/{inv}",
 *     "created_at": "..."
 *   }
 */
export async function handleCalendlyInviteeNoShowCreated(body: CalendlyWebhookBody) {
  const p = body.payload;
  const inviteeUri =
    typeof (p as Record<string, unknown> | undefined)?.invitee === "string"
      ? ((p as Record<string, unknown>).invitee as string)
      : null;
  const noShowUri =
    typeof (p as Record<string, unknown> | undefined)?.uri === "string"
      ? ((p as Record<string, unknown>).uri as string)
      : null;
  if (!inviteeUri) return { ok: false as const, error: "missing_invitee" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  const { data: callRow } = await supabase
    .from("lead_calls")
    .select("id, lead_id, call_status")
    .eq("calendly_invitee_uri", inviteeUri)
    .maybeSingle();

  if (!callRow) {
    return { ok: false as const, error: "lead_call_not_found" };
  }

  await supabase
    .from("lead_calls")
    .update({
      call_status: "no_show",
      attendance_source: "calendly_no_show",
      attendance_decided_at: new Date().toISOString(),
      attendance_decided_by: "webhook",
      calendly_no_show_uri: noShowUri,
      calendly_no_show_pending_until: null
    })
    .eq("id", callRow.id);

  if (callRow.lead_id) {
    await supabase
      .from("leads")
      .update({ stage: "no_show" })
      .eq("id", callRow.lead_id)
      .in("stage", ["intake_submitted", "call_booked"]);
  }

  void logAudit({
    entityType: "lead_call",
    entityId: callRow.id,
    action: "call_status:no_show",
    source: "webhook",
    before: { call_status: callRow.call_status },
    after: { call_status: "no_show", attendance_source: "calendly_no_show" },
    notes: "Calendly invitee_no_show.created webhook."
  });

  return { ok: true as const, callId: callRow.id };
}

/** Calendly `invitee_no_show.deleted` webhook — owner undid the no-show in Calendly. */
export async function handleCalendlyInviteeNoShowDeleted(body: CalendlyWebhookBody) {
  const p = body.payload;
  const inviteeUri =
    typeof (p as Record<string, unknown> | undefined)?.invitee === "string"
      ? ((p as Record<string, unknown>).invitee as string)
      : null;
  if (!inviteeUri) return { ok: false as const, error: "missing_invitee" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  const { data: callRow } = await supabase
    .from("lead_calls")
    .select("id, lead_id, call_status")
    .eq("calendly_invitee_uri", inviteeUri)
    .maybeSingle();

  if (!callRow) return { ok: false as const, error: "lead_call_not_found" };

  await supabase
    .from("lead_calls")
    .update({
      call_status: "booked",
      attendance_source: null,
      calendly_no_show_uri: null,
      calendly_no_show_pending_until: null
    })
    .eq("id", callRow.id);

  if (callRow.lead_id) {
    await supabase
      .from("leads")
      .update({ stage: "call_booked" })
      .eq("id", callRow.lead_id)
      .eq("stage", "no_show");
  }

  void logAudit({
    entityType: "lead_call",
    entityId: callRow.id,
    action: "call_status:no_show_reverted_by_calendly",
    source: "webhook",
    before: { call_status: callRow.call_status },
    after: { call_status: "booked" },
    notes: "Calendly invitee_no_show.deleted webhook (owner undid the no-show in Calendly UI)."
  });

  return { ok: true as const, callId: callRow.id };
}
