"use client";

import { useMemo, useSyncExternalStore } from "react";
import { STORAGE_KEY, loadSatPlanState } from "@/lib/sat-plan-funnel/state";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

const EMPTY_ANSWERS: SatPlanAnswers = {};
const EMPTY_SNAPSHOT = "{}";

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

/** Primitive snapshot — stable when answers unchanged (required by useSyncExternalStore). */
function getSnapshot(): string {
  return JSON.stringify(loadSatPlanState().answers);
}

function getServerSnapshot(): string {
  return EMPTY_SNAPSHOT;
}

function parseAnswers(raw: string): SatPlanAnswers {
  if (raw === EMPTY_SNAPSHOT) return EMPTY_ANSWERS;
  try {
    const parsed = JSON.parse(raw) as SatPlanAnswers;
    return parsed ?? EMPTY_ANSWERS;
  } catch {
    return EMPTY_ANSWERS;
  }
}

/** Session answers — server snapshot is `{}` to avoid hydration mismatch. */
export function useSatPlanAnswers(): SatPlanAnswers {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseAnswers(raw), [raw]);
}

/** Call after same-tab sessionStorage writes so interstitials re-read answers. */
export function notifySatPlanAnswersChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}
