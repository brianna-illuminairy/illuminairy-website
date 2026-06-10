import { NextResponse } from "next/server";
import { createAdminAlert } from "@/lib/admin/alerts";
import { sendEnrollmentIntakeCompleteEmail } from "@/lib/crm/enroll-intake-email";
import { TYPEFORM_ENROLLMENT_FORM_ID } from "@/lib/crm/typeform-enrollment-fields";
import type { TypeformEnrollmentIntake } from "@/lib/crm/typeform-enrollment-parse";
import { recordEnrollmentFromTypeform } from "@/lib/crm/typeform-enrollment";
import { queueIntegrationJob } from "@/lib/integrations/mentomind/jobs";
import { getStripe } from "@/lib/stripe";

type IntakeBody = {
  sessionId?: string;
  parentFirst?: string;
  parentLast?: string;
  parentPhone?: string;
  parentEmail?: string;
  studentFirst?: string;
  studentLast?: string;
  studentGrade?: string;
  studentSchool?: string;
  studentPhone?: string;
  studentEmail?: string;
  satTakenBefore?: boolean;
  tutoring1?: string;
  tutoring2?: string;
  tutoring3?: string;
  tutoring4?: string;
  diagnosticAssessment?: string;
  diagnosticReview?: string;
};

export async function POST(request: Request) {
  let body: IntakeBody;
  try {
    body = (await request.json()) as IntakeBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required." }, { status: 400 });
  }

  const stripe = getStripe();
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Invalid payment session." }, { status: 400 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
  }

  const parentEmail = (body.parentEmail ?? session.metadata?.parentEmail ?? session.customer_email ?? "")
    .trim()
    .toLowerCase();
  const studentFirst = body.studentFirst?.trim() ?? "";
  if (!parentEmail || !studentFirst) {
    return NextResponse.json({ error: "Parent email and student first name required." }, { status: 400 });
  }

  const tutoringWindows = [body.tutoring1, body.tutoring2, body.tutoring3, body.tutoring4]
    .map((v) => v?.trim())
    .filter(Boolean) as string[];

  const intake: TypeformEnrollmentIntake = {
    typeformToken: `stripe_${sessionId}`,
    formId: TYPEFORM_ENROLLMENT_FORM_ID,
    submittedAt: new Date().toISOString(),
    parentFirst: body.parentFirst?.trim() ?? "",
    parentLast: body.parentLast?.trim() ?? "",
    parentEmail,
    parentPhone: body.parentPhone?.trim() ?? "",
    secondParent: null,
    studentFirst,
    studentLast: body.studentLast?.trim() ?? "",
    studentGrade: body.studentGrade?.trim() ?? "",
    studentSchool: body.studentSchool?.trim() ?? "",
    studentPhone: body.studentPhone?.trim() ?? "",
    studentEmail: body.studentEmail?.trim().toLowerCase() ?? "",
    satTakenBefore: body.satTakenBefore === true,
    scoreReportUrl: null,
    tutoringWindows,
    diagnosticAssessmentTime: body.diagnosticAssessment?.trim() || null,
    diagnosticReviewTime: body.diagnosticReview?.trim() || null
  };

  const result = await recordEnrollmentFromTypeform(intake);
  if (!result.ok) {
    void createAdminAlert({
      alertType: "enroll_intake_failed",
      severity: "critical",
      title: "Enrollment intake save failed",
      body: `${parentEmail}: ${result.error}`,
      source: "crm",
      linkUrl: "/admin/crm"
    });
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  if (result.enrollmentId) {
    const { recordClientPayment, ensureSoftwareLicenseCost } = await import(
      "@/lib/crm/economics"
    );
    await recordClientPayment({
      enrollmentId: result.enrollmentId,
      clientId: result.clientId,
      stripeCheckoutSessionId: sessionId,
      amountCents: session.amount_total ?? 0,
      paidAt: new Date().toISOString()
    });
    await ensureSoftwareLicenseCost(result.enrollmentId);
    void queueIntegrationJob({
      enrollmentId: result.enrollmentId,
      jobType: "create_student",
      payload: { studentEmail: intake.studentEmail, parentEmail }
    });
  }

  if (!result.duplicate) {
    void createAdminAlert({
      alertType: "new_enrollment",
      severity: "info",
      title: `New enrollment: ${studentFirst}`,
      body: `${parentEmail} completed intake after payment.`,
      source: "crm",
      linkUrl: "/admin/finance",
      dedupeKey: `enrollment:${result.enrollmentId}`
    });
    void sendEnrollmentIntakeCompleteEmail({ parentEmail, studentFirst });
  }

  return NextResponse.json({
    ok: true,
    enrollmentId: result.enrollmentId,
    duplicate: result.duplicate
  });
}
