"use client";

import { AssessmentCta } from "@/components/assessment/assessment-cta";
import { AssessmentLogo } from "@/components/assessment/assessment-logo";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";

type AssessmentLandingLowProps = {
  onStartAssessment: () => void;
};

function startClick(onStart: () => void, section: string) {
  trackAssessmentFunnelEvent("funnel_cta_click", { step: "landing", section_id: section });
  trackAssessmentFunnelEvent("assessment_start", { path: "assessment", landing_ctx: "low" });
  onStart();
}

const INCLUDED_ITEMS = [
  "Diagnostic across 28 skills",
  "Personalized 12-week plan",
  "1:1 vetted SAT tutor",
  "Weekly progress dashboard",
  "Unlimited tutor messaging",
  "100% online"
] as const;

const HOW_IT_WORKS = [
  {
    title: "Take the assessment",
    body: "GPA, target score, prior prep.",
    meta: "2 min"
  },
  {
    title: "Skill diagnostic",
    body: "Map the 5 gaps costing points.",
    meta: "Instant"
  },
  {
    title: "Get the 12-week plan",
    body: "Built around the gaps that matter.",
    meta: "Same day"
  },
  {
    title: "1:1 tutor + support",
    body: "Weekly sessions. Text in between.",
    meta: "12 weeks"
  }
] as const;

const REVIEWS = [
  {
    scores: "1188 → 1410",
    quote: "12 weeks, +230 points. The diagnostic was the difference.",
    name: "David D.",
    initial: "D"
  },
  {
    scores: "1050 → 1280",
    quote: "Finally understood which skills actually moved the needle.",
    name: "Sarah M.",
    initial: "S"
  },
  {
    scores: "990 → 1210",
    quote: "We stopped guessing what to study. The plan was specific.",
    name: "James R.",
    initial: "J"
  }
] as const;

