/**
 * /enroll consumer-tone copy SSOT.
 * Rules:
 *  - No data-source language ("from your SAT Score Path / Strategy Call / receipt").
 *  - No em dashes. Use periods, commas, colons, parentheses.
 *  - Parent voice: "your SAT program," not "SAT Accelerator." That's an internal
 *    name; parents bought a program for their kid's SAT date.
 *  - Real product names: Skill Diagnostic, weekly progress reports, parent portal.
 *  - No banned tutor-ad phrases. No score guarantees. See docs/messaging-guide.md.
 */
import type { ReactNode } from "react";

export const ENROLL_PROGRAM_LABEL = "Enrollment";

export const ENROLL_TOTAL_STEPS = 3;

/* ── Loading / verify error ─────────────────────────────────── */
export const ENROLL_LOADING_TITLE = "Confirming your enrollment";
export const ENROLL_LOADING_LEAD = "This usually takes a few seconds.";

export const ENROLL_VERIFY_ERROR_TITLE = "We need your enrollment link";
export const ENROLL_VERIFY_ERROR_LEAD =
  "Open the page from the link in your Stripe receipt email so we can finish setting up your account.";

export const ENROLL_MISSING_SESSION_ERROR =
  "Open the page from the link in your Stripe receipt email.";

/* ── Step 1 · Welcome + receipt + diagnostic ───────────────── */
export const ENROLL_WELCOME_EYEBROW = "Step 1 of 3";
export function enrollWelcomeTitle(parentFirst?: string): string {
  return parentFirst?.trim()
    ? `Welcome to Illuminairy, ${parentFirst.trim()}!`
    : "Welcome to Illuminairy!";
}
export function enrollWelcomeLead(studentFirst?: string, testDateLabel?: string): string {
  const student = studentFirst?.trim() || "your student";
  if (testDateLabel?.trim()) {
    const shortDate = testDateLabel.replace(/,?\s*\d{4}\s*$/, "").trim();
    return `We're excited to have ${student} in our ${shortDate} SAT Program. Book the Skill Diagnostic below — the sooner they start, the more time before test day.`;
  }
  return `We're excited to have ${student} in the program. Book the Skill Diagnostic below — the sooner they start, the more time before test day.`;
}
export const ENROLL_WELCOME_DIAGNOSTIC_HEAD = "Book the Skill Diagnostic";
export const ENROLL_WELCOME_DIAGNOSTIC_SUB =
  "2 hr 14 min proctored. Pick a time that works for your family.";
export const ENROLL_WELCOME_CONTINUE = "Continue to student contact";
export const ENROLL_WELCOME_BOOKING_REQUIRED =
  "Pick a Skill Diagnostic time to continue.";

/* ── Step 2 · Student contact + comms ─────────────────────── */
export const ENROLL_STUDENT_EYEBROW = "Step 2 of 3";
export const ENROLL_STUDENT_TITLE = "Student contact";
export const ENROLL_STUDENT_LEAD =
  "We work with your student directly. Their mobile is where class reminders and mentor messages land.";
export const ENROLL_STUDENT_SMS_INSIGHT =
  "We text your student directly — that's where students engage. Class reminders, mentor messages, scheduling. Email goes to you both, but the day-to-day is text.";
export function EnrollStudentSmsConsent(props: {
  studentFirst: string;
  studentPhone: string;
}): ReactNode {
  const name = props.studentFirst.trim() || "your student";
  const phone = props.studentPhone.trim() || "their number";
  return (
    <>
      I confirm I am {name}&apos;s parent or legal guardian. I have read and agree to
      the <a href="/terms">Terms</a>, <a href="/privacy">Privacy</a>, and
      SMS/Communications Disclosure on my own behalf and on behalf of {name}. I
      consent on their behalf to receive recurring automated text messages from
      Illuminairy at {phone} for Skill Diagnostic reminders, weekly tutoring updates,
      and program messages. Message frequency varies. Msg &amp; data rates may apply.
      Reply STOP to opt out. See <a href="/privacy">Privacy</a> and{" "}
      <a href="/terms">Terms</a>.
    </>
  );
}
export const ENROLL_STUDENT_SMS_CONSENT_REQUIRED =
  "Confirm consent so we can text your student.";
export const ENROLL_STUDENT_REQUIRED_ERROR =
  "Add the student's name, mobile, and email to continue.";
export const ENROLL_STUDENT_CONTINUE = "Complete enrollment";
export const ENROLL_STUDENT_SAVING = "Saving...";

/* ── Legacy profile labels (field inputs) ───────────────────── */
export const ENROLL_PROFILE_EYEBROW = "Step 2 of 3";
export const ENROLL_PROFILE_TITLE = "Confirm contact info";
export const ENROLL_PROFILE_LEAD =
  "We use this for class invites, weekly reports, and the parent portal.";
export const ENROLL_PROFILE_PARENT_HEAD = "Parent / guardian";
export const ENROLL_PROFILE_STUDENT_HEAD = "Student";
export const ENROLL_PROFILE_OPTIONAL_TOGGLE = "Add school + grade";
export const ENROLL_PROFILE_OPTIONAL_TOGGLE_OPEN = "Hide school + grade";
export const ENROLL_PROFILE_SAT_PRIOR_LABEL =
  "Student has taken the SAT or PSAT before";
export const ENROLL_PROFILE_PREFILL_CHIP = "Saved";
export const ENROLL_PROFILE_REQUIRED_HINT = "Required";
export const ENROLL_PROFILE_OPTIONAL_HINT = "Optional";
export const ENROLL_PROFILE_CONTINUE = "Continue";
export const ENROLL_PROFILE_REQUIRED_ERROR =
  "Add your name, email, and the student's first name to continue.";

