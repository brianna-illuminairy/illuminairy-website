import type { LpVariantId } from "@/lib/landing/lp-variant";
import {
  LP_VARIANT_GOODGRADES,
  LP_VARIANT_HIGHGPA,
  LP_VARIANT_TUTOR
} from "@/lib/landing/lp-variant";
import type { LpVariant } from "@/lib/quiz-funnel/experiments";

const STORAGE_KEY = "sat_lp_variant";
const LP_VARIANT_ID_KEY = "lp_variant";

const LP_VARIANT_IDS: LpVariantId[] = [
  LP_VARIANT_GOODGRADES,
  LP_VARIANT_TUTOR,
  LP_VARIANT_HIGHGPA
];

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

export function persistLpVariantId(variantId: LpVariantId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LP_VARIANT_ID_KEY, variantId);
  } catch {
    /* private browsing */
  }
}

export function readPersistedLpVariantId(): LpVariantId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LP_VARIANT_ID_KEY);
    if (raw && LP_VARIANT_IDS.includes(raw as LpVariantId)) {
      return raw as LpVariantId;
    }
  } catch {
    /* ignore */
  }
  return null;
}
