"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { V4Page } from "@/components/landing/v4/v4-page";
import { trackLandingCtaClick, trackLandingView } from "@/lib/landing/analytics";
import { persistLpLayout } from "@/lib/landing/layout-storage";
import { persistLpVariant } from "@/lib/landing/variant-storage";
import type { LandingSectionId } from "@/lib/landing/content";
import { landingShared } from "@/lib/landing/content";
import { resolveMetaLandingContext } from "@/lib/landing/meta-traffic";
import { planBuilderEntryFromLanding } from "@/lib/plan-builder-routes";
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
};

export function LandingPage({ landingPath = "/" }: LandingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  const search = searchParams.toString();
  const query = search ? `?${search}` : "";
  const layout = devLayoutOverrideFromSearch(query) ?? LP_LAYOUT;
  const variant = devOverrideFromSearch(query) ?? LP_VARIANT;
  const metaContext = useMemo(() => resolveMetaLandingContext(query), [query]);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    persistLpVariant(variant);
    persistLpLayout(layout);
    const trackingExtra = {
      preferred_metro: metaContext.metro.metroId,
      metro_source: metaContext.metro.source,
      hero_hook: metaContext.heroHook,
      hero_hook_source: metaContext.heroHookSource,
      traffic_channel: metaContext.isMetaPaid ? ("meta_paid" as const) : ("other" as const),
      landing_page: landingPath
    };
    trackLpExperimentExposure(variant, {
      sat_lp_layout: layout,
      ...trackingExtra
    });
    trackLpLayoutExperimentExposure(layout);
    trackLandingView(variant, layout, landingPath, trackingExtra);
  }, [layout, landingPath, metaContext, variant]);

  const handleCta = useCallback(
    (sectionId: LandingSectionId, label?: string) => {
      const ctaLabel = label ?? landingShared.heroCtaLabel;
      trackLandingCtaClick(variant, layout, landingPath, sectionId, ctaLabel);
      router.push(planBuilderEntryFromLanding(search ? `?${search}` : undefined));
    },
    [layout, landingPath, router, search, variant]
  );

  return <V4Page search={query} heroHook={metaContext.heroHook} onCta={handleCta} />;
}

/** Exported for tests — flag key constants */
export { LP_VARIANT_FLAG, LP_LAYOUT_FLAG };
