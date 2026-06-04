/**
 * LP trust bar preview variants (dev / QA only until experiment).
 *
 * Default: score + school tickers.
 * Override: ?trust_bar=mom_reviews (aliases: reviews, moms)
 *           ?trust_bar=scores (aliases: ticker, scores)
 */

export const TRUST_BAR_VARIANTS = ["scores", "mom_reviews"] as const;

export type TrustBarVariant = (typeof TRUST_BAR_VARIANTS)[number];

export const DEFAULT_TRUST_BAR_VARIANT: TrustBarVariant = "scores";

const SCORES_ALIASES = new Set(["scores", "score", "ticker", "stock"]);
const MOM_REVIEWS_ALIASES = new Set(["mom_reviews", "mom-reviews", "reviews", "moms", "mom"]);

export function devTrustBarOverrideFromSearch(search: string): TrustBarVariant | null {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  const raw = new URLSearchParams(normalized).get("trust_bar")?.toLowerCase();
  if (!raw) return null;
  if (SCORES_ALIASES.has(raw)) return "scores";
  if (MOM_REVIEWS_ALIASES.has(raw)) return "mom_reviews";
  return null;
}

export function resolveTrustBarVariant(search: string): TrustBarVariant {
  return devTrustBarOverrideFromSearch(search) ?? DEFAULT_TRUST_BAR_VARIANT;
}
