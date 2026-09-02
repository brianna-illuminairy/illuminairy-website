import { V4Footer } from "@/components/landing/v4/v4-footer";
import { V4TrustBar } from "@/components/landing/v4/v4-trust-bar";
import {
  AD3_HD_AUTHORITY,
  AD3_HD_CTA,
  AD3_HD_HEADLINE,
} from "@/lib/plan-b/ad3-hd-landing-copy";
import { Ad3HdCtaLink } from "./ad3-hd-cta-link";
import { Ad3HdTopbar } from "./ad3-hd-topbar";

type Ad3HdLandingPageProps = {
  ctaHref: string;
};

/** Ad3 HD only — one HTML response: topbar, hero, 3/1 quotes, footer. No hook variants. */
export function Ad3HdLandingPage({ ctaHref }: Ad3HdLandingPageProps) {
  return (
    <div className="lp ad3-hd-lp" data-theme="light">
      <header className="lp-chrome">
        <Ad3HdTopbar />
      </header>

      <main className="lp-grow">
        <section className="lp-hero">
          <div className="lp-container lp-hero-single">
            <h1 className="lp-h1">
              {AD3_HD_HEADLINE.lines.map((line, i) => (
                <span key={line} className="line">
                  {i === AD3_HD_HEADLINE.accentLine ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className="lp-authority-line">
              <span className="bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {AD3_HD_AUTHORITY}
            </p>
            <div className="lp-cta-card">
              <p className="lp-cta-intro">{AD3_HD_CTA.intro}</p>
              <ul className="lp-cta-value">
                {AD3_HD_CTA.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span className="check" aria-hidden="true">
                      ✓
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <Ad3HdCtaLink ctaHref={ctaHref} />
              <p className="lp-cta-sub">{AD3_HD_CTA.finePrint}</p>
            </div>
          </div>
        </section>

        <V4TrustBar heroHook="tutor" />
      </main>

      <V4Footer />
    </div>
  );
}
