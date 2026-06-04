"use client";

import { landingCompact } from "@/lib/landing/compact-content";
import { landingShared, type LandingSectionId } from "@/lib/landing/content";
import { LandingFooter } from "./parts/footer";

type CompactBodyProps = {
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

export function B3CompactBody({ onCta }: CompactBodyProps) {
  const start = (sectionId: LandingSectionId, label?: string) =>
    onCta(sectionId, label ?? landingShared.heroCtaLabel);

  return (
    <div className="il-compact-main">
      <section className="section bg-paper il-section-compact-why">
        <div className="il-premium-container">
          <h2 className="il-section-heading">{landingCompact.why.title}</h2>
          <ul className="checklist il-compact-why-list">
            {landingCompact.why.bullets.map((item) => (
              <li key={item}>
                <span className="check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section il-section-compact-proof">
        <div className="il-premium-container">
          <p className="il-body-copy il-compact-proof-line">{landingCompact.proof.line}</p>
        </div>
      </section>

      <section className="section bg-cream il-section-compact-steps">
        <div className="il-premium-container">
          <h2>{landingCompact.howItWorks.title}</h2>
          <p className="lead il-compact-steps-subhead">{landingCompact.howItWorks.subhead}</p>
          <ol className="il-compact-steps-list">
            {landingCompact.howItWorks.steps.map((step) => (
              <li key={step.stepNum} className="il-compact-step">
                <span className="il-compact-step-badge" aria-hidden>
                  {step.stepNum}
                </span>
                <div className="il-compact-step-copy">
                  <h3 className="il-compact-step-title">{step.title}</h3>
                  <p className="il-body-copy">{step.desc}</p>
                  <p className="il-compact-step-time">{step.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ink il-premium-dark-section">
        <div className="il-premium-container">
          <h2>{landingCompact.finalCta.title}</h2>
          <ul className="checklist on-dark il-final-checklist">
            {landingCompact.finalCta.checklist.map((item) => (
              <li key={item}>
                <span className="check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-cream"
            onClick={() => start("final_cta")}
          >
            {landingShared.inlineCtaLabel} <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
