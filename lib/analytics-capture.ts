"use client";

import posthog from "posthog-js";
import type { AnalyticsEventName } from "@/lib/analytics-events";
import { analyticsAttributionProps } from "@/lib/analytics-attribution";
import { readStoredQuizAnswers } from "@/lib/quiz-funnel/quiz-storage";

function quizAudienceProps() {
  const stored = readStoredQuizAnswers();
  const qWho = typeof stored.qWho === "string" ? stored.qWho : undefined;
  return {
    qWho,
    quiz_is_self_taker: qWho === "self"
  };
}

export function captureAnalytics(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, {
      ...analyticsAttributionProps(),
      ...quizAudienceProps(),
      ...properties
    });
  } catch {
    // Analytics must not block UX
  }
}
