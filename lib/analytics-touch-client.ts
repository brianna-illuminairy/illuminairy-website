"use client";

import type { AttributionSnapshot } from "@/lib/attribution";
import { getAttributionPayload } from "@/components/attribution-provider";
import {
  CLIENT_TOUCH_EVENTS,
  type TouchEventName
} from "@/lib/analytics-registry";
import type { QuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";

const DEDUPE = new Set<string>();

function deviceClass(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function posthogDistinctId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const ph = (window as { posthog?: { get_distinct_id?: () => string } })
      .posthog;
    return ph?.get_distinct_id?.();
  } catch {
    return undefined;
  }
}

export type ClientTouchPayload = {
  step?: string;
  step_index?: number;
  sat_lp_variant?: string;
  section_id?: string;
  cta_label?: string;
  quiz_answers?: QuizAnswersSnapshot;
  [key: string]: string | number | boolean | QuizAnswersSnapshot | undefined;
};

/**
 * Non-blocking CRM touch for funnel analytics + visitor stitching.
 * Dedupes identical step views within the same page session.
 */
export function recordClientTouch(
  eventType: TouchEventName,
  payload?: ClientTouchPayload
) {
  if (typeof window === "undefined") return;
  if (!CLIENT_TOUCH_EVENTS.has(eventType)) return;

  const dedupeKey =
    eventType === "quiz_step_view" && payload?.step
      ? `${eventType}:${payload.step}`
      : eventType === "quiz_progress_sync" && payload?.quiz_answers
        ? `${eventType}:${payload.step ?? ""}:${JSON.stringify(payload.quiz_answers)}`
        : null;
  if (dedupeKey && DEDUPE.has(dedupeKey)) return;
  if (dedupeKey) DEDUPE.add(dedupeKey);

  let visitorId = "";
  let attribution: AttributionSnapshot = {};
  try {
    const snap = getAttributionPayload();
    visitorId = snap.visitorId;
    attribution = snap.attribution;
  } catch {
    return;
  }
  if (!visitorId) return;

  const body = {
    visitorId,
    eventType,
    path: window.location.pathname,
    fullUrl: window.location.href,
    referrer: document.referrer || undefined,
    attribution,
    payload: {
      ...payload,
      device_class: deviceClass(),
      posthog_distinct_id: posthogDistinctId()
    }
  };

  void fetch("/api/attribution/touch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true
  }).catch(() => {
    /* analytics must not block UX */
  });
}
