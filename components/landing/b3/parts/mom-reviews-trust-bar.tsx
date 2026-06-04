"use client";

import { useCallback, useEffect, useState } from "react";
import {
  landingMomTrustBar,
  landingMomTrustReviews,
  type LandingMomTrustReview
} from "@/lib/landing/trust-mom-reviews";
import { landingTrustBarDisclaimer } from "@/lib/landing/trust-scores";
import { tutoringHeritageTrust } from "@/lib/site";

function MomReviewSlide({ review }: { review: LandingMomTrustReview }) {
  return (
    <article className="il-trust-mom-slide" aria-roledescription="slide">
      <blockquote className="il-trust-mom-quote">&ldquo;{review.quote}&rdquo;</blockquote>
      <div className="il-trust-mom-meta">
        <p className="il-trust-mom-scores">
          <span className="il-trust-score-before">{review.before}</span>
          <span className="il-trust-score-arrow" aria-hidden>
            →
          </span>
          <span className="il-trust-score-after">{review.after}</span>
        </p>
        <p className="il-trust-mom-attribution">
          <span className="il-trust-mom-avatar" aria-hidden>
            {review.initials}
          </span>
          <span>
            <span className="il-trust-mom-name">{review.name}</span>
            <span className="il-trust-mom-role">
              {review.role} · {review.location}
            </span>
          </span>
        </p>
      </div>
    </article>
  );
}

/** Alternative trust strip — rotating parent quotes (preview via ?trust_bar=mom_reviews). */
export function MomReviewsTrustBar() {
  const count = landingMomTrustReviews.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [count, paused]);

  return (
    <section
      className="il-trust-bar il-trust-bar--mom-reviews il-trust-bar--national"
      aria-labelledby="il-trust-bar-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="il-premium-container il-trust-bar-inner">
        <p className="il-trust-bar-eyebrow">{tutoringHeritageTrust.eyebrow}</p>
        <p id="il-trust-bar-heading" className="il-trust-bar-title">
          {landingMomTrustBar.heading}
        </p>

        <div
          className="il-trust-mom-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Parent reviews"
        >
          <div className="il-trust-mom-viewport">
            {landingMomTrustReviews.map((review, slideIndex) => (
              <div
                key={review.name}
                className="il-trust-mom-panel"
                hidden={slideIndex !== index}
                aria-hidden={slideIndex !== index}
              >
                <MomReviewSlide review={review} />
              </div>
            ))}
          </div>

          {count > 1 ? (
            <div className="il-trust-mom-controls">
              <button
                type="button"
                className="il-trust-mom-nav"
                aria-label="Previous review"
                onClick={() => goTo(index - 1)}
              >
                ‹
              </button>
              <div className="il-trust-mom-dots" role="tablist" aria-label="Choose review">
                {landingMomTrustReviews.map((review, dotIndex) => (
                  <button
                    key={review.name}
                    type="button"
                    role="tab"
                    className="il-trust-mom-dot"
                    aria-selected={dotIndex === index}
                    aria-label={`Review ${dotIndex + 1} of ${count}`}
                    onClick={() => goTo(dotIndex)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="il-trust-mom-nav"
                aria-label="Next review"
                onClick={() => goTo(index + 1)}
              >
                ›
              </button>
            </div>
          ) : null}
        </div>

        <p className="il-trust-bar-disclaimer">{landingTrustBarDisclaimer}</p>
      </div>
    </section>
  );
}
