"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { V4Page } from "@/components/landing/v4/v4-page";
import { v4PlanBCta, v4TutorCta } from "@/components/landing/v4/v4-content";
import { trackLandingCtaClick, trackLandingView } from "@/lib/landing/analytics";
import { enrichSessionAttributionFromLanding } from "@/lib/attribution";
import { persistLpLayout } from "@/lib/landing/layout-storage";
import {
  persistLpVariant,
  persistLpVariantId
} from "@/lib/landing/variant-storage";
import type { LandingSectionId } from "@/lib/landing/content";
import { landingShared } from "@/lib/landing/content";
import { lpVariantFromHeroHook } from "@/lib/landing/lp-variant";
import { landingSearchQuery } from "@/lib/landing/landing-search";
import { resolveMetaLandingContext } from "@/lib/landing/meta-traffic";
import { planBuilderEntryFromLanding } from "@/lib/plan-builder-routes";
import { isColdPlanBLandingPath, planBuilderBEntryFromLanding, shouldRouteLandingCtaToPlanBuilderB } from "@/lib/plan-builder-b-routes";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";
import {
  devOverrideFromSearch,
  LP_VARIANT_FLAG,
  trackLpExperimentExposure,
  type LpVariant
} from "@/lib/quiz-funnel/experiments";
import {
  devLayoutOverrideFromSearch,
  LP_LAYOUT_FLAG,
  trackLpLayoutExperimentExposure,
  type LpLayout
} from "@/lib/quiz-funnel/experiments-layout";

const LP_VARIANT: LpVariant = "b3a-problem";
const LP_LAYOUT: LpLayout = "compact";

type LandingPageProps = {
  /** Pathname for analytics (`/` or `/sat-plan-builder`). */
  landingPath?: string;
  /** Force Plan Builder B lab funnel (used by `/sat-free-lesson`). */
  planBuilderB?: boolean;
};

export function LandingPage({ landingPath = "/", planBuilderB: planBuilderBForced }: LandingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  const query = landingSearchQuery(searchParams.toString());
  const search = query.startsWith("?") ? query.slice(1) : query;
  const planBuilderB =
    planBuilderBForced === true || shouldRouteLandingCtaToPlanBuilderB(searchParams.toString());
  const layout = devLayoutOverrideFromSearch(query) ?? LP_LAYOUT;
  const variant = devOverrideFromSearch(query) ?? LP_VARIANT;
  const metaContext = useMemo(() => resolveMetaLandingContext(query), [query]);
  const deferAnalytics = isMarketingDeferPath(pathname);
  const analyticsReady = useDeferUntilEngagedOrLcp(deferAnalytics);

  useEffect(() => {
    if (deferAnalytics && !analyticsReady) return;
    if (trackedRef.current) return;
    trackedRef.current = true;
    persistLpVariant(variant);
    persistLpLayout(layout);
    const lpVariantId = lpVariantFromHeroHook(metaContext.heroHook);
    persistLpVariantId(lpVariantId);
    const trackingExtra = {
      preferred_metro: metaContext.metro.metroId,
      metro_source: metaContext.metro.source,
      hero_hook: metaContext.heroHook,
      hero_hook_source: metaContext.heroHookSource,
      lp_variant: lpVariantId,
      traffic_channel: metaContext.isMetaPaid ? ("meta_paid" as const) : ("other" as const),
      landing_page: landingPath
    };
    trackLpExperimentExposure(variant, {
      sat_lp_layout: layout,
      ...trackingExtra
    });
    trackLpLayoutExperimentExposure(layout);
    enrichSessionAttributionFromLanding(landingPath, metaContext.heroHook);
    trackLandingView(variant, layout, landingPath, trackingExtra);
  }, [analyticsReady, deferAnalytics, layout, landingPath, metaContext, variant]);

  const handleCta = useCallback(
    (sectionId: LandingSectionId, label?: string) => {
      const ctaLabel =
        label ??
        (metaContext.heroHook === "tutor"
          ? v4TutorCta.button
          : planBuilderB
            ? v4PlanBCta.button
            : landingShared.heroCtaLabel);
      trackLandingCtaClick(variant, layout, landingPath, sectionId, ctaLabel, {
        hero_hook: metaContext.heroHook,
        hero_hook_source: metaContext.heroHookSource,
        lp_variant: lpVariantFromHeroHook(metaContext.heroHook)
      });
      router.push(
        planBuilderB
          ? planBuilderBEntryFromLanding(search ? `?${search}` : undefined)
          : planBuilderEntryFromLanding(search ? `?${search}` : undefined)
      );
    },
    [layout, landingPath, metaContext.heroHook, metaContext.heroHookSource, planBuilderB, router, search, variant]
  );

  const handleHeroPainted = useCallback(() => {
    if (!isColdPlanBLandingPath(landingPath)) return;
    document.getElementById("ad-lp-ssr")?.remove();
  }, [landingPath]);

  return (
    <V4Page
      search={query}
      heroHook={metaContext.heroHook}
      landingPath={landingPath}
      planBuilderB={planBuilderB}
      onCta={handleCta}
      onHeroPainted={handleHeroPainted}
    />
  );
}

/** Exported for tests — flag key constants */
export { LP_VARIANT_FLAG, LP_LAYOUT_FLAG };
