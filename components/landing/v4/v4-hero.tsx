"use client";

import {
  resolveLandingHeroHeadlineV4,
  type LandingHeroHook
} from "@/lib/landing/hero-hooks";
import {
  v4Authority,
  v4Cta,
  v4Headline,
  v4PlanBCta,
  v4TutorCta
} from "./v4-content";

type V4HeroProps = {
  onStart: () => void;
  hook?: LandingHeroHook;
  search?: string;
  planBuilderB?: boolean;
};

/** Ad hook headlines are two lines only — same fold layout as the owner v4 default. */
function useHeadlineLines(hook: LandingHeroHook | undefined, search?: string): {
  lines: readonly string[];
  accentLine: number;
} {
  const fromHook = resolveLandingHeroHeadlineV4(hook, search);
  if (fromHook) {
    return { lines: fromHook.lines, accentLine: fromHook.accentLine };
  }
  return { lines: v4Headline.lines, accentLine: v4Headline.accentLine };
}

export function V4Hero({ onStart, hook, search, planBuilderB }: V4HeroProps) {
  const { lines, accentLine } = useHeadlineLines(hook, search);
  const isTutor = hook === "tutor";
  const cta = isTutor ? v4TutorCta : planBuilderB ? v4PlanBCta : v4Cta;

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
          <p className="lp-cta-intro">{cta.intro}</p>
          <ul className="lp-cta-value">
            {cta.bullets.map((b) => (
              <li key={b}>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
          <button type="button" className="lp-btn" onClick={onStart}>
            {cta.button} <span className="arrow">→</span>
          </button>
          <p className="lp-cta-sub">{cta.finePrint}</p>
        </div>
      </div>
    </section>
  );
}
