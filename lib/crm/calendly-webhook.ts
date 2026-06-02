import { strategyCallStartFromCalendlyWebhook } from "@/lib/crm/calendly-payload";
import { appendTouchEvent } from "@/lib/crm/touch";
import { trackKlaviyoEvent, upsertKlaviyoProfile } from "@/lib/klaviyo-server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";

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
    .select("id, visitor_id, parent_first, parent_last")
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

  const eventId = makeMetaEventId(
    "schedule",
    lead?.id ?? calendlyUri?.split("/").pop() ?? email
  );
  void sendMetaCapiEvent("Schedule", eventId, { email });

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
