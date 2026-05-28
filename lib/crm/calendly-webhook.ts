import { appendTouchEvent } from "@/lib/crm/touch";
import { trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";

type CalendlyInviteePayload = {
  email?: string;
  name?: string;
  uri?: string;
  event?: string;
  created_at?: string;
};

type CalendlyWebhookBody = {
  event?: string;
  payload?: CalendlyInviteePayload;
};

export async function handleCalendlyInviteeCreated(body: CalendlyWebhookBody) {
  const invitee = body.payload;
  const email = invitee?.email?.trim().toLowerCase();
  if (!email) {
    return { ok: false as const, error: "missing_email" };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const bookedAt = invitee?.created_at ?? new Date().toISOString();

  const { data: lead } = await supabase
    .from("leads")
    .select("id, visitor_id, parent_first, parent_last")
    .eq("parent_email", email)
    .maybeSingle();

  if (lead) {
    await supabase
      .from("leads")
      .update({
        stage: "call_booked",
        booked_call_at: bookedAt,
        calendly_event_uri: invitee?.uri ?? null
      })
      .eq("id", lead.id);

    await appendTouchEvent({
      visitor_id: lead.visitor_id ?? undefined,
      lead_id: lead.id,
      event_type: "call_booked",
      source: "webhook",
      payload: { calendly_uri: invitee?.uri, invitee_email: email }
    });
  } else {
    await appendTouchEvent({
      event_type: "call_booked",
      source: "webhook",
      payload: {
        calendly_uri: invitee?.uri,
        invitee_email: email,
        note: "no_matching_lead"
      }
    });
  }

  void trackKlaviyoEvent(email, "Quiz Call Booked", {
    calendly_uri: invitee?.uri ?? "",
    funnel: "sat_quiz"
  });
  void trackKlaviyoEvent(email, "Consultation Booked", {
    calendly_uri: invitee?.uri ?? ""
  });

  const eventId = makeMetaEventId(
    "schedule",
    lead?.id ?? invitee?.uri?.split("/").pop() ?? email
  );
  void sendMetaCapiEvent("Schedule", eventId, { email });

  return { ok: true as const, leadId: lead?.id, eventId };
}

export async function handleCalendlyInviteeCanceled(body: CalendlyWebhookBody) {
  const email = body.payload?.email?.trim().toLowerCase();
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
      payload: { calendly_uri: body.payload?.uri }
    });
  }

  return { ok: true as const };
}
