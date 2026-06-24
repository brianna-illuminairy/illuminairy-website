import { Resend } from "resend";
import { site } from "@/lib/site";

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
      "Completed 2 one-hour tutoring sessions on Reading and Writing (4 total sessions so far), both on transitions (linking-word questions)",
      "Overall practice accuracy: 67% on the diagnostic, 89% in week 1, 91% this week (93 questions)",
      "Transitions: missed all 3 on the diagnostic; this week scored 96% on practice set 1 (26/27), 96% on flashcards after review, and 88% on the harder untimed set (14/16)",
      "Equivalent Expressions (Math, from week 1): 95% on easy (goal met), 72% on medium (still working toward 95%)",
      "Homework still due: Transitions 3 timed set (30 questions, due June 28)",
      "On her own she started Command of Evidence and Right Triangles practice (not yet taught in sessions)",
      "Study plan: 2 of 11 priority skills taught in sessions so far (equivalent expressions and transitions)",
      "She remains on track for her 1400 goal on the August 22 test. We estimate she is around 1200–1225 today"
    ],
    thisWeek: [
      "Finish Transitions 3 timed set: 30 hard questions in one sitting, due June 28",
      "Two Math sessions continuing in the advanced Math section (~35% of SAT Math): perfect squares, exponentials, quadratic formula, and discriminant",
      "Review 5 diagnostic misses in nonlinear equations and systems; continue medium equivalent expressions until she hits 95% on her own",
      "First full-length practice test at the end of the week (June 23 to 30) under real test conditions. This shows score improvement since her June 6 diagnostic and whether she is on track for 1400 (first-month checkpoint: about +100 points, roughly 1225+)",
      "Sessions stay hands-on: live problems and drills, not long lectures"
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
