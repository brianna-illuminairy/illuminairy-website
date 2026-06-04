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
          <div
            className={
              landingPhotoSlots.science
                ? "il-section-split"
                : "il-section-split il-section-split--copy-only"
            }
          >
            <div className="il-section-copy">
              <p className="il-body-copy">{landingShared.science.p1}</p>
              <p className="il-body-copy il-body-copy-spaced">{landingShared.science.p2}</p>
              <InlineCta onClick={() => start("science")} />
            </div>
            {landingPhotoSlots.science ? (
              <LandingPhoto
                slotLabel="lp-science-diagnostic.jpg"
                src={landingPhotoSlots.science}
                alt="SAT skill diagnostic"
                aspect="section"
                fill
                sizes="(max-width: 1023px) 100vw, 480px"
                className="il-photo-section"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="section il-section-great-news">
        <div className="il-premium-container">
          <h2 className="il-section-heading">{landingShared.greatNews.title}</h2>
          <p className="lead il-lead-spaced">{landingShared.greatNews.lead}</p>
          <div className="il-section-copy il-what-it-is">
            <p className="il-body-copy">{landingShared.whatItIs.lead}</p>
            <p className="il-body-copy il-body-copy-spaced">{landingShared.whatItIs.deliverable}</p>
            <p className="il-body-copy il-body-copy-spaced muted">{landingShared.whatItIs.after}</p>
          </div>
          <div className="il-cta-spaced">
            <InlineCta
              label={landingShared.greatNews.pillCta}
              onClick={() => start("great_news", landingShared.greatNews.pillCta)}
            />
          </div>
          <p className="disclaimer il-disclaimer-spaced">{landingDisclaimers.greatNews}</p>
        </div>
      </section>

      <section className="section bg-cream il-section-included">
        <div className="il-premium-container">
          <h2>{landingShared.includedTitle}</h2>
          <div
            className={
              landingPhotoSlots.included
                ? "il-included-layout"
                : "il-included-layout il-included-layout--list-only"
            }
          >
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
            ) : null}
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
              imageAlt="Plan Builder on phone — parent answers questions"
              slotLabel="lp-step-assessment.jpg"
            />
            <StepCard
              stepNum="02"
              title={landingShared.howItWorks.steps[1].title}
              desc={landingShared.howItWorks.steps[1].desc}
              time={landingShared.howItWorks.steps[1].time}
              imageSrc={landingPhotoSlots.stepStrategyCall}
              imageAlt="SAT Strategy Call scheduling"
              slotLabel="lp-step-strategy-call.jpg"
            />
            <StepCard
              stepNum="03"
              title={landingShared.howItWorks.steps[2].title}
              desc={landingShared.howItWorks.steps[2].desc}
              time={landingShared.howItWorks.steps[2].time}
              imageSrc={landingPhotoSlots.stepDiagnostic}
              imageAlt="Skill Diagnostic step"
              slotLabel="lp-step-diagnostic.jpg"
            />
            <StepCard
              stepNum="04"
              title={landingShared.howItWorks.steps[3].title}
              desc={landingShared.howItWorks.steps[3].desc}
              time={landingShared.howItWorks.steps[3].time}
              imageSrc={landingPhotoSlots.stepWeeklyPlan}
              imageAlt="Personalized weekly SAT plan"
              slotLabel="lp-step-weekly-plan.jpg"
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
