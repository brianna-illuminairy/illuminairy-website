"use client";

import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import type { LandingSectionId } from "@/lib/landing/content";
import { V4Hero } from "./v4-hero";
import { V4TrustBar } from "./v4-trust-bar";
import { V4Footer } from "./v4-footer";

type V4PageProps = {
  search: string;
  heroHook?: LandingHeroHook;
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

/**
 * Compact, single-screen LP — minimal/no scrolling. The hero CTA stays above
 * the fold across the viewport matrix (incl. FB/IG in-app browsers via the
 * short-viewport CSS in landing-v4.css), so there is no sticky CTA bar.
 */
export function V4Page({ search, heroHook, onCta }: V4PageProps) {
  return (
    <div className="lp" data-theme="light">
      <header className="lp-chrome">
        <div className="lp-container lp-topbar">
          <IlluminairyLogoV7 tone="on-dark" height={34} />
        </div>
      </header>

      <main className="lp-grow">
        <V4Hero onStart={() => onCta("hero")} hook={heroHook} search={search} />
      </main>

      <V4TrustBar />
      <V4Footer />
    </div>
  );
}
