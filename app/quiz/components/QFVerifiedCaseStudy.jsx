'use client';

import {
  S3_VERIFIED_CASE,
  S3_VERIFIED_RATING_LABEL,
  s3VerifiedCaseHeadlineParts,
} from '@/lib/quiz-funnel/s3-verified-case-study';

const STAR_COUNT = 5;

export function QFVerifiedCaseStudy() {
  const headline = s3VerifiedCaseHeadlineParts();

  return (
    <div className="gap-22 qf-verified-case">
      <div
        className="qf-verified-case__rating"
        role="img"
        aria-label={`${STAR_COUNT} out of ${STAR_COUNT} stars, ${S3_VERIFIED_RATING_LABEL}`}
      >
        <span className="qf-verified-case__stars" aria-hidden="true">
          {Array.from({ length: STAR_COUNT }, (_, i) => (
            <span key={i} className="qf-verified-case__star">
              ★
            </span>
          ))}
        </span>
        <span className="qf-meta qf-verified-case__eyebrow">{S3_VERIFIED_RATING_LABEL}</span>
      </div>

      <h1 className="qf-h1" style={{ marginBottom: 0 }}>
        {headline.studentName} went from <em>{headline.before}</em> to{' '}
        <em>{headline.after}</em> in <em>{headline.weeks}</em> weeks.
      </h1>

      <div className="qf-verified-case__photo">
        <img
          src={S3_VERIFIED_CASE.photo}
          alt={S3_VERIFIED_CASE.photoAlt}
          className="qf-verified-case__photo-img"
        />
      </div>

      <blockquote className="qf-verified-case__quote">
        &ldquo;{S3_VERIFIED_CASE.quote}&rdquo;
      </blockquote>

      <p className="qf-meta qf-verified-case__attrib">{S3_VERIFIED_CASE.attribution}</p>
    </div>
  );
}
