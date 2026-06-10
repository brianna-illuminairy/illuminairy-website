import { createAdminAlert } from "@/lib/admin/alerts";
import { ensureSoftwareLicenseCost, recordClientPayment } from "@/lib/crm/economics";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { satProgram } from "@/lib/site";
import { appendTouchEvent, linkVisitorTouches } from "@/lib/crm/touch";

type CheckoutMeta = {
  program?: string;
  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhone?: string;
  studentFirstName?: string;
  studentLastName?: string;
  studentEmail?: string;
  studentPhone?: string;
  studentZipCode?: string;
  visitorId?: string;
  leadId?: string;
};

export async function recordEnrollmentFromStripe(session: {
  id: string;
  amount_total: number | null;
  customer_email: string | null;
  metadata: Record<string, string> | null;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const meta = (session.metadata ?? {}) as CheckoutMeta;
  const parentEmail = (
    meta.parentEmail ??
    session.customer_email ??
    ""
  ).toLowerCase();

  if (!parentEmail) {
    return { ok: false as const, error: "missing_parent_email" };
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id, visitor_id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  const leadId = meta.leadId ?? lead?.id ?? null;
  const visitorId = meta.visitorId ?? lead?.visitor_id ?? null;

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let clientId = existingClient?.id;

  if (!clientId) {
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({
        lead_id: leadId,
        parent_email: parentEmail,
        parent_first: meta.parentFirstName ?? null,
        parent_last: meta.parentLastName ?? null,
        parent_phone: meta.parentPhone ?? null,
        status: "active"
      })
      .select("id")
      .single();

    if (clientErr || !client) {
      console.error("create client:", clientErr);
      return { ok: false as const, error: clientErr?.message ?? "client_failed" };
    }
    clientId = client.id;
  }

  if (leadId) {
    await supabase
      .from("leads")
      .update({
        stage: "won",
        converted_at: new Date().toISOString(),
        converted_client_id: clientId
      })
      .eq("id", leadId);
  }

  const { data: student, error: studentErr } = await supabase
    .from("students")
    .insert({
      client_id: clientId,
      first_name: meta.studentFirstName ?? "Student",
      last_name: meta.studentLastName ?? null,
      student_email: meta.studentEmail ?? null,
      student_phone: meta.studentPhone ?? null,
      zip_code: meta.studentZipCode ?? null
    })
    .select("id")
    .single();

  if (studentErr || !student) {
    console.error("create student:", studentErr);
    return { ok: false as const, error: studentErr?.message ?? "student_failed" };
  }

  const paidAt = new Date().toISOString();
  const { data: enrollment, error: enrollErr } = await supabase
    .from("enrollments")
    .insert({
      client_id: clientId,
      student_id: student.id,
      lead_id: leadId,
      program: meta.program ?? "sat-accelerator",
      program_label: `SAT Accelerator · ${satProgram.examDayLabel}`,
      status: "active",
      stripe_checkout_session_id: session.id,
      amount_paid_cents: session.amount_total ?? null,
      paid_at: paidAt,
      baseline_score: null,
      target_score: null
    })
    .select("id")
    .single();

  if (enrollErr || !enrollment) {
    console.error("create enrollment:", enrollErr);
    return { ok: false as const, error: enrollErr?.message ?? "enrollment_failed" };
  }

  if (visitorId && leadId) {
    await linkVisitorTouches(visitorId, leadId, clientId);
  }

  await appendTouchEvent({
    visitor_id: visitorId ?? undefined,
    lead_id: leadId ?? undefined,
    client_id: clientId,
    enrollment_id: enrollment.id,
    event_type: "checkout_completed",
    source: "webhook",
    payload: { stripe_session_id: session.id }
  });

  await recordClientPayment({
    enrollmentId: enrollment.id,
    clientId,
    stripeCheckoutSessionId: session.id,
    amountCents: session.amount_total ?? 0,
    paidAt: paidAt
  });
  await ensureSoftwareLicenseCost(enrollment.id);

  void createAdminAlert({
    alertType: "new_enrollment_payment",
    severity: "info",
    title: `Payment received: ${meta.studentFirstName ?? parentEmail}`,
    body: `${parentEmail} paid via Stripe checkout.`,
    source: "stripe",
    linkUrl: "/admin/finance",
    dedupeKey: `stripe_payment:${session.id}`
  });

  return {
    ok: true as const,
    clientId,
    enrollmentId: enrollment.id,
    leadId,
    parentEmail
  };
}
