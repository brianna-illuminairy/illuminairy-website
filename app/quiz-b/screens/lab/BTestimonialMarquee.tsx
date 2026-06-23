'use client';

import { QUIZ_TESTIMONIALS } from '@/lib/quiz-funnel/testimonials';

export function BTestimonialMarquee() {
  const doubled = [...QUIZ_TESTIMONIALS, ...QUIZ_TESTIMONIALS];

  return (
    <div className="qfb-marquee-wrap" aria-label="Parent testimonials">
      <div className="qfb-marquee-track">
        {doubled.map((item, i) => (
          <div key={`${item.attribution}-${i}`} className="qfb-marquee-card qf-card">
            {item.ba ? <p className="qfb-marquee-ba">{item.ba}</p> : null}
            <p className="qfb-marquee-quote">&ldquo;{item.quote}&rdquo;</p>
            <p className="qfb-marquee-meta">{item.attribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
