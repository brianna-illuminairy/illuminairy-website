import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Eye,
  GraduationCap,
  Laptop,
  LineChart,
  LockKeyhole,
  Map,
  Microscope,
  Monitor,
  Network,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  UsersRound
} from "lucide-react";

export const site = {
  name: "Illuminairy",
  legalName: "Zytech Development LLC",
  url: "https://illuminairy.com",
  email: "support@illuminairy.com",
  supportEmail: "support@illuminairy.com",
  location: "Evans, Georgia",
  descriptor: "ILLUMINAIRY",
  satDate: "August 22, 2026",
  tagline: "modern mentorship and applied learning",
  /** Homepage hero — platform / founder narrative */
  homeHero: {
    title: "Learn AI by achieving real outcomes.",
    lead:
      "Illuminairy matches ambitious professionals and business owners with near-peer mentors who have already achieved the same goal using AI — then guides you there with a personalized plan, accountability, and a high bar."
  },
  /** Public SAT consultation only — not the invite-only mentor interview link */
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/brianna-illuminairy/august-sat",
  typeformUrl: process.env.NEXT_PUBLIC_TYPEFORM_URL || "",
  /** Mentor / SAT instructor application — public embed on /apply/mentor */
  mentorTypeformUrl: process.env.NEXT_PUBLIC_MENTOR_TYPEFORM_URL || "",
  /** Platform waitlist — dedicated Klaviyo list when set */
  platformWaitlistListId:
    process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID_PLATFORM_WAITLIST || ""
};

/**
 * Homepage copy — distilled from docs/brand-source/ (locked 2026-05-19).
 * Customer voice lines from docs/research/customer-listening-kit.md + listening runs.
 */
