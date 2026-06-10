import { Resend } from "resend";
import { site } from "@/lib/site";

export async function sendEnrollmentIntakeCompleteEmail(input: {
  parentEmail: string;
  studentFirst: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Illuminairy <notifications@illuminairy.com>";

  await resend.emails.send({
    from,
    to: [input.parentEmail],
    subject: "Enrollment intake received — next steps",
    text: [
      `Hi,`,
      ``,
      `We received ${input.studentFirst}'s scheduling preferences and enrollment intake.`,
      ``,
      `What happens next:`,
      `1. We confirm diagnostic and tutoring windows within 24–48 hours.`,
      `2. You will get calendar invites for the Skill Diagnostic and review session.`,
      `3. Your student portal login details will arrive by email once the account is ready.`,
      ``,
      `Questions? Reply to this email or write ${site.supportEmail}.`,
      ``,
      `— Illuminairy`
    ].join("\n")
  });
}
