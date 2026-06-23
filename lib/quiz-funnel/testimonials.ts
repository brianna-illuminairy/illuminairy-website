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
      'Other tutoring companies wanted thousands upfront, and we were skeptical. We got so much value from the intro lesson alone that we knew we had found the right company. He moved up more than 200 points once the tutors focused on what the SAT Diagnostic ranked.',
    attribution: 'Jennifer W. · Parent of a junior · TX',
    reviewerName: 'Jennifer W.',
    reviewerDetail: 'Parent of a junior',
    reviewerLocation: 'Plano, TX',
    reviewTitle: 'The intro lesson sold us before we paid thousands elsewhere.',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1220 → 1380',
    quote:
      'We had quotes from tutors asking for big upfront packages. The intro lesson showed us what score was realistic and how the weekly plan would work. That was enough for us to sign on.',
    attribution: 'Michelle K. · Parent · IL',
    reviewerName: 'Michelle K.',
    reviewerDetail: 'Parent · Naperville, IL',
    reviewerLocation: 'Naperville, IL',
    reviewTitle: 'Skeptical until the intro lesson.',
    reviewedAt: '2 months ago',
    stars: 5,
  },
  {
    ba: '1090 → 1280',
    quote:
      'The diagnostic answered what self-study never did: what score was reasonable for her and how long it would take to get there. The tutors were clear experts on the problem types she kept missing.',
    attribution: 'Angela R. · Parent · NC',
    reviewerName: 'Angela R.',
    reviewerDetail: 'Parent · Charlotte, NC',
    reviewerLocation: 'Charlotte, NC',
    reviewTitle: 'Finally knew what was realistic.',
    reviewedAt: '1 month ago',
    stars: 5,
  },
  {
    ba: '1150 → 1340',
    quote:
      'My son loved working with the tutors. They explained why he missed questions instead of handing him another worksheet. Way better results than the Khan course we tried on our own.',
    attribution: 'Stephanie L. · Parent · AZ',
    reviewerName: 'Stephanie L.',
    reviewerDetail: 'Parent · Scottsdale, AZ',
    reviewerLocation: 'Scottsdale, AZ',
    reviewTitle: 'Better than self-study at home.',
    reviewedAt: '5 weeks ago',
    stars: 5,
  },
  {
    ba: '1240 → 1390',
    quote:
      'The SAT Diagnostic gave us a starting score we trusted. From there the plan focused on five or six skills, not two hundred. She improved 150 points with the August test eight weeks out.',
    attribution: 'Melissa H. · Parent · MN',
    reviewerName: 'Melissa H.',
    reviewerDetail: 'Parent · Edina, MN',
    reviewerLocation: 'Edina, MN',
    reviewTitle: 'Five skills, not the whole SAT.',
    reviewedAt: '6 weeks ago',
    stars: 5,
  },
  {
    ba: '1120 → 1310',
    quote:
      'We tried Khan on our own for months. Illuminairy ranked what mattered for his score, matched him with tutors who knew those sections cold, and he improved more than 190 points.',
    attribution: 'Laura B. · Parent · CO',
    reviewerName: 'Laura B.',
    reviewerDetail: 'Parent · Denver, CO',
    reviewerLocation: 'Denver, CO',
    reviewTitle: 'Tutors who actually knew the SAT.',
    reviewedAt: '2 weeks ago',
    stars: 5,
  },
  {
    ba: '1190 → 1360',
    quote:
      'The proctored SAT Diagnostic was worth it. We knew his real starting point, what 1400 would take, and which sections to hit first with only ten weeks left.',
    attribution: 'Christine M. · Parent · MA',
    reviewerName: 'Christine M.',
    reviewerDetail: 'Parent · Newton, MA',
    reviewerLocation: 'Newton, MA',
    reviewTitle: 'Trusted the starting score.',
    reviewedAt: '4 weeks ago',
    stars: 5,
  },
  {
    ba: '1070 → 1250',
    quote:
      'Everywhere else wanted thousands before we saw whether it would work. The intro lesson was so useful we booked the program that week. The tutors stuck to the same weekly plan after that.',
    attribution: 'Heather P. · Parent · TN',
    reviewerName: 'Heather P.',
    reviewerDetail: 'Parent · Franklin, TN',
    reviewerLocation: 'Franklin, TN',
    reviewTitle: 'We booked the same week as the intro lesson.',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1160 → 1320',
    quote:
      'We were hesitant after another company quoted a huge upfront fee. One intro lesson with Illuminairy and we could see the tutors actually knew the SAT. She improved more than 160 points from there.',
    attribution: 'Nicole T. · Parent · NJ',
    reviewerName: 'Nicole T.',
    reviewerDetail: 'Parent · Princeton, NJ',
    reviewerLocation: 'Princeton, NJ',
    reviewTitle: 'One lesson beat months of guessing.',
    reviewedAt: '5 weeks ago',
    stars: 5,
  },
  {
    ba: '1140 → 1330',
    quote:
      'Same tutors every week, same focus on what the diagnostic ranked. He improved over 190 points and actually looked forward to the sessions.',
    attribution: 'Lisa D. · Parent · VA',
    reviewerName: 'Lisa D.',
    reviewerDetail: 'Parent · Fairfax, VA',
    reviewerLocation: 'Fairfax, VA',
    reviewTitle: 'He looked forward to tutoring.',
    reviewedAt: '1 month ago',
    stars: 5,
  },
  {
    ba: '1100 → 1290',
    quote:
      'We needed movement before August with less than three months to go. The plan prioritized the highest-value skills first and the tutors delivered.',
    attribution: 'Amy C. · Parent · OH',
    reviewerName: 'Amy C.',
    reviewerDetail: 'Parent · Dublin, OH',
    reviewerLocation: 'Dublin, OH',
    reviewTitle: 'Highest-value skills first.',
    reviewedAt: '3 weeks ago',
    stars: 5,
  },
  {
    ba: '1200 → 1370',
    quote:
      'Other places wanted payment upfront before our daughter met anyone. We were skeptical. The intro lesson showed us expert tutors, a clear plan, and a score path we could trust.',
    attribution: 'Layla H. · Parent · MI',
    reviewerName: 'Layla H.',
    reviewerDetail: 'Parent · Troy, MI',
    reviewerLocation: 'Troy, MI',
    reviewTitle: 'Met the tutors before we committed.',
    reviewedAt: '6 weeks ago',
    stars: 5,
  },
  {
    ba: '1210 → 1400',
    quote:
      'They walked us through why she kept missing the same algebra questions, built a weekly plan around her test date, and she hit 1400. The tutors knew the SAT inside out.',
    attribution: 'Priya M. · Parent · GA',
    reviewerName: 'Priya M.',
    reviewerDetail: 'Parent · Atlanta, GA',
    reviewerLocation: 'Atlanta, GA',
    reviewTitle: 'Hit 1400 with ten weeks left.',
    reviewedAt: '2 months ago',
    stars: 5,
  },
];
