/** Parent (mom) quotes for LP trust bar carousel — illustrative, permission-style voice. */

export type LandingMomTrustReview = {
  quote: string;
  name: string;
  role: string;
  location: string;
  before: string;
  after: string;
  initials: string;
};

export const landingMomTrustBar = {
  heading: "What other parents say"
} as const;

export const landingMomTrustReviews: LandingMomTrustReview[] = [
  {
    quote:
      "We spent a year on Khan and Bluebook. The Skill Diagnostic showed five skills to work, not everything on the test. He went from 1160 to 1410 before October.",
    name: "Jennifer M.",
    role: "Mom of a junior",
    location: "Atlanta area",
    before: "1160",
    after: "1410",
    initials: "J"
  },
  {
    quote:
      "I kept asking why his GPA did not match his SAT. The free plan spelled out what was realistic for August and what to work on first.",
    name: "Rachel K.",
    role: "Mom of a senior",
    location: "Dallas area",
    before: "1220",
    after: "1430",
    initials: "R"
  },
  {
    quote:
      "Khan and a group class did not fix timing. Once tutoring focused on the skills the diagnostic ranked, she moved 210 points.",
    name: "Priya S.",
    role: "Mom of a junior",
    location: "Suburban NJ",
    before: "1080",
    after: "1290",
    initials: "P"
  },
  {
    quote:
      "The Strategy Call was 15 minutes and actually useful. We stopped guessing and had a weekly plan that matched her real mistakes.",
    name: "Lauren T.",
    role: "Mom of a junior",
    location: "Charlotte area",
    before: "1140",
    after: "1380",
    initials: "L"
  },
  {
    quote:
      "I wanted to see which skills mattered before we paid for more tutoring. The ranked list from the diagnostic is what finally moved his score.",
    name: "Michelle H.",
    role: "Mom of a senior",
    location: "Phoenix area",
    before: "1190",
    after: "1420",
    initials: "M"
  },
  {
    quote:
      "We had a realistic target for October instead of another vague 'study more.' Plus 190 points, and we knew why each week.",
    name: "Karen W.",
    role: "Mom of a senior",
    location: "Northern VA",
    before: "1240",
    after: "1430",
    initials: "K"
  }
];