export const homePlatform = {
  hero: {
    eyebrow: "Hi, I'm Brianna Zajicek",
    /** Static fallback for SEO / no-JS — animated rotator uses lib/hero-search-outcomes.ts */
    title: "How to use AI to grow my business",
    lead:
      "Businesses and professionals who can't turn AI into actual outcomes will get left behind by the ones who can. AI enablement is no longer optional — Illuminairy provides the plan and the guide to implement AI.",
    sublead:
      "Search traffic for “how do I use AI to [outcome] in my career or business” has exploded. So have searches for “AI coach.” Demand for both is surging — but nobody connects the outcome to the guide.",
    founderName: "Brianna Zajicek"
  },
  credentials:
    "Former Sr. Director of Revenue, Nerdy · 6 years AI/ML at Amazon · MSCS Georgia Tech · MBA Duke · AI Fund venture studio",
  /** Replaced on homepage by painVoice marquee — kept for docs/specs */
  /** v4 locked — docs/brand-source/01_problem_statement.md */
  problem: {
    eyebrow: "The problem",
    stakes:
      "Businesses and professionals who can't turn AI into actual outcomes will get left behind by the ones who can. AI enablement is no longer optional. Illuminairy provides the plan and the guide to implement AI.",
    gap:
      "There is no fast path from “I know I should be using AI for my career and business” to “I achieved my outcome with AI.”",
    demand:
      "Search traffic for “how do I use AI to [outcome] in my career or business” has exploded. So have searches for “AI coach.” Demand for both the outcome and the guide is surging — but there's nobody that connects the two.",
    alternatives: [
      {
        title: "Courses",
        text: "Generic and static — go stale before you finish."
      },
      {
        title: "Freelancer marketplaces",
        text: "Output without context — so you can never do it yourself."
      },
      {
        title: "Gurus",
        text: "Hype and generic trainings that aren't relevant to your use case."
      }
    ],
    stall:
      "So most ambitious professionals and business owners stall. They're using AI, but to do what? To produce more documents faster and AI-generated single-use content? That's not what they want. They want to generate leads, improve their sales conversion, automate their receptionist. They don't know the precise steps to take for their specific use case, nor do they have the support of anyone who's actually done it. So they're left with AI goals they can't execute, and every month they fall further behind someone who figured it out.",
    connect:
      "Illuminairy connects the outcome and the guide — a near-peer who's already done it in your lane, plus a living playbook, not another static course."
  },
  painVoice: {
    eyebrow: "Customer voice",
    title: "They are not asking for another AI course.",
    lead:
      "We scraped 6,567 posts — and the data says the same thing as the problem statement: people aren't asking for another course. They're stuck between “using AI” and getting results from it.",
    methodNote:
      "Verbatim quotes · pain map ranked by frequency · sources linked",
    rankTitle: "Pain map",
    rankSubtitle: "Ranked by how often each line showed up across 6,567 scraped posts",
    beforeLabel: "Before",
    beforeSub: "Real frustrated humans · verbatim from the research",
    afterLabel: "After",
    afterSub: "Clear, specific · what Illuminairy is for",
    bridge:
      "Demand for outcomes and guides is surging — Illuminairy connects both: your outcome × your vertical, with a near-peer who's already done it."
  },
  /** v3 locked — docs/brand-source/00_beliefs.md */
  beliefs: {
    eyebrow: "What we believe",
    title: "Five lines we do not compromise on.",
    intro:
      "Knowledge is everywhere now, but the plan for applying it is missing. The person most able to give you that plan, hold you accountable, and get you to a result is not the world-class expert who has never lived your context — it's the person who has already applied the skill to your exact use case. AI changes quickly, so you need a plan that does too, so you can focus on execution, not the latest thing on Twitter. And a plan is only as good as the accountability system that drives you to complete it and helps you get unstuck.",
    items: [
      { title: "Learn by doing, not by watching." },
      { title: "A step-by-step plan so you always know what's next." },
      { title: "Guided by someone who's actually done it." },
      { title: "Content that updates itself." },
      { title: "Not done until you've hit your goal." }
    ]
  },
  founderStory: {
    eyebrow: "Why me, why now",
    title: "I had unusual preparation. Most people don't — and the alternatives don't bridge it.",
    paragraphs: [
      "At Varsity Tutors I watched students matched to credentialed experts who were wrong for the actual test — when what they needed was someone one rung ahead who had just scored the 5. Toward the end of my time at Nerdy, the calls shifted: dentists who needed AI lead-gen, marketers whose CEOs wanted an AI plan. No path to pair them with someone who had already shipped that outcome in their lane.",
      "I would know. At Nerdy, I built a closed-loop system that turned call transcripts into AI-generated marketing assets into ML-optimized outcomes. I built an AI sales chatbot that outperformed our average paid salesperson. I produced 50K lines of code per day via AI workflows — 12.8× the average staff engineer. We achieved our first two profitable quarters in over a year — something my predecessors couldn't do without AI. They got left behind; I led the future. AI enablement is no longer optional — and most people don't have my preparation. Illuminairy exists to bridge that asymmetry with near-peer mentors, live plans, and accountability."
    ]
  },
  examples: [
    {
      title: "AI lead-gen for a dental practice",
      text: "A dentist who wants patient acquisition with AI works with someone who already automated lead-gen for practices like theirs — not a generic AI course or a marketplace search."
    },
    {
      title: "AI in your day job",
      text: "A marketing director whose CEO wants an AI plan gets a near-peer who shipped the same deliverable last quarter — live 1:1, in context, until it ships."
    }
  ],
  customerVoice: {
    eyebrow: "What we hear",
    title: "The market is trying to solve this — and stalling.",
    quotes: [
      {
        text: "I started and stopped so many projects because I hit complexity that needed help. Mentors and freelancers were useful — but the costs add up.",
        source: "Hacker News discussion on AI-assisted projects"
      },
      {
        text: "Most system design resources are too theoretical. People want a flight simulator — practice real trade-offs, with feedback that is insightful, not generic.",
        source: "Hacker News, applied learning thread"
      }
    ]
  },
  solution: {
    eyebrow: "What Illuminairy does",
    title: "Near-peer mentors who have already achieved your outcome.",
    text:
      "We connect surging demand for outcomes and guides. Illuminairy matches you with a near-peer mentor who already achieved your result using AI — then keeps you on a living playbook for your use case, with live 1:1s and progress you can see."
  },
  brandEquation: {
    eyebrow: "The formula",
    title: "You + Illuminairy + Illuminate = goal achieved",
    subtitle:
      "We took the abstract parts of learning with AI and made them visible — who walks with you, what path you follow, and what “done” looks like in your work.",
    parts: [
      {
        id: "you",
        symbol: "You",
        role: "Your ambition",
        definition:
          "The outcome you want — grow the business, ship at work, automate the workflow. Not “learn AI theory.” A real result in your lane."
      },
      {
        id: "luminairy",
        symbol: "LuminAIry",
        role: "Your guide",
        definition:
          "Your near-peer mentor (luminary): someone slightly ahead who already achieved that outcome with AI — and meets you live, 1:1, in your context."
      },
      {
        id: "illuminate",
        symbol: "ILLUMINATE",
        role: "Your playbook",
        definition:
          "To illuminate is to make the path clear — milestones, session plan, and progress you can see. Not a static course; a living playbook that updates as you ship."
      }
    ],
    result: {
      symbol: "Goal achieved",
      role: "Outcome shipped",
      definition:
        "The gap closes: from “I know AI exists” to “I used it for my restaurant / practice / role.” That is the win the slot machine lands on."
    },
    footnote:
      "Illuminairy = illuminate + luminary + AI at the center. Human mentorship, amplified by AI — matching, planning, and accountability until the result ships."
  },
  /** @deprecated — use brandEquation; kept for docs references */
  nameMeaning: {
    eyebrow: "The name",
    title: "Why Illuminairy?",
    pillars: [
      {
        term: "Illuminate",
        definition:
          "To bring light, clarity, and understanding — to make a hard subject understandable."
      },
      {
        term: "Luminary",
        definition:
          "A mentor or guide who inspires others through real achievement in a field."
      },
      {
        term: "AI",
        definition:
          "At the center of the wordmark — the technology reshaping how people learn, work, and build."
      }
    ],
    thesis:
      "The future of learning is not artificial intelligence alone — it is human mentorship amplified by AI. Illuminairy strengthens those relationships: matching, planning, tracking progress, and updating your path as you grow — including bringing in other mentors when your goal calls for it."
  },
  differentiators: [
    {
      title: "Intelligent matching",
      text: "Our platform matches you with a near-peer mentor for your specific goal — not a directory you have to search and vet yourself."
    },
    {
      title: "Personalized learning plans",
      text: "Milestones and a plan your mentor is qualified and committed to deliver — not a static syllabus that ages out."
    },
    {
      title: "Session tracking and accountability",
      text: "Each mentorship session is tracked for progress so you and your mentor stay aligned on a high bar."
    },
    {
      title: "Paths that evolve",
      text: "Your learning path updates over time — including new mentors when your goal requires a different expert."
    }
  ],
  howItWorks: {
    eyebrow: "How it works",
    title: "The oldest way people learn — now AI-powered.",
    steps: [
      {
        title: "Tell us your outcome",
        text: "Share the career or business result you want — not just a topic to study."
      },
      {
        title: "Get matched",
        text: "Illuminairy pairs you with a near-peer mentor who has already achieved that outcome using AI."
      },
      {
        title: "Follow your plan",
        text: "Work through milestones built for your goal, with 1:1 sessions and timely feedback."
      },
      {
        title: "Stay on track",
        text: "Progress is tracked session by session; your path updates as you advance."
      }
    ]
  },
  mentorshipProof: {
    eyebrow: "Why mentorship works",
    title: "One-to-one guidance changes what is possible.",
    text:
      "From Aristotle and Plato to today, bonded mentorship over time drives outcomes. Benjamin Bloom's landmark study found that one-to-one instruction can raise achievement by roughly two standard deviations compared with conventional classroom instruction — the \"two sigma\" result (Educational Researcher, 1984). You learn better when someone close to your experience gives timely feedback, holds you accountable, and makes it safe to ask real questions.",
    tagline: "Human mentorship, amplified by AI."
  },
  vision: {
    title: "A platform for ambitious people learning how to use AI to achieve their goals.",
    text: "Illuminairy is building the trusted place where professionals and business owners turn AI from pressure into progress — with mentors, plans, and accountability that match the stakes."
  },
  /** Brand-board homepage — single-page platform site */
  brandBoard: {
    identityNote:
      "Modern mentorship and applied learning for ambitious students, professionals, and business owners.",
    voiceLines: ["learn.", "build.", "ship."] as const,
    voiceCopy:
      "Premium mentor-led programs with a high signal-to-noise ratio. Calm, sharp, and direct.",
    programNote:
      "Georgia Tech-led SAT preparation for the August 22, 2026 SAT. No guaranteed scores — structure and accountability.",
    positioningTitle: "mentor-led /\napplied learning",
    contactTitle: "Start with SAT.\nExpand into AI.",
    contactCopy:
      "Ask about the SAT program, mentor applications, partnerships, or the broader Illuminairy platform."
  },
  waitlist: {
    headline: "Join the waitlist",
    subcopy:
      "AI for Professionals and AI for Business Owners are opening next. Be first to know when sessions are available.",
    successMessage:
      "You're on the list — we'll email when AI programs open.",
    interestLabel: "I'm interested in",
    slotTitle: "Spin your match, then lock your spot",
    slotSubcopy:
      "Pick your industry, land on the outcome you want, and join the waitlist — we will match you when sessions open.",
    slotCta: "Lock my spot"
  }
} as const;

