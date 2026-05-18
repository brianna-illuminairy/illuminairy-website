import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
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
  email: "brianna@illuminairy.com",
  supportEmail: "brianna@illuminairy.com",
  phone: "+1 (404) 314-4872",
  location: "Evans, Georgia",
  descriptor: "ILLUMINAIRY",
  satDate: "August 22, 2026",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  typeformUrl: process.env.NEXT_PUBLIC_TYPEFORM_URL || ""
};

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
  "mailto:brianna@illuminairy.com?subject=Illuminairy%20program%20inquiry";

export const bookLink = site.calendlyUrl || mailtoLink;
export const inquiryLink = site.typeformUrl || mailtoLink;

export const programStats = [
  { value: "12", label: "weeks of structured preparation" },
  { value: "30", label: "live virtual sessions" },
  { value: "10", label: "students per capped cohort" },
  { value: "1450+", label: "SAT mentor score standard" }
];

export const satFeatures = [
  {
    icon: CalendarCheck,
    title: "12-week program",
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
    title: "Diagnostic-driven support",
    text: "Preparation is shaped around strengths, gaps, pacing, and weekly accountability."
  },
  {
    icon: GraduationCap,
    title: "High-performing mentors",
    text: "Georgia Tech students, alumni, or similarly qualified mentors with verified SAT performance where applicable."
  },
  {
    icon: Video,
    title: "Virtual delivery",
    text: "Live instruction and coaching delivered online so students can participate from home."
  }
];

export const platformAreas = [
  {
    icon: GraduationCap,
    title: "Illuminairy SAT Accelerator",
    status: "Live first product",
    text: "Premium cohort-based SAT preparation for ambitious students and families who want structure, rigor, and mentorship."
  },
  {
    icon: BrainCircuit,
    title: "IlluminAIry AI",
    status: "Future area",
    text: "Practical AI upskilling for professionals and business owners as the platform expands."
  },
  {
    icon: LineChart,
    title: "Illuminairy Labs",
    status: "Future area",
    text: "Project-based technical learning and applied education for motivated learners."
  },
  {
    icon: BriefcaseBusiness,
    title: "Illuminairy Professional",
    status: "Future area",
    text: "Mentor-led professional learning, coaching, and business education."
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
    text: "Families can see what is being delivered: live sessions, private coaching, diagnostics, and support."
  },
  {
    icon: MessagesSquare,
    title: "Direct customer support",
    text: "Clear contact details, human support, and plain-language policies before enrollment."
  },
  {
    icon: Network,
    title: "Selective mentor network",
    text: "A careful model for sourcing and vetting educated talent, starting with Georgia Tech-led SAT cohorts."
  },
  {
    icon: Sparkles,
    title: "Future-facing platform",
    text: "SAT prep is the first wedge toward applied expertise across AI, technical learning, and professional education."
  }
];

export const contactReasons = [
  "Parent/student inquiry",
  "Mentor application",
  "Partnership",
  "Billing/support",
  "General inquiry"
];

export const Arrow = ArrowRight;
