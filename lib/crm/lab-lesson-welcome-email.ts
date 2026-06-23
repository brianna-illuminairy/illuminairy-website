import { Resend } from "resend";
import { formatPortalLessonDateLine } from "@/lib/portal/lesson-join";
import { meetLinkFromCalendlyPayload } from "@/lib/integrations/google/meet";
import { appendTouchEvent } from "@/lib/crm/touch";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { LAB_WELCOME_EMAIL_SUBJECT } from "@/lib/crm/lab-lesson-klaviyo";

export type LabWelcomeEmailInput = {
  parentEmail: string;
  parentFirst?: string;
  studentFirst?: string;
  lessonStartIso: string;
  portalUrl?: string;
  meetLink?: string | null;
  calendlyUri: string;
  leadId?: string;
  visitorId?: string;
};

function resendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Illuminairy <notifications@illuminairy.com>"
  );
}

function greeting(parentFirst?: string): string {
  const name = parentFirst?.trim();
  return name ? `Hi ${name},` : "Hi,";
}

function studentLabel(studentFirst?: string): string {
  const name = studentFirst?.trim();
  return name || "your student";
}

export function buildLabWelcomeEmailBodies(input: LabWelcomeEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const portalUrl = input.portalUrl ?? `${site.url}/portal/home`;
  const when = formatPortalLessonDateLine(input.lessonStartIso);
  const student = studentLabel(input.studentFirst);
  const meetLink = input.meetLink?.trim() || null;

  const meetBlock = meetLink
    ? [
        "Google Meet link (open on a computer or tablet if you can):",
        meetLink,
        "",
      ]
    : [
        "Your Google Meet link is in your parent portal and turns on about 5 minutes before the session.",
        "",
      ];

  const text = [
    greeting(input.parentFirst),
    "",
    `Your free 45-minute SAT tutoring session for ${student} is booked for ${when.weekdayTimeRange} (${when.monthDayTz}).`,
    "",
    "Calendly already sent a calendar invite and will send email and text reminders before the session.",
    "",
    ...meetBlock,
    "Parent portal (session details and share link for your student):",
    portalUrl,
    "",
    `Forward the portal link to ${student} so they can join when it is time.`,
    "",
    `Questions? Reply to this email or write ${site.supportEmail}.`,
    "",
    "Illuminairy",
  ].join("\n");

  const meetHtml = meetLink
    ? `<p><strong>Google Meet</strong> (computer or tablet works best):<br><a href="${meetLink}">${meetLink}</a></p>`
    : `<p>Your Google Meet link is in your parent portal and turns on about 5 minutes before the session.</p>`;

  const html = [
    `<p>${greeting(input.parentFirst)}</p>`,
    `<p>Your free 45-minute SAT tutoring session for <strong>${student}</strong> is booked for <strong>${when.weekdayTimeRange}</strong> (${when.monthDayTz}).</p>`,
    `<p>Calendly already sent a calendar invite and will send email and text reminders before the session.</p>`,
    meetHtml,
    `<p><strong>Parent portal</strong> (session details and link to share with your student):<br><a href="${portalUrl}">${portalUrl}</a></p>`,
    `<p>Forward the portal link to ${student} so they can join when it is time.</p>`,
    `<p>Questions? Reply to this email or write <a href="mailto:${site.supportEmail}">${site.supportEmail}</a>.</p>`,
    `<p>Illuminairy</p>`,
  ].join("\n");

  return { subject: LAB_WELCOME_EMAIL_SUBJECT, text, html };
}

async function welcomeEmailAlreadySent(calendlyUri: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase || !calendlyUri.trim()) return false;

  const { data, error } = await supabase
    .from("touch_events")
    .select("id")
    .eq("event_type", "lab_welcome_email_sent")
    .filter("payload->>calendly_uri", "eq", calendlyUri)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[lab-welcome-email] dedupe check:", error.message);
    return false;
  }

  return Boolean(data?.id);
}

/** Transactional welcome — Resend only. Calendly handles calendar + reminders. */
export async function sendLabFreeLessonWelcomeEmail(
  input: LabWelcomeEmailInput
): Promise<{ ok: boolean; skipped?: string; error?: string }> {
  const email = input.parentEmail.trim().toLowerCase();
  const calendlyUri = input.calendlyUri.trim();
  if (!email.includes("@") || !calendlyUri) {
    return { ok: false, error: "invalid_input" };
  }

  if (await welcomeEmailAlreadySent(calendlyUri)) {
    return { ok: true, skipped: "already_sent" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, skipped: "resend_not_configured" };
  }

  const { subject, text, html } = buildLabWelcomeEmailBodies(input);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: [email],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[lab-welcome-email] Resend:", error);
    return { ok: false, error: "send_failed" };
  }

  await appendTouchEvent({
    lead_id: input.leadId,
    visitor_id: input.visitorId,
    event_type: "lab_welcome_email_sent",
    source: "server",
    payload: {
      calendly_uri: calendlyUri,
      parent_email: email,
      meet_link: input.meetLink ?? null,
      portal_url: input.portalUrl ?? `${site.url}/portal/home`,
    },
  });

  return { ok: true };
}

/** Resolve Meet link from a Calendly invitee API URI (post-book fetch). */
export async function fetchMeetLinkFromCalendlyInviteeUri(
  inviteeApiUri: string
): Promise<string | null> {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token || !inviteeApiUri.trim()) return null;

  try {
    const path = new URL(inviteeApiUri).pathname;
    const res = await fetch(`https://api.calendly.com${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { resource?: unknown };
    return meetLinkFromCalendlyPayload(data.resource ?? data).meetLink;
  } catch {
    return null;
  }
}