/** SAT Accelerator structure — use parent-friendly language, not “cohort.” */
export const satProgram = {
  weeks: 12,
  classesPerWeek: 2,
  classLabels: ["Reading & Writing", "Math"] as const,
  privateSessions: 6,
  maxPerClass: 10,
  headline:
    "A twelve-week plan — not self-study, not random à la carte sessions.",
  tracking:
    "Week-one diagnostics tell your mentor exactly what to focus on in six private 1:1s. Live classes cover the material. Assigned practice makes sure it sticks. You get a report every week.",
  structureLine:
    "Diagnostics in week one, then weekly Reading & Writing and Math classes, six personalized 1:1s, and assigned practice between every session.",
  /** Tuition in cents — site/Stripe canonical price. Brand doc says $1,500; live site uses $1,200. */
  tuitionCents: 120_000,
  tuitionDisplay: "$1,200",
  /** First week begins Wed May 27, 2026; exam day Sat Aug 22, 2026 — see lib/sat-program-schedule.ts */
  programStartLabel: "May 27, 2026",
  examDayLabel: "August 22, 2026"
};

/**
 * Published program outcome stats for funnel trust surfaces (INT1, INT6).
 * Methodology: internal completer data — always pair with vary disclaimers in UI.
 */
export const satProgramOutcomes = {
  cohortShortLabel: "'24–'25",
  footnoteLabel: "ILLUMINAIRY OUTCOMES · 2024–25 PROGRAM DATA",
  plansBuiltCount: 95,
  avgPointsGained: 182,
  programWeeks: satProgram.weeks,
  targetHitRatePct: 78,
  targetHitBefore: "of students who complete their plan ",
  targetHitEmphasis: "hit their target score",
  targetHitAfter: " on the next test.",
  varyDisclaimer: "Results vary."
} as const;

