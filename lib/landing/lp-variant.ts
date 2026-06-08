import type { LandingHeroHook } from "@/lib/landing/hero-hooks";

/** Owner-facing LP headline variant IDs (PostHog `lp_variant`). */
export const LP_VARIANT_GOODGRADES = "variant-goodgrades-lowSAT" as const;
export const LP_VARIANT_TUTOR = "variant-beforetutoringmoney-realistic-score" as const;
export const LP_VARIANT_HIGHGPA = "variant-highgpa-ap-lowsat" as const;

export type LpVariantId =
  | typeof LP_VARIANT_GOODGRADES
  | typeof LP_VARIANT_TUTOR
  | typeof LP_VARIANT_HIGHGPA;

/** Map resolved hero hook → owner `lp_variant` for analytics. */
export function lpVariantFromHeroHook(hook: LandingHeroHook): LpVariantId {
  if (hook === "tutor") return LP_VARIANT_TUTOR;
  if (hook === "student_story") return LP_VARIANT_HIGHGPA;
  return LP_VARIANT_GOODGRADES;
}
