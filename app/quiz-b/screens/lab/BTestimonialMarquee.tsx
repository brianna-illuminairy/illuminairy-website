'use client';

import { QUIZ_TESTIMONIALS, type QuizTestimonial } from '@/lib/quiz-funnel/testimonials';

const DEFAULT_STARS = 5;

function reviewerInitials(name: string) {
  const parts = name.replace(/\./g, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function parseScoreBand(ba?: string) {
  if (!ba) return null;
  const match = ba.match(/(\d{3,4})\s*[→\-–]\s*(\d{3,4})/);
  if (!match) return null;
  return { start: match[1], end: match[2] };
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
    (item.quote.includes('.') ? item.quote.split('.')[0] + '.' : item.quote);
  return { name, location, title, initials: reviewerInitials(name) };
}

function LocationPin() {
  return (
    <svg
      className="qfb-review-card__pin"
      width="12"
      height="12"
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

function ReviewCard({ item }: { item: QuizTestimonial }) {
  const reviewer = resolveReviewer(item);
  const scores = parseScoreBand(item.ba);

  return (
    <article className="qfb-review-card">
      <header className="qfb-review-card__top">
        <div className="qfb-review-card__avatar" aria-hidden="true">
          {reviewer.initials}
        </div>
        <div className="qfb-review-card__who">
          <p className="qfb-review-card__name">{reviewer.name}</p>
          <p className="qfb-review-card__loc">
            <LocationPin />
            <span>{reviewer.location}</span>
          </p>
        </div>
        <InlineStars count={item.stars ?? DEFAULT_STARS} />
      </header>

      <p className="qfb-review-card__title">{reviewer.title}</p>
      <p className="qfb-review-card__body">{item.quote}</p>

      {scores ? (
        <div className="qfb-review-card__scores">
          <span className="qfb-review-card__score-start">SAT {scores.start}</span>
          <span className="qfb-review-card__score-end">{scores.end}</span>
        </div>
      ) : null}
    </article>
  );
}

export function BTestimonialMarquee() {
  const doubled = [...QUIZ_TESTIMONIALS, ...QUIZ_TESTIMONIALS];

  return (
    <div className="qfb-marquee-wrap qfb-marquee-wrap--reviews" aria-label="Parent reviews">
      <div className="qfb-marquee-track">
        {doubled.map((item, i) => (
          <ReviewCard key={`${item.reviewerName ?? item.attribution}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
