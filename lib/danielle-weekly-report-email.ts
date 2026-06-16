import { Resend } from "resend";
import { site } from "@/lib/site";

export type DanielleWeeklyReportEmailInput = {
  parentEmail: string;
  parentFirst?: string;
  weekLabel?: string;
  reportPath?: string;
};

function portalUrl(path: string) {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildDanielleWeeklyReportEmailBody(input: DanielleWeeklyReportEmailInput) {
  const weekLabel = input.weekLabel ?? "Week 1 (June 9 to 16, 2026)";
  const reportPath = input.reportPath ?? "/danielle/week-1/report";
  const url = portalUrl(reportPath);
  const greeting = input.parentFirst?.trim()
    ? `Hi ${input.parentFirst.trim()},`
    : "Hi,";

  return [
    greeting,
    ``,
    `Danielle's weekly SAT progress report for ${weekLabel} is ready on her private Illuminairy portal.`,
    ``,
    `Highlights from this week:`,
    `• 2 tutoring sessions and 98 practice questions at 89% accuracy (+22 points vs her diagnostic baseline)`,
    `• On track for her 1400 goal on the August 22 test; we estimate she is around 1150 to 1200 today`,
    `• Breakthrough on factoring and nonlinear equations, including the diagnostic quadratic she missed`,
    `• Equivalent Expressions practice at 95% on her assigned set; she is already working medium problems on her own`,
    `• Next up: Transitions in Reading and Writing (two sessions this week), with more interactive practice during sessions`,
    ``,
    `Read the full report (score chart, session notes, and next steps):`,
    url,
    ``,
    `Sign in with the email we shared with you.`,
    ``,
    `Questions? Reply to this email or write ${site.supportEmail}.`,
    ``,
    `Illuminairy`,
    site.supportEmail
  ].join("\n");
}

export async function sendDanielleWeeklyReportEmail(input: DanielleWeeklyReportEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false as const, skipped: "resend_not_configured" };
  }

  const to = input.parentEmail.trim();
  if (!to) {
    return { ok: false as const, error: "missing_parent_email" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Illuminairy <notifications@illuminairy.com>";
  const weekLabel = input.weekLabel ?? "Week 1";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Danielle's SAT progress report · ${weekLabel}`,
    text: buildDanielleWeeklyReportEmailBody(input)
  });

  if (error) {
    console.error("Danielle weekly report email:", error);
    return { ok: false as const, error: String(error.message ?? error) };
  }

  return { ok: true as const };
}
