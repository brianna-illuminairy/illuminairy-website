import type { AttributionSnapshot } from "@/lib/attribution";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type VisitorTouchInput = {
  visitor_id: string;
  event_type: string;
  attribution?: AttributionSnapshot;
  payload?: Record<string, unknown>;
};

function touchJson(snap?: AttributionSnapshot) {
  if (!snap) return null;
  const has =
    snap.utm_source ||
    snap.utm_campaign ||
    snap.gclid ||
    snap.fbclid ||
    snap.landing_page;
  return has ? snap : null;
}

function campaignOf(snap?: AttributionSnapshot | null) {
  return snap?.utm_campaign?.trim() || null;
}

export async function upsertVisitorFromTouch(input: VisitorTouchInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !input.visitor_id) {
    return { ok: false as const, skipped: true as const };
  }

  const now = new Date().toISOString();
  const incomingTouch = touchJson(input.attribution);
  const step =
    typeof input.payload?.step === "string" ? input.payload.step : undefined;
  const stepIndex =
    typeof input.payload?.step_index === "number"
      ? input.payload.step_index
      : undefined;
  const satLpVariant =
    typeof input.payload?.sat_lp_variant === "string"
      ? input.payload.sat_lp_variant
      : undefined;
  const deviceClass =
    typeof input.payload?.device_class === "string"
      ? input.payload.device_class
      : undefined;
  const posthogDistinctId =
    typeof input.payload?.posthog_distinct_id === "string"
      ? input.payload.posthog_distinct_id
      : undefined;

  const { data: existing, error: readErr } = await supabase
    .from("visitors")
    .select(
      "id, first_touch, last_touch, quiz_furthest_step, quiz_furthest_step_index"
    )
    .eq("id", input.visitor_id)
    .maybeSingle();

  if (readErr) {
    if (readErr.code === "42P01") {
      return { ok: false as const, skipped: true as const };
    }
    console.error("upsertVisitorFromTouch read:", readErr);
    return { ok: false as const, error: readErr.message };
  }

  if (!existing) {
    const row = {
      id: input.visitor_id,
      first_seen_at: now,
      last_seen_at: now,
      first_touch: incomingTouch,
      last_touch: incomingTouch,
      quiz_furthest_step: step ?? null,
      quiz_furthest_step_index: stepIndex ?? null,
      sat_lp_variant: satLpVariant ?? null,
      device_class: deviceClass ?? null,
      posthog_distinct_id: posthogDistinctId ?? null
    };
    const { error } = await supabase.from("visitors").insert(row);
    if (error) {
      console.error("upsertVisitorFromTouch insert:", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const, created: true as const };
  }

  const firstTouch =
    (existing.first_touch as AttributionSnapshot | null) ?? incomingTouch;
  const prevLast =
    (existing.last_touch as AttributionSnapshot | null) ?? null;
  const lastTouch = incomingTouch ?? prevLast;

  const prevIdx = existing.quiz_furthest_step_index ?? -1;
  const advanceStep =
    stepIndex !== undefined && stepIndex > prevIdx
      ? { quiz_furthest_step: step, quiz_furthest_step_index: stepIndex }
      : {};

  const patch: Record<string, unknown> = {
    last_seen_at: now,
    last_touch: lastTouch,
    ...advanceStep
  };

  if (!existing.first_touch && incomingTouch) {
    patch.first_touch = incomingTouch;
  }
  if (satLpVariant) {
    patch.sat_lp_variant = satLpVariant;
  }
  if (deviceClass) {
    patch.device_class = deviceClass;
  }
  if (posthogDistinctId) {
    patch.posthog_distinct_id = posthogDistinctId;
  }

  const { error: updateErr } = await supabase
    .from("visitors")
    .update(patch)
    .eq("id", input.visitor_id);

  if (updateErr) {
    console.error("upsertVisitorFromTouch update:", updateErr);
    return { ok: false as const, error: updateErr.message };
  }

  const returnVisit =
    incomingTouch &&
    campaignOf(incomingTouch) &&
    campaignOf(firstTouch) &&
    campaignOf(incomingTouch) !== campaignOf(firstTouch);

  return {
    ok: true as const,
    created: false as const,
    attributionReturn: Boolean(returnVisit)
  };
}

export async function getVisitorById(visitorId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from("visitors")
    .select("*")
    .eq("id", visitorId)
    .maybeSingle();

  return data;
}
