"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { V4Topbar } from "@/components/landing/v4/v4-topbar";
import { V4Footer } from "@/components/landing/v4/v4-footer";
import { ScoreReviewHero } from "./score-review-hero";
import { ScoreReviewTrustBar } from "./score-review-trust-bar";
import { trackLandingCtaClick, trackLandingView } from "@/lib/landing/analytics";
import { enrichSessionAttributionFromLanding } from "@/lib/attribution";
import { landingSearchQuery } from "@/lib/landing/landing-search";
import { resolveMetaLandingContext } from "@/lib/landing/meta-traffic";
import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import { scoreReviewEntryFromLanding } from "@/lib/score-review-routes";
import { SCORE_REVIEW_LP_PATH } from "@/lib/score-review-routes";
import { lpVariantFromHeroHook } from "@/lib/landing/lp-variant";
import { persistLpVariantId } from "@/lib/landing/variant-storage";

export function ScoreReviewLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  const query = landingSearchQuery(searchParams.toString());
  const search = query.startsWith("?") ? query.slice(1) : query;
  const metaContext = useMemo(() => resolveMetaLandingContext(query), [query]);
  const heroHook: LandingHeroHook = "june_score_review";

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    const lpVariantId = lpVariantFromHeroHook(heroHook);
    persistLpVariantId(lpVariantId);
    const trackingExtra = {
      hero_hook: heroHook,
      hero_hook_source: metaContext.heroHookSource,
      lp_variant: lpVariantId,
      traffic_channel: metaContext.isMetaPaid ? ("meta_paid" as const) : ("other" as const),
      landing_page: SCORE_REVIEW_LP_PATH,
    };
    enrichSessionAttributionFromLanding(SCORE_REVIEW_LP_PATH, heroHook);
    trackLandingView("b3a-problem", "compact", SCORE_REVIEW_LP_PATH, trackingExtra);
  }, [heroHook, metaContext]);

  const handleCta = useCallback(() => {
    trackLandingCtaClick("b3a-problem", "compact", SCORE_REVIEW_LP_PATH, "hero", "Schedule free score review", {
      hero_hook: heroHook,
      lp_variant: lpVariantFromHeroHook(heroHook),
    });
    router.push(scoreReviewEntryFromLanding(search ? `?${search}` : undefined));
  }, [heroHook, router, search]);

  return (
    <div className="lp sr-lp" data-theme="light">
      <header className="lp-chrome">
        <V4Topbar heroHook={heroHook} />
      </header>
      <main className="lp-grow">
        <ScoreReviewHero onStart={handleCta} />
      </main>
      <ScoreReviewTrustBar />
      <V4Footer />
    </div>
  );
}