/**
 * College Board retake research — INT3, parent reports, landing cred.
 * Source: College Board analysis of 250,000+ retakers (verify before changing).
 */
export const satRetakeResearch = {
  cohortSizeLabel: "250,000+",
  avgPointsWithoutNewApproach: 40,
  retakersScoreLowerPct: 35,
  chartTitle: "College Board retaker data",
  samePrepRetakeLabel: "Same prep, retake"
} as const;

/**
 * INT8 / INT4 — three-way prep comparison (Noom-style bars).
 * Self-study anchor: College Board retake band (same as satRetakeResearch).
 * Group-class bar: illustrative plateau band for visualization only (not a cited CB stat).
 * Guided anchor: satProgramOutcomes.avgPointsGained (program completers).
 * Bloom 2-sigma: separate footnote — 1:1 vs classroom instruction, not the point-ratio source.
 */
export const satPrepComparison = {
  selfStudyLabel: "On their own",
  groupClassLabel: "Group class / course",
  guidedLabel: "Guided 1:1 tutoring",
  selfStudyAvgPoints: satRetakeResearch.avgPointsWithoutNewApproach,
  /** Illustrative mid-band for survey-style classes — funnel visual only; pair with Bloom footnote. */
  groupClassIllustrativePoints: 70,
  guidedAvgPoints: satProgramOutcomes.avgPointsGained,
  selfStudySourceLabel: "College Board · 250,000+ retakers",
  groupClassSourceLabel: "Typical plateau without gap-level 1:1",
  guidedSourceLabel: satProgramOutcomes.footnoteLabel,
  varyDisclaimer: satProgramOutcomes.varyDisclaimer,
  bloomFootnote:
    "A group class covers the same lesson for everyone. A tutor works through the questions that student missed.",
  /** INT8 chart card header — Bloom citation, not point stats. */
  bloomChartTitle: "Bloom's two-sigma study"
} as const;

/** Point gap: guided avg minus solo / group illustrative bars (INT8 headline + caption). */
export function guidedGapOverSelfStudyPoints(): number {
  return (
    satPrepComparison.guidedAvgPoints - satPrepComparison.selfStudyAvgPoints
  );
}

export function guidedGapOverGroupClassPoints(): number {
  return (
    satPrepComparison.guidedAvgPoints -
    satPrepComparison.groupClassIllustrativePoints
  );
}

