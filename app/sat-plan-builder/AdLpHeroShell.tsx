import Image from "next/image";
import {
  resolveLandingHeroHeadlineV4,
} from "@/lib/landing/hero-hooks";
import { resolveMetaLandingContext } from "@/lib/landing/meta-traffic";
import { shouldRouteLandingCtaToPlanBuilderB } from "@/lib/plan-builder-b-routes";
import {
  v4Authority,
  v4Cta,
  v4Headline,
  v4PlanBCta,
  v4TutorCta,
} from "@/components/landing/v4/v4-content";

type AdLpHeroShellProps = {
  searchQuery: string;
};

function resolveShellCopy(searchQuery: string) {
  const query = searchQuery.startsWith("?") ? searchQuery : searchQuery ? `?${searchQuery}` : "";
  const meta = resolveMetaLandingContext(query);
  const planBuilderB = shouldRouteLandingCtaToPlanBuilderB(query);
  const hookHeadline = resolveLandingHeroHeadlineV4(meta.heroHook, query);
  const headline = hookHeadline ?? v4Headline;
  const isTutor = meta.heroHook === "tutor";
  const cta = isTutor ? v4TutorCta : planBuilderB ? v4PlanBCta : v4Cta;

  return { headline, cta, heroHook: meta.heroHook };
}

/** SSR hero for ad LP — paints headline + CTA before client bundle loads. */
export function AdLpHeroShell({ searchQuery }: AdLpHeroShellProps) {
  const { headline, cta } = resolveShellCopy(searchQuery);

  return (
    <div id="ad-lp-ssr" className="ad-lp-ssr" aria-hidden="true">
      <div className="lp" data-theme="light">
        <header className="lp-chrome">
          <div className="lp-container lp-topbar lp-topbar--split">
            <span className="lp-topbar">
              <Image
                src="/brand/logo-horizontal.png"
                alt="Illuminairy"
                width={110}
                height={34}
                priority
                fetchPriority="high"
                style={{ height: 34, width: "auto", maxWidth: "min(200px, 52vw)" }}
              />
            </span>
          </div>
        </header>
        <main className="lp-grow">
          <section className="lp-hero">
            <div className="lp-container lp-hero-single">
              <h1 className="lp-h1">
                {headline.lines.map((line, i) => (
                  <span key={line} className="line">
                    {i === headline.accentLine ? <em>{line}</em> : line}
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
                <button type="button" className="lp-btn" tabIndex={-1}>
                  {cta.button} <span className="arrow">→</span>
                </button>
                <p className="lp-cta-sub">{cta.finePrint}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function buildAdLpSearchQuery(
  searchParams: Record<string, string | string[] | undefined>
): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}
