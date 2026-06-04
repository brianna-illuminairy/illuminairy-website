"use client";

import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import type { TrustMetroId } from "@/lib/landing/infer-visitor-metro";
import type { TrustBarVariant } from "@/lib/landing/trust-bar-variant";
import type { LpLayout } from "@/lib/quiz-funnel/experiments-layout";
import type { LpVariant } from "@/lib/quiz-funnel/experiments";
import type { LandingSectionId } from "@/lib/landing/content";
import { B3Body } from "./b3-body";
import { B3ColdFooter } from "./b3-cold-footer";
import { TrustBar } from "./parts/trust-bar";
import { LandingHeader } from "./parts/header";
import { StickyCta } from "./parts/sticky-cta";
import { B3Hero } from "./heroes";

const HERO_ANCHOR_ID = "il-hero-anchor";

type B3PageProps = {
  variant: LpVariant;
  layout: LpLayout;
  search: string;
  preferredMetroId?: TrustMetroId | null;
  heroHook?: LandingHeroHook;
  trustBarVariant?: TrustBarVariant;
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

export function B3Page({
  variant,
  layout,
  search,
  preferredMetroId,
  heroHook,
  trustBarVariant = "scores",
  onCta
}: B3PageProps) {
  const heroStart = () => onCta("hero");
  const stickyStart = () => onCta("sticky_cta");
  const heroOnly = layout !== "full";

  return (
    <div
      className={`il-page il-brand light il-premium il-lp-cold${heroOnly ? " il-layout-compact il-layout-hero-only" : ""}`}
      data-display="schibsted"
      data-lp-layout={layout}
      data-lp-variant={variant}
      data-preferred-metro={preferredMetroId ?? undefined}
      data-trust-bar={trustBarVariant}
    >
      <div className="il-premium-chrome">
        <LandingHeader />
      </div>
      <div className="il-premium-hero" id={HERO_ANCHOR_ID}>
        <div className="il-premium-container">
          <B3Hero
            onStart={heroStart}
            search={search}
            hook={heroHook}
            textOnly={heroOnly}
          />
        </div>
      </div>
      <TrustBar variant={trustBarVariant} preferredMetroId={preferredMetroId} />
      {heroOnly ? <B3ColdFooter /> : <B3Body onCta={onCta} />}
      {heroOnly ? (
        <StickyCta heroAnchorId={HERO_ANCHOR_ID} onStart={stickyStart} />
      ) : null}
    </div>
  );
}
