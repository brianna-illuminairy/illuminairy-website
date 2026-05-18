import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  GraduationCap,
  LineChart,
  LockKeyhole,
  MessagesSquare,
  Network,
  Sparkles,
  Target,
  UserCheck,
  UsersRound,
  Video
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
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/brianna-illuminairy/new-meeting",
  typeformUrl: process.env.NEXT_PUBLIC_TYPEFORM_URL || ""
};

/**
 * Live and upcoming cohorts — the proof-of-momentum surface.
 * Shown on the home page hero card so families and mentors
 * can immediately see what's running.
 */
export const cohorts = [
  {
    status: "live",
    statusLabel: "Live · 2 cohorts",
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
  { value: "12", label: "Weeks of structured preparation" },
  { value: "30", label: "Live small-group + private sessions" },
  { value: "10", label: "Students per capped cohort" },
  { value: "1450+", label: "SAT mentor score standard" }
];

export const satFeatures = [
  {
    icon: CalendarCheck,
    title: "Twelve focused weeks",
    text: "A complete preparation arc built for students working toward the August 22, 2026 SAT."
  },
  {
    icon: UsersRound,
    title: "Small-group instruction",
    text: "Twenty-four live cohort sessions with room for interaction, review, and guided practice."
  },
  {
    icon: UserCheck,
    title: "Private coaching",
    text: "Six private 1:1 sessions for diagnostic review, planning, and targeted support."
  },
  {
    icon: Target,
    title: "Diagnostic-driven plan",
    text: "Preparation is shaped around strengths, gaps, pacing, and weekly accountability."
  },
  {
    icon: GraduationCap,
    title: "Georgia Tech mentors",
    text: "Georgia Tech students, alumni, or similarly qualified mentors with verified SAT performance."
  },
  {
    icon: Video,
    title: "Virtual delivery",
    text: "Live instruction and coaching delivered online so students can join from anywhere."
  }
];

export const platformAreas = [
  {
    icon: GraduationCap,
    title: "Illuminairy SAT",
    status: "Live now",
    text: "Premium cohort-based SAT preparation, Georgia Tech-led, for ambitious students and families who want structure and rigor."
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
    text: "A selective network of high-performing educated talent for mentorship, tutoring, and applied expertise."
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
    text: "A future space for applied learning experiments, technical education, and new expert-led cohorts."
  }
];

export const mentorStandards = [
  "Verified academic background",
  "1450+ SAT score standard for SAT mentors",
  "Score verification where applicable",
  "Communication screening",
  "Professionalism and reliability",
  "Ability to teach clearly"
];

export const trustPillars = [
  {
    icon: LockKeyhole,
    title: "Transparent service model",
    text: "Families see exactly what is being delivered: live sessions, private coaching, diagnostics, and support."
  },
  {
    icon: MessagesSquare,
    title: "Direct, human support",
    text: "Real contact details, real humans, plain-language policies — before, during, and after enrollment."
  },
  {
    icon: Network,
    title: "Selective mentor network",
    text: "A careful model for sourcing and vetting educated talent, starting with Georgia Tech-led SAT cohorts."
  },
  {
    icon: Sparkles,
    title: "Room to grow",
    text: "SAT cohorts are live today. Professional and business programs are planned with the same standard for structure and mentor quality."
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
