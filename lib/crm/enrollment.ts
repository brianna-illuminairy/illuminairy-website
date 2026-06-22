import { createAdminAlert } from "@/lib/admin/alerts";
import { ensureSoftwareLicenseCost, recordClientPayment } from "@/lib/crm/economics";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { satProgram } from "@/lib/site";
import { appendTouchEvent, linkVisitorTouches } from "@/lib/crm/touch";
import {
  enrollPurchaseEventId,
  enrollPurchaseValueCents,
  sendEnrollPurchaseMetaCapi
} from "@/lib/enroll-meta-purchase";
import { onEnrollmentCompleted } from "@/lib/klaviyo-server";

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
        converted_client_id: clientId,
        last_activity_at: new Date().toISOString()
      })
      .eq("id", leadId);
    console.log(
      `[crm] lead ${leadId} (${parentEmail}) converted -> client ${clientId} via stripe session ${session.id}`
    );
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

export type PostCallEnrollCompletionInput = {
  enrollFlow: "standard-enroll" | "personalized-enroll";
  leadSlug: string;
  parentEmail: string;
  parentFirst?: string;
  parentLast?: string;
  studentFirst?: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  /** PaymentIntent or SetupIntent id — enroll idempotency key */
  referenceId: string;
  diagnosticCents: number;
  weeklyCents: number;
  diagnosticWaived?: boolean;
  subscriptionStatus: string;
  alreadyExisted?: boolean;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

export async function recordPostCallEnrollCompletion(
  input: PostCallEnrollCompletionInput
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const parentEmail = input.parentEmail.trim().toLowerCase();
  if (!parentEmail) {
    return { ok: false as const, error: "missing_parent_email" };
  }

  const { data: leadEarly } = await supabase
    .from("leads")
    .select("id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let existingEnrollment: {
    id: string;
    client_id: string;
    lead_id: string | null;
  } | null = null;

  const { data: byStripeCols } = await supabase
    .from("enrollments")
    .select("id, client_id, lead_id")
    .or(
      `stripe_subscription_id.eq.${input.stripeSubscriptionId},stripe_payment_intent_id.eq.${input.referenceId}`
    )
    .maybeSingle();

  existingEnrollment = byStripeCols;

  if (!existingEnrollment) {
    const { data: byJson } = await supabase
      .from("enrollments")
      .select("id, client_id, lead_id")
      .filter(
        "intake_details->>stripe_subscription_id",
        "eq",
        input.stripeSubscriptionId
      )
      .maybeSingle();
    existingEnrollment = byJson;
  }

  if (existingEnrollment) {
    if (leadEarly?.id) {
      await supabase
        .from("leads")
        .update({
          stage: "won",
          converted_at: new Date().toISOString(),
          converted_client_id: existingEnrollment.client_id,
          last_activity_at: new Date().toISOString()
        })
        .eq("id", leadEarly.id)
        .neq("stage", "won");
    }
    return {
      ok: true as const,
      duplicate: true as const,
      clientId: existingEnrollment.client_id,
      enrollmentId: existingEnrollment.id,
      leadId: existingEnrollment.lead_id,
      parentEmail,
      metaPurchaseEventId: enrollPurchaseEventId(input.referenceId)
    };
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id, visitor_id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  const leadId = lead?.id ?? null;
  const visitorId = lead?.visitor_id ?? null;

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
        parent_first: input.parentFirst ?? null,
        parent_last: input.parentLast ?? null,
        status: "active"
      })
      .select("id")
      .single();

    if (clientErr || !client) {
      console.error("post-call enroll create client:", clientErr);
      return { ok: false as const, error: clientErr?.message ?? "client_failed" };
    }
    clientId = client.id;
  } else if (leadId) {
    await supabase
      .from("clients")
      .update({ lead_id: leadId })
      .eq("id", clientId)
      .is("lead_id", null);
  }

  if (leadId) {
    await supabase
      .from("leads")
      .update({
        stage: "won",
        converted_at: new Date().toISOString(),
        converted_client_id: clientId,
        last_activity_at: new Date().toISOString()
      })
      .eq("id", leadId);
    console.log(
      `[crm] lead ${leadId} (${parentEmail}) converted -> client ${clientId} via post-call enroll ${input.referenceId}`
    );
  }

  const { data: student, error: studentErr } = await supabase
    .from("students")
    .insert({
      client_id: clientId,
      first_name: input.studentFirst ?? "Student",
      last_name: null
    })
    .select("id")
    .single();

  if (studentErr || !student) {
    console.error("post-call enroll create student:", studentErr);
    return { ok: false as const, error: studentErr?.message ?? "student_failed" };
  }

  const paidAt = new Date().toISOString();
  const diagPaid = input.diagnosticWaived ? 0 : input.diagnosticCents;
  const programLabel =
    input.enrollFlow === "personalized-enroll"
      ? `Personalized SAT plan · ${input.leadSlug}`
      : `SAT enroll · ${input.leadSlug}`;

  const enrollmentBase = {
    client_id: clientId,
    student_id: student.id,
    lead_id: leadId,
    program: input.enrollFlow,
    program_label: programLabel,
    status:
      input.subscriptionStatus === "active" ||
      input.subscriptionStatus === "trialing"
        ? "active"
        : "pending_payment",
    amount_paid_cents: diagPaid > 0 ? diagPaid : null,
    paid_at: diagPaid > 0 ? paidAt : null,
    intake_details: {
      stripe_subscription_id: input.stripeSubscriptionId,
      stripe_customer_id: input.stripeCustomerId,
      stripe_payment_intent_id: input.referenceId,
      enroll_flow: input.enrollFlow,
      lead_slug: input.leadSlug
    }
  };

  let enrollment: { id: string } | null = null;
  let enrollErr: { message?: string } | null = null;

  const withStripeCols = {
    ...enrollmentBase,
    stripe_subscription_id: input.stripeSubscriptionId,
    stripe_customer_id: input.stripeCustomerId,
    stripe_payment_intent_id: input.referenceId,
    enroll_flow: input.enrollFlow
  };

  const firstTry = await supabase
    .from("enrollments")
    .insert(withStripeCols)
    .select("id")
    .single();

  enrollment = firstTry.data;
  enrollErr = firstTry.error;

  if (enrollErr?.message?.includes("stripe_subscription_id") ||
      enrollErr?.message?.includes("enroll_flow") ||
      enrollErr?.message?.includes("Could not find")) {
    const fallback = await supabase
      .from("enrollments")
      .insert(enrollmentBase)
      .select("id")
      .single();
    enrollment = fallback.data;
    enrollErr = fallback.error;
  }

  if (enrollErr || !enrollment) {
    console.error("post-call enroll create enrollment:", enrollErr);
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
    source: "server",
    payload: {
      enroll_flow: input.enrollFlow,
      lead_slug: input.leadSlug,
      stripe_subscription_id: input.stripeSubscriptionId,
      reference_id: input.referenceId
    }
  });

  if (diagPaid > 0 && !input.diagnosticWaived) {
    await recordClientPayment({
      enrollmentId: enrollment.id,
      clientId,
      stripePaymentIntentId: input.referenceId,
      amountCents: diagPaid,
      paidAt,
      notes: `${input.enrollFlow}:${input.leadSlug}`
    });
  }

  await ensureSoftwareLicenseCost(enrollment.id);

  if (!input.alreadyExisted) {
    void onEnrollmentCompleted({
      email: parentEmail,
      programLabel
    });

    void createAdminAlert({
      alertType: "new_enrollment_payment",
      severity: "info",
      title: `Post-call enroll: ${input.studentFirst ?? parentEmail}`,
      body: `${parentEmail} enrolled via ${input.leadSlug} (${input.enrollFlow}).`,
      source: "stripe",
      linkUrl: "/admin/finance",
      dedupeKey: `post_call_enroll:${input.referenceId}`
    });
  }

  const valueCents = enrollPurchaseValueCents({
    diagnosticCents: input.diagnosticCents,
    weeklyCents: input.weeklyCents,
    diagnosticWaived: Boolean(input.diagnosticWaived)
  });

  void sendEnrollPurchaseMetaCapi({
    parentEmail,
    referenceId: input.referenceId,
    leadSlug: input.leadSlug,
    enrollFlow: input.enrollFlow,
    valueCents,
    fbp: input.fbp,
    fbc: input.fbc,
    clientIp: input.clientIp,
    clientUserAgent: input.clientUserAgent
  });

  return {
    ok: true as const,
    duplicate: false as const,
    clientId,
    enrollmentId: enrollment.id,
    leadId,
    parentEmail,
    metaPurchaseEventId: enrollPurchaseEventId(input.referenceId)
  };
}