/** 182 ÷ 40 → one decimal for headline (4.6×). */
export function guidedVsSelfStudyMultiplier(): number {
  return (
    Math.round(
      (satPrepComparison.guidedAvgPoints / satPrepComparison.selfStudyAvgPoints) *
        10
    ) / 10
  );
}

/** 182 ÷ 70 → one decimal for 1:1 vs illustrative group-class bar. */
export function guidedVsGroupClassMultiplier(): number {
  return (
    Math.round(
      (satPrepComparison.guidedAvgPoints /
        satPrepComparison.groupClassIllustrativePoints) *
        10
    ) / 10
  );
}

/**
 * Live and upcoming programs — home page hero card.
 */
export const cohorts = [
  {
    status: "live",
    statusLabel: "Live now",
    name: "SAT Accelerator",
    when: "August 2026 SAT",
    audience: "Ambitious high schoolers",
    href: "/sat-accelerator"
  },
  {
    status: "soon",
    statusLabel: "Opening soon",
    name: "AI for Professionals",
    when: "Q3 2026",
    audience: "Working professionals",
    href: "/programs"
  },
  {
    status: "soon",
    statusLabel: "Opening soon",
    name: "AI for Business Owners",
    when: "Q3 2026",
    audience: "Founders & operators",
    href: "/programs"
  }
] as const;

/** YC site cut — no multi-page nav */
export const navItems: { label: string; href: string }[] = [];

export const policyItems = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Support Policy", href: "/support-policy" }
];

export const mailtoLink =
  "mailto:support@illuminairy.com?subject=Illuminairy%20program%20inquiry";

export const bookLink = site.calendlyUrl || mailtoLink;
export const scheduleLink = "/contact#schedule";
export const mentorApplyLink =
  "mailto:support@illuminairy.com?subject=Illuminairy%20mentor%20application";
export const mentorApplyFallbackLink = mentorApplyLink;
export const inquiryLink = site.typeformUrl || mentorApplyLink;

export const programStats = [
  { value: "12", label: "Weeks of live instruction" },
  { value: "2", label: "Live classes each week (R&W + Math)" },
  { value: "6", label: "Private 1:1 sessions" },
  { value: "1450+", label: "SAT mentor score standard" }
];

/** Core positioning — mentors + instructors, better model, 1:1 + diagnostics + practice. */
export const mentorshipMessaging = {
  thesis:
    "Georgia Tech mentors who scored 1450+ on the SAT run your student's 1:1s. Instructors teach live R&W and Math classes. Week-one diagnostics show the mentor where your student is struggling, and every 1:1 after that targets those specific weak spots. Practice is assigned between every session so your student works the same problem types until they stop getting them wrong.",
  researchNote:
    "Research backs personalized 1:1 instruction — including Benjamin Bloom's two-sigma finding on individualized teaching (Educational Researcher, 1984) and studies on mentor-led programs — when it follows a clear plan, not random sessions."
};

/** The Accelerator loop — diagnostics → 1:1 → classes → practice. */
export const acceleratorModel = {
  eyebrow: "How it works",
  title: "Your student's diagnostic results tell the mentor what to teach.",
  intro:
    "Self-study means guessing what to work on. Random tutoring sessions start from scratch every time. Illuminairy runs one twelve-week program — diagnostics first, then weekly classes, 1:1s, and assigned practice — so the mentor always knows exactly where your student is.",
  steps: [
    {
      title: "Week-one diagnostics",
      text: "R&W and Math tests in week one show which question types your student gets wrong and why — that's what every 1:1 after that focuses on."
    },
    {
      title: "Six personalized 1:1s",
      text: "Your mentor reviews last week's errors and class performance before every session, then works on the specific question types your student keeps missing."
    },
    {
      title: "Live classes every week",
      text: "R&W and Math each week in groups of ten or fewer. Instructors explain concepts, work through example problems, and call on students — no one sits silently."
    },
    {
      title: "Practice that reinforces",
      text: "Problem sets assigned between every session, plus a full-length timed practice test every three weeks. Your student works the same types of problems until they stop getting them wrong."
    }
  ] as const
};