/* ── Step 3 · Weekly progress reports ───────────────────────── */
export const ENROLL_UPDATES_EYEBROW = "Step 3 of 5";
export const ENROLL_UPDATES_TITLE = "Weekly progress reports";
export const ENROLL_UPDATES_LEAD =
  "Choose how you want them delivered. Most parents pick both.";

export const ENROLL_UPDATES_EMAIL_TITLE = "Email";
export function enrollUpdatesEmailSub(email?: string): string {
  return email?.trim()
    ? `Sent to ${email.trim()} every week.`
    : "Sent every week to the email on file.";
}

export const ENROLL_UPDATES_SMS_TITLE = "Text message";
export const ENROLL_UPDATES_SMS_SUB =
  "A short summary text every week. Reply STOP to opt out anytime.";
export const ENROLL_UPDATES_SMS_PHONE_LABEL = "Phone for text updates";
export const ENROLL_UPDATES_SMS_PHONE_HINT = "Mobile number";
export function EnrollUpdatesSmsTcpa(): ReactNode {
  return (
    <>
      I agree Illuminairy may send weekly progress text messages to this
      number. Message and data rates may apply. Reply STOP to opt out. See{" "}
      <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.
    </>
  );
}
export const ENROLL_UPDATES_SMS_TCPA_REQUIRED =
  "Confirm consent so we can send progress texts.";
export const ENROLL_UPDATES_SMS_PHONE_REQUIRED =
  "Add a mobile number to receive text updates.";

export const ENROLL_UPDATES_NEITHER_HINT =
  "You can update report preferences anytime from the parent portal.";

export const ENROLL_UPDATES_ADD_GUARDIAN = "Add another parent or guardian";
export const ENROLL_UPDATES_REMOVE_GUARDIAN = "Remove second parent / guardian";
export const ENROLL_UPDATES_GUARDIAN_HEAD = "Second parent / guardian";
export const ENROLL_UPDATES_GUARDIAN_LEAD =
  "We will copy them on the same weekly reports.";
export function EnrollUpdatesGuardianSmsTcpa(): ReactNode {
  return (
    <>
      They agree Illuminairy may send weekly progress text messages to their
      number. Message and data rates may apply. Reply STOP to opt out.
    </>
  );
}
export const ENROLL_UPDATES_GUARDIAN_REQUIRED =
  "Add a name and email for the second parent or guardian.";
export const ENROLL_UPDATES_CONTINUE = "Continue";

/* ── Step 4 · Skill Diagnostic ──────────────────────────────── */
export const ENROLL_DIAGNOSTIC_EYEBROW = "Step 4 of 5";
export const ENROLL_DIAGNOSTIC_TITLE = "Book the Skill Diagnostic";
export const ENROLL_DIAGNOSTIC_LEAD =
  "2 hours 14 minutes proctored. Pick a time that works for your family.";
export const ENROLL_DIAGNOSTIC_SUMMARY_EYEBROW = "Skill Diagnostic";
export function enrollDiagnosticSummaryTitle(studentFirst: string): string {
  return studentFirst.trim() ? `For ${studentFirst.trim()}` : "For your student";
}
export const ENROLL_DIAGNOSTIC_SUMMARY_SUB =
  "Two sections plus a short break. Mentor reviews results before week one.";
export function enrollDiagnosticBooked(whenLabel: string): string {
  return `You picked ${whenLabel}. Confirmation email is on the way.`;
}
export const ENROLL_DIAGNOSTIC_WAITING =
  "Add your name and email above to see open times.";
export const ENROLL_DIAGNOSTIC_REQUIRED =
  "Pick a Skill Diagnostic time to finish enrollment.";
export const ENROLL_DIAGNOSTIC_CONTINUE = "Complete enrollment";
export const ENROLL_DIAGNOSTIC_SAVING = "Saving...";

/* ── Step 3 · Complete ──────────────────────────────────────── */
export const ENROLL_COMPLETE_EYEBROW = "Step 3 of 3";
export function enrollCompleteTitle(studentFirst?: string): string {
  return studentFirst?.trim()
    ? `${studentFirst.trim()} is all set.`
    : "You are all set.";
}
export function enrollCompleteLead(testDateLabel?: string): string {
  if (testDateLabel?.trim()) {
    return `Skill Diagnostic is booked. We work with your student now. SAT is ${testDateLabel.trim()}.`;
  }
  return "Skill Diagnostic is booked. We work with your student now.";
}
export const ENROLL_COMPLETE_MENTOR_LINE =
  "Your mentor will introduce themselves by email this week. Until then, I'm here.";
/** @deprecated use `enrollCompleteLead(testDateLabel)`. */
export const ENROLL_COMPLETE_LEAD =
  "Skill Diagnostic locked in. Watch your inbox over the next few days.";
export const ENROLL_COMPLETE_AGENDA_EYEBROW = "What happens this week";
// Backwards-compat alias — welcome step renders the same agenda.
export const ENROLL_WELCOME_AGENDA_EYEBROW = ENROLL_COMPLETE_AGENDA_EYEBROW;
export const ENROLL_COMPLETE_AGENDA = [
  {
    title: "Mentor introduction email",
    sub: "Your mentor sends a welcome note with portal login and a quick intake."
  },
  {
    title: "Skill Diagnostic confirmation",
    sub: "Calendar invite with proctoring instructions and what to bring."
  },
  {
    title: "Weekly classes and reports begin",
    sub: "Reading & Writing and Math classes start the week of your program. Weekly progress reports follow."
  }
] as const;
// Backwards-compat alias — welcome step renders the same agenda.
export const ENROLL_WELCOME_AGENDA = ENROLL_COMPLETE_AGENDA;

export function enrollSupportLine(email: string): string {
  return `Questions? Email ${email} or reply to your Stripe receipt.`;
}
