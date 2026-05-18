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
  location: "Atlanta",
  descriptor: "ILLUMINAIRY",
  satDate: "August 22, 2026",
  tagline: "your guiding light for goals and growth",
  /** Homepage hero — Frame B parent lead + messaging hierarchy (illuminate → mentors → guided path) */
  homeHero: {
    title: "We illuminate the path — so your student can walk it.",
    lead:
      "Mentors from selective universities who scored 1450+ on the SAT, paired with your student for twelve weeks. Week-one diagnostics, six private 1:1s, live classes, assigned practice, and a progress report sent to you every week. The SAT Accelerator is live for the August 22, 2026 test; professional and business programs open next."
  },
  /** Public SAT consultation only — not the invite-only mentor interview link */
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/brianna-illuminairy/august-sat",
  typeformUrl: process.env.NEXT_PUBLIC_TYPEFORM_URL || ""
};

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

export const navItems = [
  { label: "Home", href: "/" },
  { label: "SAT Accelerator", href: "/sat-accelerator" },
  { label: "Programs", href: "/programs" },
  { label: "Mentors", href: "/mentors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

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
export const mentorApplyLink = "/contact?reason=mentor";
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