/** How Illuminairy differs from typical SAT prep — used on Home and SAT pages. */
export const programDifferentiation = {
  eyebrow: "The difference",
  title: "Better mentors and instructors. A better program.",
  intro:
    "Illuminairy is not a tutoring center and not a tutor marketplace. It is one twelve-week program: your student gets a named mentor, week-one diagnostics, six private 1:1s based on those results, two live classes per week, and assigned practice with a report sent to you every week.",
  rows: [
    {
      aspect: "Who teaches",
      typical: "Whoever is free that week — varied quality, little continuity",
      illuminairy:
        "Vetted Georgia Tech mentors and instructors (1450+ SAT) — recently succeeded on the same test your student is taking"
    },
    {
      aspect: "The program",
      typical: "Self-study books, or à la carte sessions with no real plan",
      illuminairy:
        "One twelve-week program with a set schedule: diagnostics, then personalized 1:1s, live classes, and practice every week"
    },
    {
      aspect: "1:1 attention",
      typical: "Optional add-on, often skipped — or one-size-fits-all review",
      illuminairy:
        "Six private 1:1s included — your mentor uses diagnostic results to decide what to work on, not a generic checklist"
    },
    {
      aspect: "Practice",
      typical: "Figure it out on your own between sessions",
      illuminairy:
        "Problem sets assigned every week, plus timed full-length tests — your student works the same question types until they stop missing them"
    },
    {
      aspect: "Pacing",
      typical:
        "Pacing is assumed — if you know the content, you'll finish in time",
      illuminairy:
        "Pacing is a skill we teach — timed module work, trap-answer discipline, and full-length tests every three weeks so test day isn't the first time it's real"
    },
    {
      aspect: "Guarantees",
      typical:
        "Score guarantee with pages of fine print — miss one assignment and it's void",
      illuminairy:
        "No score guarantee. You get a named mentor, the program as described, a progress report every week, and a real conversation about fit before you enroll"
    },
    {
      aspect: "Level matching",
      typical:
        "One class for every student — 1100 and 1400 in the same room",
      illuminairy:
        "Classes matched to your student's starting level and goal, with R&W and Math sessions shaped by their diagnostic profile"
    }
  ] as const
};

export const satFeatures = [
  {
    icon: GraduationCap,
    title: "Mentors & instructors",
    text: "Georgia Tech students and alumni who scored 1450+ on the SAT. They took the same test recently, they know the format, and they were screened for how they explain things — not just their score."
  },
  {
    icon: CalendarCheck,
    title: "A plan that beats self-study",
    text: "Twelve weeks with the same schedule every week — not a book on the shelf or sessions booked whenever you remember."
  },
  {
    icon: Target,
    title: "Diagnostics first",
    text: "R&W and Math tests in week one show which question types your student gets wrong. Every 1:1 after that works on those specific problems."
  },
  {
    icon: UserCheck,
    title: "Six private 1:1s",
    text: "Six private sessions with a mentor who reviews your student's errors before every meeting and adjusts what they work on each time."
  },
  {
    icon: UsersRound,
    title: "Live classes + practice",
    text: "R&W and Math classes every week in groups of ten or fewer, plus assigned practice between sessions. Your student works the same problem types until they stop missing them."
  },
  {
    icon: LockKeyhole,
    title: "Weekly accountability",
    text: "Progress reports every week — what was covered, what's due, and whether assigned practice was completed."
  }
];

export const platformAreas = [
  {
    icon: GraduationCap,
    title: "Illuminairy SAT",
    status: "Live now",
    text: "Twelve weeks: R&W and Math classes every week, Georgia Tech mentors who scored 1450+, six private 1:1s, and a report sent to parents every week."
  },
  {
    icon: BrainCircuit,
    title: "Illuminairy AI",
    status: "Planned",
    text: "Hands-on AI courses for students, professionals, and business owners — focused on using the tools, not just understanding the theory."
  },
  {
    icon: Network,
    title: "Illuminairy Mentors",
    status: "Planned",
    text: "Screened mentors and instructors from selective universities — available for 1:1 sessions, live classes, and program-specific teaching."
  },
  {
    icon: BriefcaseBusiness,
    title: "Illuminairy Professional",
    status: "Planned",
    text: "Coaching and education programs for working professionals and business owners — details and pricing published when programs open."
  },
  {
    icon: LineChart,
    title: "Illuminairy Labs",
    status: "Planned",
    text: "New programs and formats we're testing — specifics shared when they're ready."
  }
];

export const mentorStandards = [
  "Currently enrolled at or graduated from a selective university",
  "Verified 1450+ SAT score (for SAT mentors)",
  "Screened in a live interview for how they explain concepts",
  "Responsive to scheduling and shows up prepared",
  "Can teach groups of ten and run private 1:1s"
];

