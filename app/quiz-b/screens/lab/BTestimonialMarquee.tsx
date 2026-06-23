'use client';

import { useEffect, useState } from 'react';
import { QUIZ_TESTIMONIALS, type QuizTestimonial } from '@/lib/quiz-funnel/testimonials';

const DEFAULT_STARS = 5;
const COMPUTING_ROTATE_MS = 9000;

function reviewerInitials(name: string) {
  const parts = name.replace(/\./g, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function resolveReviewer(item: QuizTestimonial) {
  const name =
    item.reviewerName ??
    item.attribution.split('·')[0]?.trim() ??
    item.attribution;
  const location =
    item.reviewerLocation ??
    item.reviewerDetail?.split('·').pop()?.trim() ??
    item.attribution.split('·').slice(-1)[0]?.trim() ??
    'US';
  const title =
    item.reviewTitle ??
    (item.quote.includes('.') ? `${item.quote.split('.')[0]?.trim()}.` : item.quote);
  return { name, location, title, initials: reviewerInitials(name) };
}

function LocationPin() {
  return (
    <svg
      className="qfb-review-card__pin"
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1a3 3 0 0 0-3 3c0 2.25 3 5.5 3 5.5s3-3.25 3-5.5a3 3 0 0 0-3-3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

function InlineStars({ count = DEFAULT_STARS }: { count?: number }) {
  const n = Math.max(1, Math.min(5, count));
  return (
    <div className="qfb-review-card__stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="qfb-review-card__star" aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

function ComputingReviewCard({ item }: { item: QuizTestimonial }) {
  const reviewer = resolveReviewer(item);

  return (
    <article className="qfb-review-card qfb-review-card--computing">
      <header className="qfb-review-card__top">
        <div className="qfb-review-card__avatar" aria-hidden="true">
          {reviewer.initials}
        </div>
        <div className="qfb-review-card__identity">
          <span className="qfb-review-card__name">{reviewer.name}</span>
          <span className="qfb-review-card__loc">
            <LocationPin />
            {reviewer.location}
          </span>
        </div>
        <InlineStars count={item.stars ?? DEFAULT_STARS} />
      </header>

      <p className="qfb-review-card__title">{reviewer.title}</p>
      <p className="qfb-review-card__body">{item.quote}</p>
    </article>
  );
}

/** Full-width rotating review card pinned to the bottom of b-computing. */
export function BComputingReviews() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % QUIZ_TESTIMONIALS.length);
    }, COMPUTING_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="qfb-computing__reviews" aria-label="Parent testimonials">
      <ComputingReviewCard item={QUIZ_TESTIMONIALS[index] ?? QUIZ_TESTIMONIALS[0]} />
    </section>
  );
}
