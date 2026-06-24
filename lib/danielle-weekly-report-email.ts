import { Resend } from "resend";
import { site } from "@/lib/site";

/** Parent email copy for weekly reports. Match tone + facts in docs/weekly-progress-report-style.md */

export type DanielleWeeklyReportWeekKey = "week-1" | "week-2";

export type DanielleWeeklyReportEmailInput = {
  parentEmail: string;
  studentEmail?: string;
  parentFirst?: string;
  week?: DanielleWeeklyReportWeekKey;
  weekLabel?: string;
  reportPath?: string;
};

type WeeklyReportEmailContent = {
  week: DanielleWeeklyReportWeekKey;
  weekLabel: string;
  reportPath: string;
  subjectDateRange: string;
  highlights: string[];
  thisWeek: string[];
};

const WEEKLY_REPORT_CONTENT: Record<DanielleWeeklyReportWeekKey, WeeklyReportEmailContent> = {
  "week-1": {
    week: "week-1",
    weekLabel: "June 9–16, 2026",
    reportPath: "/danielle/week-1/report",
    subjectDateRange: "June 9–16, 2026",
    highlights: [
      "Completed 2 one-hour tutoring sessions on Math, specifically Advanced Math",
      "Completed 98 practice questions at 89% accuracy, which is a 22-point increase versus her diagnostic baseline of 67% accuracy",
      "She remains on track for her 1400 goal on the August 22 test. We estimate she is around 1150–1200 today",
      "She is now able to solve a quadratic equation problem she got incorrect on the diagnostic",
      "She scored 95% on her assigned Equivalent Expressions practice set and is ready to start working through medium-difficulty problems"
    ],
    thisWeek: [
      "We will be focusing on Reading and Writing for both sessions",
      "We will work on helping her master SAT transition questions, which show up frequently on the SAT",
      "We will be incorporating more interactive practice since she responded well to that last week",
      "We will assign more practice problem sets for Reading and Writing"
    ]
  },
  "week-2": {
    week: "week-2",
    weekLabel: "June 16–23, 2026",
    reportPath: "/danielle/week-2/report",
    subjectDateRange: "June 16–23, 2026",
    highlights: [
      "Both sessions went in depth on Reading and Writing Transitions: read two clauses, name the relationship (addition, contrast, cause, and similar), then pick the transition that fits",
      "She missed all three transition questions on the June 6 practice test. Homework is now 96% on set 1, 96% on flashcards, and 88% on hard untimed",
      "While learning transitions she kept week-one Math going: nonlinear equations (her most common math topic) and equivalent expressions (factoring and simplifying)",
      "Equivalent expressions homework: easy 19/20 (95%, complete), medium 18/25 (72%, complete)",
      "Overall homework accuracy: 67% on June 6 → 89% week 1 → 91% week 2",
      "Estimated score ~1210 today: 1125 starting midpoint + ~85 points gained. Goal 1400 on August 22"
    ],
    thisWeek: [
      "Finish Transitions timed homework (30 questions, due June 28)",
      "Two Math sessions on nonlinear functions and nonlinear equations, with special factoring cases (difference of squares, squared binomials, and similar patterns)",
      "Keep reviewing medium equivalent expression miss types until 95% accuracy (assignment already complete)",
      "First full-length practice test at end of week",
      "Sessions stay hands-on: live problems and drills"
    ]
  }
};

function portalUrl(path: string) {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveWeekKey(input: DanielleWeeklyReportEmailInput): DanielleWeeklyReportWeekKey {
  if (input.week) {
    return input.week;
  }
  if (input.reportPath?.includes("week-2")) {
    return "week-2";
  }
  return "week-1";
}

export function buildDanielleWeeklyReportSubject(input: DanielleWeeklyReportEmailInput) {
  const weekKey = resolveWeekKey(input);
  const content = WEEKLY_REPORT_CONTENT[weekKey];
  const dateRange = input.weekLabel?.trim() || content.subjectDateRange;
  return `Danielle's Weekly SAT Progress Report | ${dateRange}`;
}

export function buildDanielleWeeklyReportEmailBody(input: DanielleWeeklyReportEmailInput) {
  const weekKey = resolveWeekKey(input);
  const content = WEEKLY_REPORT_CONTENT[weekKey];
  const weekLabel = input.weekLabel?.trim() || content.weekLabel;
  const reportPath = input.reportPath?.trim() || content.reportPath;
  const url = portalUrl(reportPath);

  const greeting = input.parentFirst?.trim()
    ? `Hi Danielle & ${input.parentFirst.trim()},`
    : "Hi Danielle & Amma,";

  const highlightLines = content.highlights.map((line) => `${line}.`);
  const thisWeekLines = content.thisWeek.map((line) => `${line}.`);

  return [
    greeting,
    ``,
    `Danielle's weekly SAT progress report for ${weekLabel} is ready on her private Illuminairy portal, ${url}`,
    ``,
    `Highlights from last week:`,
    ``,
    ...highlightLines,
    ``,
    `This week:`,
    ``,
    ...thisWeekLines,
    ``,
    `Thanks,`,
    ``,
    `Brianna Zajicek`,
    ``,
    `Illuminairy SAT Tutoring`,
    `brianna@illuminairy.com`
  ].join("\n");
}

export async function sendDanielleWeeklyReportEmail(input: DanielleWeeklyReportEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false as const, skipped: "resend_not_configured" };
  }

  const parentEmail = input.parentEmail.trim();
  if (!parentEmail) {
    return { ok: false as const, error: "missing_parent_email" };
  }

  const studentEmail = input.studentEmail?.trim();
  const to = studentEmail ? [studentEmail, parentEmail] : [parentEmail];

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Illuminairy <notifications@illuminairy.com>";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: buildDanielleWeeklyReportSubject(input),
    text: buildDanielleWeeklyReportEmailBody(input)
  });

  if (error) {
    console.error("Danielle weekly report email:", error);
    return { ok: false as const, error: String(error.message ?? error) };
  }

  return { ok: true as const, to };
}
