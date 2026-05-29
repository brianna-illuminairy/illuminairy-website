"use client";

import {
  landingDisclaimers,
  landingReviews,
  landingShared,
  type LandingSectionId
} from "@/lib/landing/content";
import { landingPhotoSlots } from "@/lib/landing/assets";
import { InlineCta } from "./parts/cta";
import { IncludedRow } from "./parts/included-row";
import { ReviewCard } from "./parts/review-card";
import { StepCard } from "./parts/step-card";
import { LandingFooter } from "./parts/footer";
import { LandingPhoto } from "./parts/landing-photo";

type BodyProps = {
  onCta: (sectionId: LandingSectionId, label?: string) => void;
};

export function B3Body({ onCta }: BodyProps) {
  const start = (sectionId: LandingSectionId, label?: string) =>
    onCta(sectionId, label ?? landingShared.inlineCtaLabel);

  return (
    <>
      <section className="section bg-paper il-section-science">
        <div className="il-premium-container">
          <h2 className="il-section-heading">{landingShared.science.title}</h2>
          <div className="il-section-split">
            <div className="il-section-copy">
              <p className="il-body-copy">{landingShared.science.p1}</p>
              <p className="il-body-copy il-body-copy-spaced">{landingShared.science.p2}</p>
              <InlineCta onClick={() => start("science")} />
            </div>
            <LandingPhoto
              slotLabel="lp-science-diagnostic.jpg"
              src={landingPhotoSlots.science}
              alt="SAT skill diagnostic"
              aspect="section"
              fill
              sizes="(max-width: 1023px) 100vw, 480px"
              className="il-photo-section"
            />
          </div>
        </div>
      </section>

      <section className="section il-section-great-news">
        <div className="il-premium-container">
          <h2 className="il-section-heading">
            <span className="muted">{landingShared.greatNews.titleMuted}</span>{" "}
            {landingShared.greatNews.titleRest}
          </h2>
          <p className="lead il-lead-spaced">{landingShared.greatNews.lead}</p>
          <div className="il-section-split il-section-split-media">
            <div className="il-overlay-wrap">
              <LandingPhoto
                slotLabel="lp-great-news-team.jpg"
                src={landingPhotoSlots.greatNews}
                alt="Illuminairy tutor team"
                aspect="tall"
                fill
                sizes="(max-width: 1023px) 100vw, 480px"
                className="il-photo-tall il-photo-great-news"
              />
              <div className="il-overlay-badge">{landingShared.greatNews.overlay}</div>
              <button
                type="button"
                className="btn btn-pill il-overlay-pill"
                onClick={() => start("great_news", landingShared.greatNews.pillCta)}
              >
                {landingShared.greatNews.pillCta}
              </button>
            </div>
          </div>
          <p className="disclaimer il-disclaimer-spaced">{landingDisclaimers.greatNews}</p>
        </div>
      </section>

      <section className="section bg-cream il-section-included">
        <div className="il-premium-container">
          <h2>{landingShared.includedTitle}</h2>
          <div className="il-included-layout">
            {landingPhotoSlots.included ? (
              <div className="il-included-photo">
                <LandingPhoto
                  slotLabel="lp-included-product.jpg"
                  src={landingPhotoSlots.included}
                  alt="What's included in the SAT plan"
                  aspect="square"
                  width={140}
                  height={140}
                  className="il-included-img"
                />
              </div>
            ) : (
              <div className="il-included-placeholder">
                <LandingPhoto
                  slotLabel="lp-included-product.jpg"
                  src={null}
                  alt=""
                  aspect="wide"
                  className="il-included-ph"
                />
              </div>
            )}
            <div className="col il-included-list">
              {landingShared.includedItems.map((item) => (
                <IncludedRow key={item} label={item} />
              ))}
              <div className="il-cta-spaced">
                <InlineCta onClick={() => start("included")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section flush" aria-labelledby="reviews-heading">
        <div className="il-premium-container section-inner">
          <h2 id="reviews-heading">{landingShared.reviews.title}</h2>
        </div>
        <div className="il-reviews-wrap">
          <div className="il-premium-container">
            <div className="carousel il-reviews-track" role="region" aria-label="Parent reviews">
              {landingReviews.map((review, index) => (
                <ReviewCard key={review.name} review={review} index={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="il-premium-container section-inner il-cta-block">
          <InlineCta onClick={() => start("reviews")} />
          <p className="disclaimer il-disclaimer-spaced">{landingDisclaimers.reviews}</p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="il-premium-container">
          <h2>{landingShared.howItWorks.title}</h2>
          <div className="col il-steps-list">
            <StepCard
              stepNum="01"
              title={landingShared.howItWorks.steps[0].title}
              desc={landingShared.howItWorks.steps[0].desc}
              time={landingShared.howItWorks.steps[0].time}
              imageSrc={landingPhotoSlots.stepAssessment}
              imageAlt="SAT assessment step"
              slotLabel="lp-step-assessment.jpg"
            />
            <StepCard
              stepNum="02"
              title={landingShared.howItWorks.steps[1].title}
              desc={landingShared.howItWorks.steps[1].desc}
              time={landingShared.howItWorks.steps[1].time}
              imageSrc={landingPhotoSlots.stepDiagnostic}
              imageAlt="Skill diagnostic step"
              slotLabel="lp-step-diagnostic.jpg"
            />
            <StepCard
              stepNum="03"
              title={landingShared.howItWorks.steps[2].title}
              desc={landingShared.howItWorks.steps[2].desc}
              time={landingShared.howItWorks.steps[2].time}
              imageSrc={landingPhotoSlots.stepPlan}
              imageAlt="SAT plan step"
              slotLabel="lp-step-plan.jpg"
            />
            <StepCard
              stepNum="04"
              title={landingShared.howItWorks.steps[3].title}
              desc={landingShared.howItWorks.steps[3].desc}
              time={landingShared.howItWorks.steps[3].time}
              imageSrc={landingPhotoSlots.stepTutor}
              imageAlt="1:1 SAT tutor session"
              slotLabel="lp-step-tutor.jpg"
            />
          </div>
          <div className="il-cta-spaced">
            <InlineCta onClick={() => start("how_it_works")} />
          </div>
        </div>
      </section>

      <section className="section bg-ink il-premium-dark-section">
        <div className="il-premium-container">
          <h2>{landingShared.finalCta.title}</h2>
          <ul className="checklist on-dark il-final-checklist">
            {landingShared.finalCta.checklist.map((item) => (
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
    </>
  );
}
