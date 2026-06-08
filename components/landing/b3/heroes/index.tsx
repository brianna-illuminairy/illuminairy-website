"use client";

import { landingHero, landingShared } from "@/lib/landing/content";
import {
  landingHeroHeadlines,
  landingHeroHookFromSearch,
  type LandingHeroHeadline,
  type LandingHeroHook
} from "@/lib/landing/hero-hooks";
import { HeroCta } from "../parts/cta";
import { B3aHeroMediaGrid } from "../parts/hero-media-grid";

type HeroProps = {
  onStart: () => void;
  hook?: LandingHeroHook;
  search?: string;
  textOnly?: boolean;
};

function resolveHeadline(hook: LandingHeroHook | undefined, search?: string): LandingHeroHeadline {
  if (hook && hook !== "default") return landingHeroHeadlines[hook];
  if (search) {
    const fromSearch = landingHeroHookFromSearch(search);
    if (fromSearch !== "default") return landingHeroHeadlines[fromSearch];
  }
  return landingHeroHeadlines.default;
}

function UnifiedHero({ onStart, hook, search, textOnly = false }: HeroProps) {
  const { lines, accentLine } = resolveHeadline(hook, search);

  return (
    <div className={`il-hero-grid${textOnly ? " il-hero-grid--text-only" : ""}`}>
      <div className="il-hero-main">
        <section className="section il-hero-section">
          <h1 className="il-h1">
            {lines.map((line, i) => (
              <span
                key={line}
                className={`line${i === accentLine ? " accent" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="lead il-hero-subhead">{landingHero.subhead}</p>
          <p className="il-hero-checklist-intro">{landingHero.checklistIntro}</p>
          <ul className="checklist il-hero-checklist">
            {landingHero.checklist.map((item) => (
              <li key={item}>
                <span className="check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <div className="il-hero-cta-wrap">
          <HeroCta
            copy={landingHero.ctaCopy}
            cta={landingShared.heroCtaLabel}
            onClick={onStart}
          />
          <p className="il-hero-fine-print">{landingHero.finePrint}</p>
          <p className="disclaimer il-hero-disclaimer">{landingHero.disclaimer}</p>
        </div>
      </div>
      {textOnly ? null : (
        <div className="il-hero-media" aria-hidden="true">
          <B3aHeroMediaGrid />
        </div>
      )}
    </div>
  );
}

export function B3Hero({ onStart, hook, search, textOnly }: HeroProps) {
  return (
    <UnifiedHero onStart={onStart} hook={hook} search={search} textOnly={textOnly} />
  );
}

/** @deprecated Unified hero — kept for imports */
export function B3aHero({ onStart, search }: HeroProps) {
  return <UnifiedHero onStart={onStart} search={search} />;
}

export function B3bHero({ onStart, search }: HeroProps) {
  return <UnifiedHero onStart={onStart} search={search} />;
}

export function B3cHero({ onStart, search }: HeroProps) {
  return <UnifiedHero onStart={onStart} search={search} />;
}
