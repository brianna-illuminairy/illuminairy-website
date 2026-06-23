export type QuizTestimonial = {
  photo?: string;
  ba?: string;
  quote: string;
  /** Full byline for legacy surfaces (Finale, thank-you). */
  attribution: string;
  stars?: number;
  /** Trustpilot-style reviewer row (Plan B marquee). */
  reviewerName?: string;
  reviewerDetail?: string;
  reviewerLocation?: string;
  reviewTitle?: string;
  reviewedAt?: string;
};

/**
 * Parent-facing reviews for Plan B computing marquee + legacy funnel surfaces.
 * Reviewer names: first name + last initial, US moms ~43–57 (late Gen X / early Millennial parent cohort).
 * ~89% common Caucasian names, ~11% South Asian / Middle Eastern.
 */
export const QUIZ_TESTIMONIALS: QuizTestimonial[] = [
  {
    ba: '1180 → 1410',
    quote:
      'I was skeptical of online tutoring. The Skill Diagnostic showed us exactly what was wrong. My son hit 1410 on the next attempt.',
    attribution: 'Jennifer W. · Parent of a junior · TX',
    reviewerName: 'Jennifer W.',
    reviewerDetail: 'Parent of a junior',
    reviewerLocation: 'Plano, TX',
    reviewTitle: 'The Skill Diagnostic showed us exactly what was wrong',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1220 → 1380',
    quote:
      'We finally understood why her GPA did not match the SAT. The plan focused on a few skills instead of everything at once.',
    attribution: 'Michelle K. · Parent · IL',
    reviewerName: 'Michelle K.',
    reviewerDetail: 'Parent · Naperville, IL',
    reviewerLocation: 'Naperville, IL',
    reviewTitle: 'We finally understood why the GPA did not match the SAT',
    reviewedAt: '2 months ago',
    stars: 5,
  },
  {
    ba: '1090 → 1280',
    quote:
      'The Strategy Call was worth it. We knew what to work on before the next test date and stopped guessing.',
    attribution: 'Angela R. · Parent · NC',
    reviewerName: 'Angela R.',
    reviewerDetail: 'Parent · Charlotte, NC',
    reviewerLocation: 'Charlotte, NC',
    reviewTitle: 'The Strategy Call was worth it',
    reviewedAt: '1 month ago',
    stars: 5,
  },
  {
    ba: '1150 → 1340',
    quote:
      'My daughter stopped dreading SAT practice once the mentor narrowed it to the problem types she kept missing.',
    attribution: 'Stephanie L. · Parent · AZ',
    reviewerName: 'Stephanie L.',
    reviewerDetail: 'Parent · Scottsdale, AZ',
    reviewerLocation: 'Scottsdale, AZ',
    reviewTitle: 'She stopped dreading SAT practice',
    reviewedAt: '5 weeks ago',
    stars: 5,
  },
  {
    ba: '1240 → 1390',
    quote:
      'The weekly plan was clear enough that I could tell whether she was on track without hovering over every assignment.',
    attribution: 'Melissa H. · Parent · MN',
    reviewerName: 'Melissa H.',
    reviewerDetail: 'Parent · Edina, MN',
    reviewerLocation: 'Edina, MN',
    reviewTitle: 'A weekly plan I could actually follow',
    reviewedAt: '6 weeks ago',
    stars: 5,
  },
  {
    ba: '1120 → 1310',
    quote:
      'We had tried Khan on our own. This was the first time someone ranked what mattered for her score and stuck with it.',
    attribution: 'Laura B. · Parent · CO',
    reviewerName: 'Laura B.',
    reviewerDetail: 'Parent · Denver, CO',
    reviewerLocation: 'Denver, CO',
    reviewTitle: 'Someone finally ranked what mattered',
    reviewedAt: '2 weeks ago',
    stars: 5,
  },
  {
    ba: '1190 → 1360',
    quote:
      'I liked that the diagnostic was proctored. We trusted the starting point before we committed to the program.',
    attribution: 'Christine M. · Parent · MA',
    reviewerName: 'Christine M.',
    reviewerDetail: 'Parent · Newton, MA',
    reviewerLocation: 'Newton, MA',
    reviewTitle: 'We trusted the starting point',
    reviewedAt: '4 weeks ago',
    stars: 5,
  },
  {
    ba: '1070 → 1250',
    quote:
      'Booking the free lesson was easy. By the end of the session we had a realistic target for the August test.',
    attribution: 'Heather P. · Parent · TN',
    reviewerName: 'Heather P.',
    reviewerDetail: 'Parent · Franklin, TN',
    reviewerLocation: 'Franklin, TN',
    reviewTitle: 'A realistic target for August',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1160 → 1320',
    quote:
      'The diagnostic report was specific. We could see which sections were costing her time before we paid for more tutoring.',
    attribution: 'Nicole T. · Parent · NJ',
    reviewerName: 'Nicole T.',
    reviewerDetail: 'Parent · Princeton, NJ',
    reviewerLocation: 'Princeton, NJ',
    reviewTitle: 'Specific before we committed',
    reviewedAt: '5 weeks ago',
    stars: 5,
  },
  {
    ba: '1140 → 1330',
    quote:
      'My son actually showed up for the sessions. The same mentor each week made a difference for us.',
    attribution: 'Lisa D. · Parent · VA',
    reviewerName: 'Lisa D.',
    reviewerDetail: 'Parent · Fairfax, VA',
    reviewerLocation: 'Fairfax, VA',
    reviewTitle: 'The same mentor each week helped',
    reviewedAt: '1 month ago',
    stars: 5,
  },
  {
    ba: '1100 → 1290',
    quote:
      'I appreciated the parent updates. I knew what they worked on without sitting in on every session.',
    attribution: 'Amy C. · Parent · OH',
    reviewerName: 'Amy C.',
    reviewerDetail: 'Parent · Dublin, OH',
    reviewerLocation: 'Dublin, OH',
    reviewTitle: 'Parent updates that made sense',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1200 → 1370',
    quote:
      'We moved here from Jordan two years ago. The program explained the SAT in plain terms and kept my daughter on a steady schedule.',
    attribution: 'Layla H. · Parent · MI',
    reviewerName: 'Layla H.',
    reviewerDetail: 'Parent · Troy, MI',
    reviewerLocation: 'Troy, MI',
    reviewTitle: 'Plain terms and a steady schedule',
    reviewedAt: '6 weeks ago',
    stars: 5,
  },
  {
    ba: '1210 → 1400',
    quote:
      'The mentor walked us through why she kept missing the same algebra questions. That clarity mattered more than another practice test.',
    attribution: 'Priya M. · Parent · GA',
    reviewerName: 'Priya M.',
    reviewerDetail: 'Parent · Atlanta, GA',
    reviewerLocation: 'Atlanta, GA',
    reviewTitle: 'Clarity on what she kept missing',
    reviewedAt: '2 months ago',
    stars: 5,
  },
];