export const trustPillars = [
  {
    icon: GraduationCap,
    title: "Mentors & instructors",
    text: "Georgia Tech students and alumni who scored 1450+ on the SAT. They took the same test recently and were screened for how they explain things, not just their score."
  },
  {
    icon: CalendarCheck,
    title: "Twelve-week plan",
    text: "One twelve-week program with the same schedule every week — diagnostics, 1:1s, classes, and practice all decided before you start."
  },
  {
    icon: UserCheck,
    title: "1:1 + diagnostics",
    text: "Week-one test results tell the mentor which question types to focus on in six private sessions."
  },
  {
    icon: Target,
    title: "Practice that reinforces",
    text: "Problem sets assigned between every class, plus timed full-length tests. Your student works the same problem types until they stop getting them wrong."
  }
];

export const contactReasons = [
  "Parent/student inquiry",
  "Mentor application",
  "Partnership",
  "Billing/support",
  "General inquiry"
] as const;

const contactReasonAliases: Record<string, (typeof contactReasons)[number]> = {
  mentor: "Mentor application",
  parent: "Parent/student inquiry",
  billing: "Billing/support",
  partnership: "Partnership",
  general: "General inquiry"
};

export function resolveContactReason(
  param?: string
): (typeof contactReasons)[number] {
  if (!param) {
    return contactReasons[0];
  }
  const decoded = decodeURIComponent(param).trim();
  if (contactReasonAliases[decoded]) {
    return contactReasonAliases[decoded];
  }
  if (contactReasons.includes(decoded as (typeof contactReasons)[number])) {
    return decoded as (typeof contactReasons)[number];
  }
  return contactReasons[0];
}

/** Parent trust beliefs — brand-voice § "What parents must believe" */
export const parentTrustBeliefs = {
  eyebrow: "What matters to families",
  title: "What parents need to see before they enroll.",
  beliefs: [
    {
      icon: TrendingUp,
      title: "Good outcomes",
      text: "You see what your student worked on, which scores went up, and what's next — every single week. We don't promise a number; we show you the work."
    },
    {
      icon: Laptop,
      title: "Better than in-person for a reason",
      text: "Groups of ten or fewer on a live video call, practicing on the same digital interface used on test day. The instructor sees who participates and reports it to you — no anonymous lecture halls or paper worksheets."
    },
    {
      icon: ClipboardCheck,
      title: "Accountability",
      text: "Every student answers questions out loud, explains their reasoning, and works through problems during class — cameras on, no hiding in the back row."
    },
    {
      icon: Eye,
      title: "Never in the dark",
      text: "Every week you get a report: what was covered, what practice was assigned, and whether it was completed — not 'session went fine.'"
    },
    {
      icon: BadgeCheck,
      title: "A credible approach",
      text: "Mentors who scored 1450+ and were screened for teaching ability, a program based on Benjamin Bloom's research on 1:1 instruction, and real student outcomes published after programs finish."
    }
  ]
};

/** In-person comparison — brand-voice § "Why we win vs in-person" */
export const inPersonComparison = {
  eyebrow: "Why families choose illuminairy",
  title: "What in-person tutoring misses.",
  columns: [
    {
      label: "Big group class",
      problems: [
        "Your child is a number — teaching is generic",
        "Easy to zone out, put their head down — no one intervenes",
        "Worksheets and volume, not depth on weak areas",
        "No 1:1 when stuck — more content, same gaps"
      ]
    },
    {
      label: "1:1 in-person tutor",
      problems: [
        "Can still be passive — 'session went fine' with no proof",
        "Often paper-first — wrong format for the digital SAT",
        "Quality varies wildly — you're the hiring manager",
        "No program behind it — just isolated sessions"
      ]
    }
  ],
  illuminairyAnswer: {
    label: "Illuminairy",
    points: [
      "Small live groups (cap 10) — participation required, not optional",
      "Students work problems aloud, explain logic, help peers reach answers",
      "Engagement tracked and reported to parents weekly",
      "Diagnostics + class work feed into 1:1s — the mentor starts each session from real data",
      "Digital-interface practice: timing, on-screen tools, Desmos fluency"
    ]
  }
};

/** Commitments — brand-voice § Proof & promises */
export const commitments = [
  "You get a progress report every week — what your student worked on, where they're improving, and what's next.",
  "Every mentor scored 1450+ on the SAT, attends or graduated from a selective university, and was screened for how they teach — not just what they scored.",
  "The program runs exactly as described: 12 weeks, 2 live classes per week, 6 private 1:1s, diagnostics in week one, practice assigned between every session.",
  "Every student speaks, solves problems out loud, and explains their reasoning multiple times per session — no one hides in the back row.",
  "We don't guarantee a score. We give you the plan, the mentors, and the weekly proof that the work is happening."
];

