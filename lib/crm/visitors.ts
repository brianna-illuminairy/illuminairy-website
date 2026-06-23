import {
  mergeAttribution,
  sanitizeAttributionSnapshot,
  type AttributionSnapshot
} from "@/lib/attribution";
import type { QuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type VisitorTouchInput = {
  visitor_id: string;
  event_type: string;
  attribution?: AttributionSnapshot;
  payload?: Record<string, unknown>;
};

function touchJson(snap?: AttributionSnapshot) {
  if (!snap) return null;
  const cleaned = sanitizeAttributionSnapshot(snap);
  const has =
    cleaned.utm_source ||
    cleaned.utm_campaign ||
    cleaned.gclid ||
    cleaned.fbclid ||
    cleaned.landing_page ||
    cleaned.hero_hook ||
    cleaned.version;
  return has ? cleaned : null;
}

function campaignOf(snap?: AttributionSnapshot | null) {
  return snap?.utm_campaign?.trim() || null;
}

function readQWho(raw: unknown): string | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const value = (raw as Record<string, unknown>).qWho;
  return typeof value === "string" ? value : undefined;
}

function canonicalVisitorAttribution(input: {
  firstTouch?: AttributionSnapshot | null;
  lastTouch?: AttributionSnapshot | null;
  incoming?: AttributionSnapshot | null;
}): AttributionSnapshot {
  const first = sanitizeAttributionSnapshot(input.firstTouch ?? {});
  const withLast = mergeAttribution(
    first,
    sanitizeAttributionSnapshot(input.lastTouch ?? {})
  );
  return mergeAttribution(
    withLast,
    sanitizeAttributionSnapshot(input.incoming ?? {})
  );
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
  const qWhoFromPayload =
    typeof input.payload?.qWho === "string" ? input.payload.qWho : undefined;
  const quizAnswers =
    input.payload?.quiz_answers &&
    typeof input.payload.quiz_answers === "object" &&
    !Array.isArray(input.payload.quiz_answers)
      ? (input.payload.quiz_answers as QuizAnswersSnapshot)
      : undefined;

  let supportsFastColumns = true;
  let { data: existing, error: readErr } = await supabase
    .from("visitors")
    .select(
      "id, first_touch, last_touch, first_utm_content, first_hero_hook, quiz_who, quiz_furthest_step, quiz_furthest_step_index, quiz_answers"
    )
    .eq("id", input.visitor_id)
    .maybeSingle();
  if (readErr?.code === "42703") {
    // Backward-compatible read while column migration rolls out.
    supportsFastColumns = false;
    const fallback = await supabase
      .from("visitors")
      .select(
        "id, first_touch, last_touch, quiz_furthest_step, quiz_furthest_step_index, quiz_answers"
      )
      .eq("id", input.visitor_id)
      .maybeSingle();
    existing = fallback.data
      ? {
          ...fallback.data,
          first_utm_content: null,
          first_hero_hook: null,
          quiz_who: null
        }
      : null;
    readErr = fallback.error;
  }

  if (readErr) {
    if (readErr.code === "42P01") {
      return { ok: false as const, skipped: true as const };
    }
    console.error("upsertVisitorFromTouch read:", readErr);
    return { ok: false as const, error: readErr.message };
  }

  if (!existing) {
    const qWho = qWhoFromPayload ?? readQWho(quizAnswers);
    const initialAnswers =
      quizAnswers && typeof quizAnswers === "object"
        ? { ...quizAnswers }
        : qWho
          ? { qWho }
          : undefined;
    if (qWho && initialAnswers && !("qWho" in initialAnswers)) {
      (initialAnswers as Record<string, unknown>).qWho = qWho;
    }
    const row: Record<string, unknown> = {
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
    if (supportsFastColumns) {
      row.first_utm_content = incomingTouch?.utm_content ?? null;
      row.first_hero_hook = incomingTouch?.hero_hook ?? null;
      row.quiz_who = qWho ?? null;
    }
    if (initialAnswers && typeof initialAnswers === "object") {
      row.quiz_answers = initialAnswers;
      row.quiz_answers_updated_at = now;
    }
    const { error } = await supabase.from("visitors").insert(row);
    if (error) {
      console.error("upsertVisitorFromTouch insert:", error);
      return { ok: false as const, error: error.message };
    }
    return {
      ok: true as const,
      created: true as const,
      attribution: canonicalVisitorAttribution({
        firstTouch: incomingTouch,
        lastTouch: incomingTouch,
        incoming: input.attribution
      }),
      qWho
    };
  }

  const firstTouch =
    (existing.first_touch as AttributionSnapshot | null) ?? incomingTouch;
  const prevLast =
    (existing.last_touch as AttributionSnapshot | null) ?? null;
  const lastTouch = incomingTouch ?? prevLast;
  const existingFirstUtmContent =
    typeof existing.first_utm_content === "string"
      ? existing.first_utm_content
      : undefined;
  const existingFirstHeroHook =
    typeof existing.first_hero_hook === "string"
      ? existing.first_hero_hook
      : undefined;
  const existingQuizWhoColumn =
    typeof existing.quiz_who === "string" ? existing.quiz_who : undefined;

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
  if (supportsFastColumns && !existingFirstUtmContent) {
    patch.first_utm_content = firstTouch?.utm_content ?? null;
  }
  if (supportsFastColumns && !existingFirstHeroHook) {
    patch.first_hero_hook = firstTouch?.hero_hook ?? null;
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
  const existingQWho = readQWho(existing.quiz_answers);
  const qWho =
    qWhoFromPayload ??
    readQWho(quizAnswers) ??
    existingQuizWhoColumn ??
    existingQWho;
  const existingAnswers =
    existing.quiz_answers &&
    typeof existing.quiz_answers === "object" &&
    !Array.isArray(existing.quiz_answers)
      ? (existing.quiz_answers as Record<string, unknown>)
      : {};
  if (quizAnswers && typeof quizAnswers === "object") {
    const nextAnswers: Record<string, unknown> = { ...quizAnswers };
    if (qWho && !nextAnswers.qWho) nextAnswers.qWho = qWho;
    patch.quiz_answers = nextAnswers;
    patch.quiz_answers_updated_at = now;
  } else if (qWho && qWho !== existingQWho) {
    patch.quiz_answers = { ...existingAnswers, qWho };
    patch.quiz_answers_updated_at = now;
  }
  if (supportsFastColumns && qWho && qWho !== existingQuizWhoColumn) {
    patch.quiz_who = qWho;
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
    attributionReturn: Boolean(returnVisit),
    attribution: canonicalVisitorAttribution({
      firstTouch,
      lastTouch,
      incoming: input.attribution
    }),
    qWho
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
