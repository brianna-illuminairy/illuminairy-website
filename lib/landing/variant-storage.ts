import type { LpVariant } from "@/lib/quiz-funnel/experiments";

const STORAGE_KEY = "sat_lp_variant";

export function persistLpVariant(variant: LpVariant) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    /* private browsing */
  }
}

export function readPersistedLpVariant(): LpVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (
      raw === "b3a-problem" ||
      raw === "b3b-results" ||
      raw === "b3c-authority"
    ) {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return null;
}
