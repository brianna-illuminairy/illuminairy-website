"use client";

import {
  landingHeroHeadlines,
  landingHeroHookFromSearch,
  type LandingHeroHook
} from "@/lib/landing/hero-hooks";
import { v4Authority, v4Cta, v4Headline } from "./v4-content";

type V4HeroProps = {
  onStart: () => void;
  hook?: LandingHeroHook;
  search?: string;
};

/** Hook-aware headline: ad message-match overrides the v4 default. */
function useHeadlineLines(hook: LandingHeroHook | undefined, search?: string): {
  lines: readonly string[];
  accentLine: number;
} {
  if (hook && hook !== "default") {
    const h = landingHeroHeadlines[hook];
    return { lines: h.lines, accentLine: h.accentLine };
  }
  if (search) {
    const fromSearch = landingHeroHookFromSearch(search);
    if (fromSearch !== "default") {
      const h = landingHeroHeadlines[fromSearch];
      return { lines: h.lines, accentLine: h.accentLine };
    }
  }
  return { lines: v4Headline.lines, accentLine: v4Headline.accentLine };
}

export function V4Hero({ onStart, hook, search }: V4HeroProps) {
  const { lines, accentLine } = useHeadlineLines(hook, search);

  return (
    <section className="lp-hero">
      <div className="lp-container lp-hero-single">
        <h1 className="lp-h1">
          {lines.map((line, i) => (
            <span key={line} className="line">
              {i === accentLine ? <em>{line}</em> : line}
            </span>
          ))}
        </h1>
        <p className="lp-authority-line">
          <span className="bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {v4Authority}
        </p>
        <div className="lp-cta-card">
          <p className="lp-cta-intro">{v4Cta.intro}</p>
          <ul className="lp-cta-value">
            {v4Cta.bullets.map((b) => (
              <li key={b}>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
          <button type="button" className="lp-btn" onClick={onStart}>
            {v4Cta.button} <span className="arrow">→</span>
          </button>
          <p className="lp-cta-sub">{v4Cta.finePrint}</p>
        </div>
      </div>
    </section>
  );
}
