"use client";

import { recordClientTouch } from "@/lib/analytics-touch-client";
import { TouchEvents } from "@/lib/analytics-registry";
import {
  buildQuizAnswersSnapshot,
  hasQuizAnswersData,
  type QuizAnswersSnapshot,
} from "@/lib/crm/quiz-answers-snapshot";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";

let lastHash = "";
let timer: ReturnType<typeof setTimeout> | null = null;

function snapshotHash(snapshot: QuizAnswersSnapshot): string {
  return JSON.stringify(snapshot);
}

type SyncMeta = {
  step?: string;
  step_index?: number;
};

/** Debounced CRM sync for Plan Builder B partial answers. */
export function scheduleLabProgressSync(
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
      ...LAB_ANALYTICS_PROPS,
      step: meta.step,
      step_index: meta.step_index,
      quiz_answers: snapshot,
    });
  }, 500);
}

/** Immediate sync (step views) — skips debounce. */
export function syncLabProgressNow(
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
    ...LAB_ANALYTICS_PROPS,
    step: meta.step,
    step_index: meta.step_index,
    quiz_answers: snapshot,
  });
}
