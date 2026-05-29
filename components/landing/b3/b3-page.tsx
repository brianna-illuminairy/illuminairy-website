"use client";

import type { LpVariant } from "@/lib/quiz-funnel/experiments";
import type { LandingSectionId } from "@/lib/landing/content";
import { LandingHeader } from "./parts/header";
import { B3Body } from "./b3-body";
import { B3aHero, B3bHero, B3cHero } from "./heroes";

type B3PageProps = {
  variant: LpVariant;
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

function HeroForVariant({
  variant,
  onStart
}: {
  variant: LpVariant;
  onStart: () => void;
}) {
  switch (variant) {
    case "b3b-results":
      return <B3bHero onStart={onStart} />;
    case "b3c-authority":
      return <B3cHero onStart={onStart} />;
    default:
      return <B3aHero onStart={onStart} />;
  }
}

export function B3Page({ variant, onCta }: B3PageProps) {
  const heroStart = () => onCta("hero");

  return (
    <div className="il-page il-brand light il-premium" data-display="schibsted">
      <div className="il-premium-chrome">
        <LandingHeader />
      </div>
      <div className="il-premium-hero">
        <div className="il-premium-container">
          <HeroForVariant variant={variant} onStart={heroStart} />
        </div>
      </div>
      <B3Body onCta={onCta} />
    </div>
  );
}
