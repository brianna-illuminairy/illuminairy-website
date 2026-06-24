import { AdLpCriticalCss } from "@/components/cold-funnel/critical-css";
import { DeferredStylesheet } from "@/components/cold-funnel/deferred-stylesheet";
import {
  AdLpHeroShell,
  buildAdLpSearchQuery,
} from "@/components/cold-funnel/ad-lp-hero-shell";
import { ColdPlanBLandingClient } from "@/components/cold-funnel/cold-plan-b-landing-client";

type ColdPlanBLandingProps = {
  searchParams: Record<string, string | string[] | undefined>;
  landingPath: string;
  /** Internal QA LP (`/sat-free-lesson`) — always routes CTA to `/plan-b`. */
  planBuilderB?: boolean;
};

/**
 * Plan Builder B cold LP — one above-fold contract for Meta + QA:
 * SSR headline, trust quote, and tappable CTA link in first HTML; client hydrates for analytics.
 */
export function ColdPlanBLanding({
  searchParams,
  landingPath,
  planBuilderB = false,
}: ColdPlanBLandingProps) {
  const searchQuery = buildAdLpSearchQuery(searchParams);

  return (
    <div className="lp-cold-perf">
      <AdLpCriticalCss />
      <DeferredStylesheet route="ad-lp" />
      <AdLpHeroShell searchQuery={searchQuery} />
      <ColdPlanBLandingClient landingPath={landingPath} planBuilderB={planBuilderB} />
    </div>
  );
}
