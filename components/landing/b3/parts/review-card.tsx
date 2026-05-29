import type { LandingReview } from "@/lib/landing/content";
import { reviewPhotoSlotsByIndex } from "@/lib/landing/assets";
import { LandingPhoto } from "./landing-photo";

type ReviewCardProps = {
  review: LandingReview;
  index: number;
};

export function ReviewCard({ review, index }: ReviewCardProps) {
  const photos = reviewPhotoSlotsByIndex[index];
  const hasPhotos = Boolean(photos?.before && photos?.after);

  return (
    <article className="review">
      <div className={`ba ${hasPhotos ? "" : "ba-scores-only"}`}>
        {hasPhotos ? (
          <>
            <div className="ba-col">
              <span className="pill">Month 0</span>
              <div className="ba-img-wrap">
                <LandingPhoto
                  slotLabel={`review-${index + 1}-before`}
                  src={photos.before}
                  alt={`SAT score before: ${review.before}`}
                  aspect="square"
                  width={160}
                  height={160}
                  className="ba-img"
                />
              </div>
              <div className="ba-score">{review.before}</div>
            </div>
            <div className="ba-col after">
              <span className="pill accent">Month {review.months}</span>
              <div className="ba-img-wrap">
                <LandingPhoto
                  slotLabel={`review-${index + 1}-after`}
                  src={photos.after}
                  alt={`SAT score after: ${review.after}`}
                  aspect="square"
                  width={160}
                  height={160}
                  className="ba-img"
                />
              </div>
              <div className="ba-score after-score">{review.after}</div>
            </div>
          </>
        ) : (
          <>
            <div className="ba-col ba-col-score-only">
              <span className="pill">Before</span>
              <div className="ba-score ba-score-large">{review.before}</div>
            </div>
            <div className="ba-arrow" aria-hidden>
              →
            </div>
            <div className="ba-col ba-col-score-only after">
              <span className="pill accent">After</span>
              <div className="ba-score ba-score-large after-score">{review.after}</div>
            </div>
          </>
        )}
      </div>
      <p className="quote">&ldquo;{review.quote}&rdquo;</p>
      <div className="who">
        <div className="ava" aria-hidden>
          {review.initials}
        </div>
        <div>
          <div className="name">{review.name}</div>
          <div className="verified">✓ Verified Parent Review</div>
        </div>
      </div>
    </article>
  );
}
