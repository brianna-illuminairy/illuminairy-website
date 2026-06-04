import type { LpLayout } from "@/lib/quiz-funnel/experiments-layout";

const STORAGE_KEY = "sat_lp_layout";

export function persistLpLayout(layout: LpLayout) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, layout);
  } catch {
    /* private browsing */
  }
}

export function readPersistedLpLayout(): LpLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "full" || raw === "compact") return raw;
  } catch {
    /* ignore */
  }
  return null;
}
