import { createAdminAlert } from "@/lib/admin/alerts";
import { recordClientPayment } from "@/lib/crm/economics";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type Stripe from "stripe";

type InvoiceWithRelations = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
  payment_intent?: string | Stripe.PaymentIntent | null;
};

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const raw = invoice as InvoiceWithRelations;
  const sub = raw.subscription;
  if (typeof sub === "string") return sub;
  if (sub && typeof sub === "object" && "id" in sub) return sub.id;
  return null;
}

function invoicePaymentIntentId(invoice: Stripe.Invoice): string | null {
  const raw = invoice as InvoiceWithRelations;
  const pi = raw.payment_intent;
  if (typeof pi === "string") return pi;
  if (pi && typeof pi === "object" && "id" in pi) return pi.id;
  return null;
}

export function parentEmailFromPaymentIntent(pi: Stripe.PaymentIntent) {
  return (
    pi.metadata?.parentEmail ??
    pi.metadata?.parent_email ??
    pi.receipt_email ??
    ""
  )
    .trim()
    .toLowerCase();
}

export async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  const amountCents = pi.amount ?? 0;
  const parentEmail = parentEmailFromPaymentIntent(pi);

  let enrollmentId: string | null = null;
  let clientId: string | null = null;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: byPi } = await supabase
      .from("enrollments")
      .select("id, client_id")
      .eq("stripe_payment_intent_id", pi.id)
      .maybeSingle();

    if (byPi) {
      enrollmentId = byPi.id;
      clientId = byPi.client_id;
    } else if (parentEmail) {
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("parent_email", parentEmail)
        .maybeSingle();

      if (client) {
        clientId = client.id;
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        enrollmentId = enrollment?.id ?? null;
      }
    }
  }

  const paymentResult = await recordClientPayment({
    enrollmentId,
    clientId,
    stripePaymentIntentId: pi.id,
    amountCents,
    paidAt: new Date(pi.created * 1000).toISOString(),
    notes: parentEmail || undefined
  });

  if (paymentResult.ok && !paymentResult.duplicate) {
    void createAdminAlert({
      alertType: "stripe_payment",
      severity: "info",
      title: `Stripe payment: $${(amountCents / 100).toFixed(2)}`,
      body: parentEmail || pi.id,
      source: "stripe",
      linkUrl: "/admin/finance",
      dedupeKey: `pi:${pi.id}`
    });
  }
}

async function findEnrollmentBySubscriptionId(subscriptionId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: byColumn } = await supabase
    .from("enrollments")
    .select("id, client_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (byColumn) return byColumn;

  const { data: byJson } = await supabase
    .from("enrollments")
    .select("id, client_id")
    .filter("intake_details->>stripe_subscription_id", "eq", subscriptionId)
    .maybeSingle();

  return byJson;
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoiceSubscriptionId(invoice);

  if (!subscriptionId || (invoice.amount_paid ?? 0) <= 0) return;

  const enrollment = await findEnrollmentBySubscriptionId(subscriptionId);
  if (!enrollment) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const noteKey = `stripe_invoice:${invoice.id}`;
  const { data: existing } = await supabase
    .from("client_payments")
    .select("id")
    .eq("enrollment_id", enrollment.id)
    .eq("notes", noteKey)
    .maybeSingle();

  if (existing) return;

  const piId = invoicePaymentIntentId(invoice);

  await recordClientPayment({
    enrollmentId: enrollment.id,
    clientId: enrollment.client_id,
    stripePaymentIntentId: piId,
    amountCents: invoice.amount_paid ?? 0,
    paidAt: new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000).toISOString(),
    source: "stripe_invoice",
    notes: noteKey
  });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoiceSubscriptionId(invoice);

  if (!subscriptionId) return;

  void createAdminAlert({
    alertType: "stripe_payment_failed",
    severity: "warning",
    title: `Weekly invoice failed: $${((invoice.amount_due ?? 0) / 100).toFixed(2)}`,
    body: subscriptionId,
    source: "stripe",
    linkUrl: "/admin/finance",
    dedupeKey: `invoice_failed:${invoice.id}`
  });
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const enrollment = await findEnrollmentBySubscriptionId(subscription.id);
  if (!enrollment) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  let status: "active" | "pending_payment" | "canceled" | "completed" = "active";
  if (
    subscription.status === "canceled" ||
    subscription.status === "unpaid" ||
    subscription.status === "incomplete_expired"
  ) {
    status = "canceled";
  } else if (
    subscription.status === "trialing" ||
    subscription.status === "active"
  ) {
    status = "active";
  } else {
    status = "pending_payment";
  }

  await supabase
    .from("enrollments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", enrollment.id);
}
