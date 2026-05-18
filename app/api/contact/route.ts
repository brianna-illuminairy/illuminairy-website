import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactReasons, site } from "@/lib/site";

type ContactPayload = {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
  company?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Email support@illuminairy.com directly."
      },
      { status: 503 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const reason = body.reason?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !reason || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!contactReasons.includes(reason as (typeof contactReasons)[number])) {
    return NextResponse.json(
      { error: "Please choose a valid reason for your inquiry." },
      { status: 400 }
    );
  }

  const inbox = process.env.CONTACT_INBOX || site.supportEmail;
  const from =
    process.env.RESEND_FROM_EMAIL || "Illuminairy <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: inbox,
    replyTo: email,
    subject: `Illuminairy inquiry · ${reason}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Reason: ${reason}`,
      "",
      message
    ].join("\n")
  });

  if (error) {
    console.error("Resend error:", error);
    const needsDomain =
      !process.env.RESEND_FROM_EMAIL ||
      String(error.message || "").toLowerCase().includes("domain");
    return NextResponse.json(
      {
        error: needsDomain
          ? `We could not send your message yet. Email ${site.supportEmail} directly and we will respond within 1–2 business days.`
          : "We could not send your message. Please try again or email us directly."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
