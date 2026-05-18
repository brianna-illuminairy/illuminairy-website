import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  GraduationCap,
  LineChart,
  LockKeyhole,
  Network,
  Target,
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
  /** Homepage hero — align with docs/brand-voice-and-positioning.md (illuminate + guide) */
  homeHero: {
    title: "We illuminate the path to your goals.",
    lead:
      "Near-peer mentors who've already achieved what you're aiming for—guided, research-informed, and clear at every step. The SAT Accelerator is live for the August 22, 2026 test; professional and business programs open next."
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
    "Week-one diagnostics personalize six private 1:1s. Live classes teach. Practice reinforces. Weekly reports keep families in the loop.",
  structureLine:
    "Diagnostics in week one, then weekly Reading & Writing and Math classes, six personalized 1:1s, and assigned practice between every session.",
  /** Tuition in cents — single source of truth for display on /enroll. */
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
    "Better mentors and instructors beat self-study and à la carte sessions. Georgia Tech mentors and instructors who recently scored 1450+ lead a twelve-week plan where week-one diagnostics shape six private 1:1s, live classes teach the material, and practice reinforces it through repetition.",
  researchNote:
    "Research backs personalized 1:1 instruction — including Benjamin Bloom's two-sigma finding on individualized teaching (Educational Researcher, 1984) and studies on mentor-led programs — when it is structured, not random."
};

/** The Accelerator loop — diagnostics → 1:1 → classes → practice. */
export const acceleratorModel = {
  eyebrow: "How it works",
  title: "Diagnostics personalize the 1:1s. Practice makes it stick.",
  intro:
    "Self-study leaves gaps. Random à la carte sessions never build momentum. Illuminairy runs one twelve-week program with a set schedule from day one — diagnostics, then weekly classes, 1:1s, and practice — so every session has a purpose.",
  steps: [
    {
      title: "Week-one diagnostics",
      text: "Reading & Writing and Math baselines show exactly where your student stands — the foundation for every 1:1 after that."
    },
    {
      title: "Six personalized 1:1s",
      text: "Private sessions driven by diagnostic data and weekly progress — not generic review. This is the heart of the program."
    },
    {
      title: "Live classes every week",
      text: "Small-group R&W and Math classes from instructors who teach clearly — capped at ten students per class."
    },
    {
      title: "Practice that reinforces",
      text: "Assigned problem sets between sessions (and full-length timed tests every three weeks) so skills repeat until they hold."
    }
  ] as const
};

/** How Illuminairy differs from typical SAT prep — used on Home and SAT pages. */
export const programDifferentiation = {
  eyebrow: "The difference",
  title: "Better mentors and instructors. A better program.",
  intro:
    "Illuminairy is not a prep center and not a marketplace. It is a twelve-week program with vetted mentors and instructors, mandatory 1:1 time, diagnostics that personalize coaching, and practice built into every week.",
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
        "Six private 1:1s included and shaped by week-one diagnostics — the non-negotiable center of the program"
    },
    {
      aspect: "Practice",
      typical: "Figure it out on your own between sessions",
      illuminairy:
        "Assigned sets every week (plus timed full-length tests) to reinforce what was taught through repetition"
    }
  ] as const
};

export const satFeatures = [
  {
    icon: GraduationCap,
    title: "Mentors & instructors",
    text: "Georgia Tech mentors and instructors who recently scored 1450+ — close enough to relate, far enough to lead. Vetted to teach clearly, not just test well."
  },
  {
    icon: CalendarCheck,
    title: "A plan that beats self-study",
    text: "Twelve weeks with a fixed rhythm — not a book on the shelf or sessions booked whenever you remember."
  },
  {
    icon: Target,
    title: "Diagnostics first",
    text: "Week-one R&W and Math baselines so six private 1:1s target your student's actual gaps — not a generic syllabus."
  },
  {
    icon: UserCheck,
    title: "1:1 is the engine",
    text: "Six personalized private sessions across the program — the part research and families both count on most."
  },
  {
    icon: UsersRound,
    title: "Live classes + practice",
    text: "Weekly small-group R&W and Math, plus assigned practice between sessions so concepts repeat until they stick."
  },
  {
    icon: LockKeyhole,
    title: "Weekly accountability",
    text: "Progress reports every week — what was covered, what's due, and where practice scores are heading."
  }
];

export const platformAreas = [
  {
    icon: GraduationCap,
    title: "Illuminairy SAT",
    status: "Live now",
    text: "Twelve-week SAT preparation with weekly R&W and Math classes, Georgia Tech-led mentors, and a clear schedule families can follow."
  },
  {
    icon: BrainCircuit,
    title: "Illuminairy AI",
    status: "Planned",
    text: "Future practical AI upskilling for students, professionals, and business owners who need applied fluency."
  },
  {
    icon: Network,
    title: "Illuminairy Mentors",
    status: "Planned",
    text: "A selective network of high-performing educated talent for mentorship, instruction, and applied expertise."
  },
  {
    icon: BriefcaseBusiness,
    title: "Illuminairy Professional",
    status: "Planned",
    text: "Future professional coaching and business education programs built around clear outcomes and expert guidance."
  },
  {
    icon: LineChart,
    title: "Illuminairy Labs",
    status: "Planned",
    text: "A future space for applied learning experiments, technical education, and new expert-led programs."
  }
];

export const mentorStandards = [
  "Verified academic background",
  "Verified 1450+ SAT scores for SAT mentors",
  "Communication screening",
  "Professionalism and reliability",
  "Ability to instruct small groups and mentor one-on-one"
];

export const trustPillars = [
  {
    icon: GraduationCap,
    title: "Mentors & instructors",
    text: "Georgia Tech mentors and instructors (1450+ SAT) who recently took the test — relatable, rigorous, and screened for how they teach."
  },
  {
    icon: CalendarCheck,
    title: "Twelve-week plan",
    text: "One twelve-week program with a set schedule beats self-study and à la carte sessions — diagnostics, 1:1s, classes, and practice, all mapped out in advance."
  },
  {
    icon: UserCheck,
    title: "1:1 + diagnostics",
    text: "Week-one baselines shape six private sessions — personalized coaching, not generic review."
  },
  {
    icon: Target,
    title: "Practice that reinforces",
    text: "Assigned sets between classes (and timed full-length tests) so what was taught gets repeated until it holds."
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

export const Arrow = ArrowRight;
