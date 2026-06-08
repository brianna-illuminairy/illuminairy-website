// lp-data-v3.jsx — content model for SAT Landing v3.
// Single focused direction. Headline is the "high GPA / low SAT" tension,
// subheadline names the deliverable (a 2-minute assessment → personalized plan),
// and the bullets are the specific questions the plan answers.

// ── Authority cue (in-card line, under the bullets) ──
const AUTHORITY = {
  big: 'Backed by College Board data from 250,000+ students.',
  sub: 'Your child’s plan is benchmarked against verified score-improvement patterns — not guesswork.',
};

// ── Sample plan (the QUIZ's output, personalized as if Sophia took the diagnostic) ──
const SAMPLE_PLAN = {
  name: 'Sophia L.',
  gpa: '3.9',
  college: 'UNC Chapel Hill',
  current: 1180,
  target: 1400,
  gain: 220,
  testDate: 'Oct 4',
  testDateISO: '2026-10-04',
  achievability: { level: 'Ambitious', idx: 2, cohort: 1500 },
  perDay: '~1 hr/day',
  daysWeek: '6 days/wk',
  weeks: 15,
  skills: [
    { name: 'Linear equations & systems', sec: 'Math', gain: 54 },
    { name: 'Problem solving & data analysis', sec: 'Math', gain: 46 },
    { name: 'Standard English conventions', sec: 'R&W', gain: 36 },
    { name: 'Calculator pacing & timing', sec: 'Math', gain: 32 },
    { name: 'Command of evidence', sec: 'R&W', gain: 28 },
    { name: 'Words in context', sec: 'R&W', gain: 24 },
  ],
};

// ── How it works ──
const STEPS = [
  { n: '1', t: 'Answer a few questions',
    d: 'Last score, goal score, test date, GPA, prior study methods, and target schools. Two minutes, no test for your child right now.' },
  { n: '2', t: 'See their SAT plan + score projection',
    d: 'Score projection to their target, week-by-week timeline, and daily effort. Built around your child’s specific goal and test date.' },
  { n: '3', t: 'Free SAT Strategy Call',
    d: 'Optional · no obligation. 15 minutes with an SAT expert who scored 1425+. Confirm the goal, answer your questions, and schedule the proctored Skill Diagnostic.' },
];

// ── Verified score improvements ──
const SCORES = [
  { nm: 'Ethan',    hs: 'Alpharetta HS',   rw: [610,740], m: [560,670], tot: [1170,1410], col: 'UGA' },
  { nm: 'Liam',     hs: 'Plano West HS',   rw: [600,750], m: [560,690], tot: [1160,1440], col: 'UT Austin' },
  { nm: 'Benjamin', hs: 'Langley HS',      rw: [610,720], m: [640,770], tot: [1250,1490], col: 'UVA' },
];

const FEATURED = {
  ...SCORES[0],
  quote: '“We’d tried Khan, a tutor, two retakes — nothing moved the official score. This finally told us what was actually wrong.”',
  by: 'Karen M. · Ethan’s mom · Alpharetta, GA',
};

// ── Parent reviews ──
const REVIEWS = [
  { initials: 'KM', name: 'Karen M.', meta: 'Parent · Alpharetta, GA', stars: 5,
    quote: 'The plan pinpointed that it was timing on Reading, not the content. We finally knew what to actually work on.' },
  { initials: 'DR', name: 'David R.', meta: 'Parent · Plano, TX', stars: 5,
    quote: 'I’m skeptical of “+points” promises. This was specific and honest about what was realistic before the fall test.' },
  { initials: 'PN', name: 'Priya N.', meta: 'Parent · McLean, VA', stars: 5,
    quote: 'For the first time we understood why her score was stuck despite straight A’s. The plan was clear and we acted on it.' },
];

const PROGRAM_DISCLAIMER = 'Among families who built a plan, enrolled, and completed our 12-week program, the average gain was +182 points (n=95). Individual results vary. The plan itself is free.';

// ── The single direction (no A/B/C variants in v3) ──
const DIRECTION = {
  eyebrow: 'Free SAT plan · for parents',
  h1: [
    { line: ['Your child has good grades.'] },
    { line: ['So why ', { em: 'a low SAT score?' }] },
  ],
  subhead: '',
  visual: 'plan',
  button: 'Build my child’s free SAT plan',
  fineprint: 'Takes about 2 minutes. No student required.',
  finalH2: ['See what’s actually possible ', { em: 'before the next test.' }],
  finalP: 'Free for parents · about 2 minutes · no test for your child right now.',
};

// ── The bullets: what the plan answers ──
const VALUE = [
  'Why smart students struggle on the SAT',
  'If 150–200+ points is realistic before their next test',
  'What their SAT improvement plan looks like between now and test day',
];

Object.assign(window, { AUTHORITY, SAMPLE_PLAN, STEPS, SCORES, FEATURED, REVIEWS, PROGRAM_DISCLAIMER, DIRECTION, VALUE });