/** No-guarantee section — sat-messaging Pillar B (no competitor names on public site) */
export const noGuarantee = {
  eyebrow: "Our commitment",
  title: "Why we don't guarantee a score.",
  summary:
    "Most SAT companies offer score guarantees with fine print that voids them if you miss a single assignment or deadline. That's not a guarantee — it's a loophole. We skip the marketing number and commit to the things we actually control.",
  commitments: [
    "The program runs exactly as described: twelve weeks, two live classes per week, six private 1:1s, diagnostics in week one, and assigned practice every week.",
    "Your student's mentor scored 1450+ on the SAT, comes from a selective university, and was chosen because they can teach — not just because they tested well.",
    "You get a progress report every week showing what was covered, what's due next, and whether the assigned practice was completed.",
    "Before you enroll, we talk about whether this program is actually the right fit. If it's not, we'll say so — we'd rather lose the enrollment than take one we can't deliver on.",
    "The refund policy is linked on every program page. It's short and straightforward — not 18 pages of conditions."
  ],
  closing:
    "Once programs finish, we'll publish real outcomes. Until then, we stand behind how we run it, who teaches, and what we show you every week."
};

/** SAT pillars — condensed from sat-messaging § Pillars A–I (excl. G, deferred) */
export const satPillars = {
  eyebrow: "What sets us apart",
  title: "Built around the mistakes that matter.",
  intro:
    "The SAT Accelerator finds the specific question types your student gets wrong, figures out why, and works on them until test day.",
  cards: [
    {
      icon: Microscope,
      title: "Mistake-driven study",
      text: "When your student gets a question wrong, the mentor logs the error type, the section, and whether time was a factor. That data decides what the next 1:1 and practice set focus on."
    },
    {
      icon: UserCheck,
      title: "1:1s adjust every week",
      text: "Six private sessions. Before each one, the mentor reviews what your student got wrong that week and changes the focus accordingly — not the same generic review every time."
    },
    {
      icon: Map,
      title: "One plan, not fifty links",
      text: "One twelve-week schedule: same classes, same days, same mentor. Practice is assigned after every session — not suggested, not optional."
    },
    {
      icon: Clock,
      title: "Pacing is a skill",
      text: "Most students who underperform on test day knew the content — they ran out of time. We teach pacing explicitly with timed module work and full-length tests."
    },
    {
      icon: Monitor,
      title: "Digital SAT done right",
      text: "Practice on the same digital interface used on test day, with official College Board materials. When your student gets something wrong, a mentor explains why — something the official tools don't do."
    },
    {
      icon: ShieldCheck,
      title: "Not a marketplace",
      text: "You know your mentor's name before you start. Pricing is on the website. The refund policy is short and linked on every program page. If it's not the right fit, we'll tell you before you enroll."
    }
  ]
};

/** Consultation booking copy — sat-messaging § Consultation intro paragraph */
export const consultationCopy = {
  eyebrow: "Book a consultation",
  title: "Start with a conversation — no pressure.",
  text: "This is a free, no-pressure conversation. We'll talk about where your student is starting, what score they're aiming for, and whether the twelve-week SAT Accelerator is the right fit. If it's not — maybe they need something different, or maybe self-study is genuinely enough — we'll tell you honestly."
};

/** SAT page hero — copy bank variant #1 */
export const satHero = {
  title: "Better mentors. A clear plan. No empty promises.",
  lead: "Twelve weeks with Georgia Tech mentors who scored 1450+. Week-one diagnostics, six private 1:1s, live R&W and Math classes, assigned practice, and a progress report sent to you every week — for the August 22, 2026 SAT."
};

/** Digital SAT callout — brand-voice § parent education */
export const digitalSat = {
  eyebrow: "The test changed",
  title: "The SAT is digital. Your student's practice should be too.",
  metaphor:
    "You wouldn't practice soccer on a baseball field. Don't prepare for a digital test with paper worksheets.",
  points: [
    "Most students who underperform knew the material — they ran out of time. The test rewards knowing when to skip a hard question and come back.",
    "Built-in formulas, on-screen references, and the Desmos calculator are tools your student needs to master — for speed and accuracy.",
    "Your student should practice on a screen that looks like the real test — not a workbook."
  ]
};

export const Arrow = ArrowRight;
