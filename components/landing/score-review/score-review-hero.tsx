"use client";

import { scoreReviewLpCopy } from "./score-review-content";

type ScoreReviewHeroProps = {
  onStart: () => void;
};

export function ScoreReviewHero({ onStart }: ScoreReviewHeroProps) {
  const { momQuote, offer } = scoreReviewLpCopy;

  return (
    <section className="lp-hero sr-lp-hero">
      <div className="lp-container lp-hero-single">
        <blockquote className="sr-lp-mom-quote">
          <p className="sr-lp-mom-quote__lead">
            {momQuote.lines.map((line) => (
              <span key={line} className="line">
                {line}
              </span>
            ))}
          </p>
          <p className="sr-lp-mom-quote__body">{momQuote.body}</p>
        </blockquote>

        <div className="lp-cta-card sr-lp-offer">
          <p className="qf-meta sr-lp-offer__eyebrow">{offer.eyebrow}</p>
          <h1 className="lp-h1 sr-lp-offer__headline">{offer.headline}</h1>
          <ul className="lp-cta-value">
            {offer.bullets.map((b) => (
              <li key={b}>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
          <button type="button" className="lp-btn" onClick={onStart}>
            {offer.button} <span className="arrow">→</span>
          </button>
          <p className="lp-cta-sub">{offer.finePrint}</p>
        </div>
      </div>
    </section>
  );
}
