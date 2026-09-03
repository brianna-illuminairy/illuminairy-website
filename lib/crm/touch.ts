import {
  attributionToTouchColumns,
  type AttributionSnapshot
} from "@/lib/attribution";
import { resolveFunnelId } from "@/lib/analytics/funnel-id";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { TouchEventInput } from "@/lib/crm/types";

export async function appendTouchEvent(input: TouchEventInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const attr = input.attribution ?? {};
  const payload = {
    ...(input.payload ?? {}),
    ...(typeof attr.hero_hook === "string" &&
    attr.hero_hook &&
    typeof input.payload?.hero_hook !== "string"
      ? { hero_hook: attr.hero_hook }
      : {}),
    ...(typeof attr.version === "string" &&
    attr.version &&
    typeof input.payload?.version !== "string"
      ? { version: attr.version }
      : {}),
    ...(typeof attr.landing_page === "string" &&
    attr.landing_page &&
    typeof input.payload?.landing_page !== "string"
      ? { landing_page: attr.landing_page }
      : {})
  };
  // Every touch from both funnels lands here, so this is the only place that
  // needs to get funnel identity right.
  const funnelId = resolveFunnelId({ path: input.path, payload });
  const row = {
    visitor_id: input.visitor_id ?? null,
    lead_id: input.lead_id ?? null,
    client_id: input.client_id ?? null,
    enrollment_id: input.enrollment_id ?? null,
    event_type: input.event_type,
    funnel_id: funnelId,
    path: input.path ?? null,
    full_url: input.full_url ?? null,
    referrer: input.referrer ?? null,
    ...attributionToTouchColumns(attr),
    payload,
    source: input.source ?? "server"
  };

  const { data, error } = await supabase
    .from("touch_events")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("appendTouchEvent:", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data.id };
}

export async function linkVisitorTouches(
  visitorId: string,
  leadId: string,
  clientId?: string
) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !visitorId) {
    return;
  }

  const patch: { lead_id: string; client_id?: string } = { lead_id: leadId };
  if (clientId) {
    patch.client_id = clientId;
  }

  await supabase.from("touch_events").update(patch).eq("visitor_id", visitorId);
}

export async function getFirstTouchForVisitor(visitorId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("touch_events")
    .select(
      "utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, msclkid, full_url, referrer, created_at"
    )
    .eq("visitor_id", visitorId)
    .order("created_at", { ascending: true })
    .limit(20);

  if (!data?.length) {
    return null;
  }

  const withAttrs = data.find(
    (row) =>
      row.utm_source ||
      row.gclid ||
      row.fbclid ||
      row.utm_campaign
  );

  const row = withAttrs ?? data[0];
  const snap: AttributionSnapshot = {
    utm_source: row.utm_source ?? undefined,
    utm_medium: row.utm_medium ?? undefined,
    utm_campaign: row.utm_campaign ?? undefined,
    utm_term: row.utm_term ?? undefined,
    utm_content: row.utm_content ?? undefined,
    gclid: row.gclid ?? undefined,
    fbclid: row.fbclid ?? undefined,
    msclkid: row.msclkid ?? undefined,
    landing_page: row.full_url ?? undefined,
    referrer: row.referrer ?? undefined
  };

  return { snap, first_touch_at: row.created_at };
}
