import { createAdminAlert } from "@/lib/admin/alerts";
import { strategyCallStartFromCalendlyWebhook } from "@/lib/crm/calendly-payload";
import { appendTouchEvent } from "@/lib/crm/touch";
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

  if (lead) {
    await supabase
      .from("leads")
      .update({
        stage: "call_booked",
        booked_call_at: strategyCallAt,
        calendly_event_uri: calendlyUri
      })
      .eq("id", lead.id);

    await appendTouchEvent({
      visitor_id: lead.visitor_id ?? undefined,
      lead_id: lead.id,
      event_type: "call_booked",
      source: "webhook",
      payload: {
        calendly_uri: calendlyUri,
        invitee_email: email,
        strategy_call_at: strategyCallAt
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

  if (lead) {
    await appendTouchEvent({
      visitor_id: lead.visitor_id ?? undefined,
      lead_id: lead.id,
      event_type: "call_canceled",
      source: "webhook",
      payload: { calendly_uri: invitee?.uri }
    });
  }

  void trackKlaviyoEvent(email, "Quiz Call Canceled", {
    calendly_uri: typeof invitee?.uri === "string" ? invitee.uri : "",
    funnel: "sat_quiz"
  });

  return { ok: true as const };
}
