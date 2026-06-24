"use client";

import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import type { LandingSectionId } from "@/lib/landing/content";
import { trackLandingSmsClick } from "@/lib/landing/analytics";
import {
  devOverrideFromSearch,
  LP_VARIANT_FLAG,
  type LpVariant
} from "@/lib/quiz-funnel/experiments";
import {
  devLayoutOverrideFromSearch,
  LP_LAYOUT_FLAG,
  type LpLayout
} from "@/lib/quiz-funnel/experiments-layout";
import { V4Hero } from "./v4-hero";
import { V4TrustBar } from "./v4-trust-bar";
import { V4Footer } from "./v4-footer";
import { V4Topbar } from "./v4-topbar";
import { DeferredBelowFold } from "@/components/cold-funnel/deferred-below-fold";

type V4PageProps = {
  search: string;
  heroHook?: LandingHeroHook;
  landingPath: string;
  planBuilderB?: boolean;
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

/**
 * Compact, single-screen LP — minimal/no scrolling. The hero CTA stays above
 * the fold across the viewport matrix (incl. FB/IG in-app browsers via the
 * short-viewport CSS in landing-v4.css), so there is no sticky CTA bar.
 */
export function V4Page({ search, heroHook, landingPath, planBuilderB, onCta }: V4PageProps) {
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  const layout = devLayoutOverrideFromSearch(query) ?? ("compact" satisfies LpLayout);
  const variant = devOverrideFromSearch(query) ?? ("b3a-problem" satisfies LpVariant);

  return (
    <div className="lp" data-theme="light">
      <header className="lp-chrome">
        <V4Topbar
          heroHook={heroHook}
          onSmsClick={() =>
            trackLandingSmsClick(variant, layout, landingPath, {
              hero_hook: heroHook,
              lp_variant:
                heroHook === "tutor"
                  ? "variant-beforetutoringmoney-realistic-score"
                  : undefined
            })
          }
        />
      </header>

      <main className="lp-grow">
        <V4Hero
          onStart={() => onCta("hero")}
          hook={heroHook}
          search={query}
          planBuilderB={planBuilderB}
        />
      </main>

      <DeferredBelowFold force>
        <V4TrustBar heroHook={heroHook} />
        <V4Footer />
      </DeferredBelowFold>
    </div>
  );
}

/** Exported for tests — flag key constants */
export { LP_VARIANT_FLAG, LP_LAYOUT_FLAG };
