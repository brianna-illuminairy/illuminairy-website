"use client";

import { recordClientTouch } from "@/lib/analytics-touch-client";
import { TouchEvents } from "@/lib/analytics-registry";
import {
  buildQuizAnswersSnapshot,
  hasQuizAnswersData,
  type QuizAnswersSnapshot
} from "@/lib/crm/quiz-answers-snapshot";

let lastHash = "";
let timer: ReturnType<typeof setTimeout> | null = null;

function snapshotHash(snapshot: QuizAnswersSnapshot): string {
  return JSON.stringify(snapshot);
}

type SyncMeta = {
  step?: string;
  step_index?: number;
};

/**
 * Debounced CRM + touch_events sync — persists partial funnel answers
 * before lead form or booking (visitor row + touch payload).
 */
export function scheduleQuizProgressSync(
  answers: Record<string, unknown>,
  meta: SyncMeta = {}
) {
  if (typeof window === "undefined") return;

  const snapshot = buildQuizAnswersSnapshot(answers);
  if (!hasQuizAnswersData(snapshot)) return;

  const hash = `${meta.step ?? ""}:${snapshotHash(snapshot)}`;
  if (hash === lastHash) return;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    lastHash = hash;
    recordClientTouch(TouchEvents.quizProgressSync, {
      step: meta.step,
      step_index: meta.step_index,
      quiz_answers: snapshot
    });
  }, 500);
}

/** Immediate sync (step views) — skips debounce. */
export function syncQuizProgressNow(
  answers: Record<string, unknown>,
  meta: SyncMeta = {}
) {
  if (typeof window === "undefined") return;

  const snapshot = buildQuizAnswersSnapshot(answers);
  if (!hasQuizAnswersData(snapshot)) return;

  const hash = `${meta.step ?? ""}:${snapshotHash(snapshot)}`;
  if (hash === lastHash) return;
  lastHash = hash;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  recordClientTouch(TouchEvents.quizProgressSync, {
    step: meta.step,
    step_index: meta.step_index,
    quiz_answers: snapshot
  });
}