function Stars() {
  return (
    <span className="assessment-lp-stars" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}

export function AssessmentLandingLow({ onStartAssessment }: AssessmentLandingLowProps) {
  const go = (section: string) => () => startClick(onStartAssessment, section);

  return (
    <div className="assessment-lp">
      <div className="assessment-lp-inner">
        {/* §1 Hero */}
        <section className="assessment-lp-block assessment-lp-hero">
          <div className="assessment-lp-logo-row">
            <AssessmentLogo />
          </div>

          <h1 className="assessment-lp-hero-title">
            High GPA. Low SAT.
            <br />
            <span className="assessment-lp-accent">Fixable.</span>
          </h1>

          <ul className="assessment-lp-bullets">
            <li>
              <span className="assessment-lp-check" aria-hidden>
                ✓
              </span>
              Diagnose the 5 gaps costing points
            </li>
            <li>
              <span className="assessment-lp-check" aria-hidden>
                ✓
              </span>
              Personalized 12-week plan
            </li>
            <li>
              <span className="assessment-lp-check" aria-hidden>
                ✓
              </span>
              1:1 vetted SAT tutor
            </li>
          </ul>

          <div className="assessment-lp-hero-cta-card">
            <p className="assessment-lp-hero-cta-copy">
              Tell us about your son for a personalized SAT plan.
            </p>
            <AssessmentCta variant="full" onClick={go("hero")} />
          </div>

          <p className="assessment-lp-fine">
            Based on structured mentorship. Individual results vary. No score guarantees.
          </p>
        </section>
      </div>

      <div className="assessment-lp-bleed" aria-hidden>
        <div className="assessment-lp-gallery">
          <div className="assessment-lp-gallery-tile assessment-lp-gallery-tile--a" />
          <div className="assessment-lp-gallery-tile assessment-lp-gallery-tile--b" />
          <div className="assessment-lp-gallery-tile assessment-lp-gallery-tile--c" />
        </div>
      </div>

      <div className="assessment-lp-inner">
        {/* §2 Diagnostic */}
        <section className="assessment-lp-block assessment-lp-block--headline-only">
          <h2 className="assessment-lp-h2">Diagnostic-driven plan</h2>
        </section>
      </div>

      <div className="assessment-lp-bleed assessment-lp-bleed--tight" aria-hidden>
        <div className="assessment-lp-media assessment-lp-media--wide" />
      </div>

      <div className="assessment-lp-inner">
        <section className="assessment-lp-block">
          <p className="assessment-lp-body">
            The SAT tests 28 skills. Most students lose points on the same 5. We diagnose them.
            Then we drill them.
          </p>
          <AssessmentCta variant="full" onClick={go("diagnostic")} />
        </section>

        {/* §3 Outcome */}
        <section className="assessment-lp-block assessment-lp-block--wash">
          <h2 className="assessment-lp-h2 assessment-lp-h2--split">
            <span className="assessment-lp-h2-muted">Good news:</span> a stronger score is in
            his future.
          </h2>
          <p className="assessment-lp-body">
            Find the right plan for your son — built by a vetted SAT tutor.
          </p>
        </section>
      </div>

      <div className="assessment-lp-bleed assessment-lp-bleed--tight" aria-hidden>
        <div className="assessment-lp-media assessment-lp-media--portrait" />
      </div>

      <div className="assessment-lp-inner">
        {/* §4 Included */}
        <section className="assessment-lp-block assessment-lp-block--headline-only">
          <h2 className="assessment-lp-h2">What&apos;s included</h2>
        </section>
      </div>

      <div className="assessment-lp-bleed assessment-lp-bleed--tight" aria-hidden>
        <div className="assessment-lp-media assessment-lp-media--card" />
      </div>

      <div className="assessment-lp-inner">
        <section className="assessment-lp-block">
          <ul className="assessment-lp-included">
            {INCLUDED_ITEMS.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <span className="assessment-lp-check assessment-lp-check--inline" aria-hidden>
                  ✓
                </span>
              </li>
            ))}
          </ul>
          <AssessmentCta variant="full" onClick={go("included")} />
        </section>

        {/* §5 Reviews */}
        <section className="assessment-lp-block assessment-lp-block--wash">
          <h2 className="assessment-lp-h2">Parents are seeing the score jump.</h2>
          <div className="assessment-lp-reviews">
            {REVIEWS.map((r) => (
              <article key={r.name} className="assessment-lp-review">
                <p className="assessment-lp-review-scores">{r.scores}</p>
                <Stars />
                <p className="assessment-lp-review-badge">Verified</p>
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <div className="assessment-lp-review-author">
                  <span className="assessment-lp-review-avatar" aria-hidden>
                    {r.initial}
                  </span>
                  <span>{r.name}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="assessment-lp-fine assessment-lp-fine--center">
            Before/after scores shared by parents. Individual results vary.
          </p>
          <AssessmentCta variant="full" onClick={go("reviews")} />
        </section>

        {/* §6 How it works */}
        <section className="assessment-lp-block">
          <h2 className="assessment-lp-h2">How it works</h2>
          <ol className="assessment-lp-steps">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title}>
                <div className="assessment-lp-step-text">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <span className="assessment-lp-step-meta">{step.meta}</span>
                </div>
                <div className="assessment-lp-step-photo" aria-hidden>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </li>
            ))}
          </ol>
          <AssessmentCta variant="full" onClick={go("how")} />
        </section>
      </div>

      {/* §7 Dark band — Hims “personalized” block */}
      <section className="assessment-lp-dark">
        <div className="assessment-lp-inner">
          <h2 className="assessment-lp-h2 assessment-lp-h2--light">
            Your son&apos;s score, his plan, his pace.
          </h2>
          <ul className="assessment-lp-bullets assessment-lp-bullets--light">
            <li>
              <span className="assessment-lp-check assessment-lp-check--light" aria-hidden>
                ✓
              </span>
              Fix the gaps. Not all 28 skills.
            </li>
            <li>
              <span className="assessment-lp-check assessment-lp-check--light" aria-hidden>
                ✓
              </span>
              Personalized by a vetted tutor
            </li>
            <li>
              <span className="assessment-lp-check assessment-lp-check--light" aria-hidden>
                ✓
              </span>
              100% online — no office required
            </li>
          </ul>
          <AssessmentCta variant="full" variantTone="inverted" onClick={go("about")} />
        </div>
      </section>

      {/* §8 Footer */}
      <footer className="assessment-lp-footer">
        <div className="assessment-lp-inner">
          <AssessmentLogo />
          <p className="assessment-lp-footer-lead">Get the latest from illuminairy</p>
          <nav className="assessment-lp-footer-nav" aria-label="Legal">
            <a href="https://illuminairy.com/terms">Terms</a>
            <a href="https://illuminairy.com/privacy">Privacy</a>
            <a href="https://illuminairy.com/contact">Contact</a>
          </nav>
          <p className="assessment-lp-fine assessment-lp-fine--footer">
            SAT® is a trademark registered by the College Board, which is not affiliated with and
            does not endorse illuminairy.
          </p>
        </div>
      </footer>

      <div className="assessment-lp-sticky">
        <AssessmentCta variant="full" onClick={go("sticky")} />
      </div>
    </div>
  );
}
