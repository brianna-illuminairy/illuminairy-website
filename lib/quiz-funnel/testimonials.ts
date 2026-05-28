export type QuizTestimonial = {
  photo?: string;
  ba?: string;
  quote: string;
  attribution: string;
};

/** Parent-facing reviews for S7 (expand with Trustpilot copy as available). */
export const QUIZ_TESTIMONIALS: QuizTestimonial[] = [
  {
    photo: '/photos/male-student.png',
    ba: '1180 → 1410',
    quote:
      "I was skeptical of online tutoring. But the diagnostic showed me exactly what was wrong, and 12 weeks later he's at 1410.",
    attribution: 'David D. · Dad of a junior · CA',
  },
  {
    ba: '1220 → 1380',
    quote:
      'We finally understood why the GPA did not match the SAT. The plan focused on a few skills instead of everything at once.',
    attribution: 'Parent · Atlanta area',
  },
  {
    ba: '1090 → 1280',
    quote:
      'The strategy call was worth it. We knew what to work on before the next test date.',
    attribution: 'Parent · Georgia',
  },
];
