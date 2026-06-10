import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Per-client software license — SSOT for finance module. */
export const SOFTWARE_LICENSE_CENTS = 10_000;

export type EnrollmentEconomics = {
  enrollmentId: string;
  clientId: string;
  parentEmail: string;
  studentName: string;
  revenueCents: number;
  costCents: number;
  marginCents: number;
  loggedMinutes: number;
};

export async function recordClientPayment(input: {
  enrollmentId?: string | null;
  clientId?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  amountCents: number;
  paidAt?: string;
  source?: string;
  notes?: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  if (input.stripeCheckoutSessionId) {
    const { data: existing } = await supabase
      .from("client_payments")
      .select("id")
      .eq("stripe_checkout_session_id", input.stripeCheckoutSessionId)
      .maybeSingle();
    if (existing) return { ok: true as const, duplicate: true as const, id: existing.id };
  }

  if (input.stripePaymentIntentId) {
    const { data: existing } = await supabase
      .from("client_payments")
      .select("id")
      .eq("stripe_payment_intent_id", input.stripePaymentIntentId)
      .maybeSingle();
    if (existing) return { ok: true as const, duplicate: true as const, id: existing.id };
  }

  const { data, error } = await supabase
    .from("client_payments")
    .insert({
      enrollment_id: input.enrollmentId ?? null,
      client_id: input.clientId ?? null,
      stripe_checkout_session_id: input.stripeCheckoutSessionId ?? null,
      stripe_payment_intent_id: input.stripePaymentIntentId ?? null,
      amount_cents: input.amountCents,
      paid_at: input.paidAt ?? new Date().toISOString(),
      source: input.source ?? "stripe",
      notes: input.notes ?? null
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false as const, error: error?.message ?? "payment_failed" };
  }
  return { ok: true as const, duplicate: false as const, id: data.id };
}

export async function ensureSoftwareLicenseCost(enrollmentId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("client_costs")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("cost_type", "software_license")
    .maybeSingle();

  if (existing) return;

  await supabase.from("client_costs").insert({
    enrollment_id: enrollmentId,
    cost_type: "software_license",
    amount_cents: SOFTWARE_LICENSE_CENTS,
    notes: "Client software license"
  });
}

export async function getEnrollmentEconomicsList(): Promise<EnrollmentEconomics[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, client_id, student_id");

  if (!enrollments?.length) return [];

  const clientIds = Array.from(new Set(enrollments.map((e) => e.client_id)));
  const studentIds = Array.from(new Set(enrollments.map((e) => e.student_id)));
  const ids = enrollments.map((e) => e.id);

  const [clientsRes, studentsRes, paymentsRes, costsRes, timeRes] = await Promise.all([
    supabase.from("clients").select("id, parent_email").in("id", clientIds),
    supabase.from("students").select("id, first_name, last_name").in("id", studentIds),
    supabase.from("client_payments").select("enrollment_id, amount_cents").in("enrollment_id", ids),
    supabase.from("client_costs").select("enrollment_id, amount_cents").in("enrollment_id", ids),
    supabase
      .from("client_time_logs")
      .select("enrollment_id, duration_minutes")
      .in("enrollment_id", ids)
  ]);

  const clientById = new Map((clientsRes.data ?? []).map((c) => [c.id, c]));
  const studentById = new Map((studentsRes.data ?? []).map((s) => [s.id, s]));

  const revenueByEnrollment = new Map<string, number>();
  for (const row of paymentsRes.data ?? []) {
    if (!row.enrollment_id) continue;
    revenueByEnrollment.set(
      row.enrollment_id,
      (revenueByEnrollment.get(row.enrollment_id) ?? 0) + row.amount_cents
    );
  }

  const costByEnrollment = new Map<string, number>();
  for (const row of costsRes.data ?? []) {
    costByEnrollment.set(
      row.enrollment_id,
      (costByEnrollment.get(row.enrollment_id) ?? 0) + row.amount_cents
    );
  }

  const minutesByEnrollment = new Map<string, number>();
  for (const row of timeRes.data ?? []) {
    minutesByEnrollment.set(
      row.enrollment_id,
      (minutesByEnrollment.get(row.enrollment_id) ?? 0) + row.duration_minutes
    );
  }

  return enrollments.map((e) => {
    const client = clientById.get(e.client_id);
    const student = studentById.get(e.student_id);
    const revenue = revenueByEnrollment.get(e.id) ?? 0;
    const costs = costByEnrollment.get(e.id) ?? 0;
    return {
      enrollmentId: e.id,
      clientId: e.client_id,
      parentEmail: client?.parent_email ?? "",
      studentName: [student?.first_name, student?.last_name].filter(Boolean).join(" "),
      revenueCents: revenue,
      costCents: costs,
      marginCents: revenue - costs,
      loggedMinutes: minutesByEnrollment.get(e.id) ?? 0
    };
  });
}
