import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import { v4TrustStats, v4TutorPlanTestimonials } from "./v4-content";

type V4TrustBarProps = {
  heroHook?: LandingHeroHook;
};

/** Static trust band before the footer — stats by default; plan quotes on tutor hook. */
export function V4TrustBar({ heroHook }: V4TrustBarProps) {
  if (heroHook === "tutor") {
    const mobileQuote = v4TutorPlanTestimonials[0];
    return (
      <section className="lp-trust lp-trust--quotes" aria-label="Parent feedback">
        <div className="lp-container">
          <div className="lp-trust-quotes lp-trust-quotes--mobile">
            <figure className="lp-trust-quote">
              <blockquote>{mobileQuote.quote}</blockquote>
              <figcaption>{mobileQuote.byline}</figcaption>
            </figure>
          </div>
          <div className="lp-trust-quotes lp-trust-quotes--desktop">
            {v4TutorPlanTestimonials.map((item) => (
              <figure className="lp-trust-quote" key={item.byline}>
                <blockquote>{item.quote}</blockquote>
                <figcaption>{item.byline}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lp-trust" aria-label="Trust">
      <div className="lp-container">
        <div className="lp-trust-grid">
          {v4TrustStats.map((stat) => (
            <div className="lp-trust-cell" key={stat.label}>
              <span className={stat.em ? "lp-trust-num em" : "lp-trust-num"}>
                {stat.value}
                {"star" in stat && stat.star ? <span className="star">★</span> : null}
                {stat.unit ? <span className="unit">{stat.unit}</span> : null}
              </span>
              <span className="lp-trust-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
