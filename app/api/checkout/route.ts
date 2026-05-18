import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

type CheckoutPayload = {
  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhone?: string;
  studentFirstName?: string;
  studentLastName?: string;
  studentEmail?: string;
  studentPhone?: string;
  studentZipCode?: string;
  company?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function trimPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

function isValidZip(value: string) {
  const normalized = value.trim();
  return /^\d{5}(-\d{4})?$/.test(normalized);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error: `Enrollment checkout is not configured yet. Email ${site.supportEmail} to enroll.`
      },
      { status: 503 }
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const parentFirstName = body.parentFirstName?.trim() ?? "";
  const parentLastName = body.parentLastName?.trim() ?? "";
  const parentEmail = body.parentEmail?.trim() ?? "";
  const parentPhone = body.parentPhone?.trim() ?? "";
  const studentFirstName = body.studentFirstName?.trim() ?? "";
  const studentLastName = body.studentLastName?.trim() ?? "";
  const studentEmail = body.studentEmail?.trim() ?? "";
  const studentPhone = body.studentPhone?.trim() ?? "";
  const studentZipCode = body.studentZipCode?.trim() ?? "";

  if (
    !parentFirstName ||
    !parentLastName ||
    !parentEmail ||
    !parentPhone ||
    !studentFirstName ||
    !studentLastName ||
    !studentEmail ||
    !studentPhone ||
    !studentZipCode
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(studentEmail) || !isValidEmail(parentEmail)) {
    return NextResponse.json(
      { error: "Please enter valid email addresses." },
      { status: 400 }
    );
  }

  if (!trimPhone(studentPhone) || !trimPhone(parentPhone)) {
    return NextResponse.json(
      { error: "Please enter valid phone numbers." },
      { status: 400 }
    );
  }

  if (!isValidZip(studentZipCode)) {
    return NextResponse.json(
      { error: "Please enter a valid US zip code (e.g. 30308 or 30308-1234)." },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: parentEmail,
      metadata: {
        program: "sat-accelerator",
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhone,
        studentFirstName,
        studentLastName,
        studentEmail,
        studentPhone,
        studentZipCode
      },
      success_url: `${site.url}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/enroll?canceled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }
}
