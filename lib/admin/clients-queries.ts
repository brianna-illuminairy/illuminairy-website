import { isInternalCrmEmail } from "@/lib/admin/internal-emails";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type ClientListRow = {
  id: string;
  parentEmail: string;
  parentFirst: string | null;
  parentLast: string | null;
  status: string;
  createdAt: string;
  leadId: string | null;
  studentNames: string[];
  programLabel: string | null;
  paidAt: string | null;
  paymentTotalCents: number;
  weeklyReportEmailOptIn: boolean;
  weeklyReportSmsOptIn: boolean;
  sourceUtmCampaign: string | null;
};

export type ClientDetail = {
  client: Record<string, unknown> & {
    id: string;
    parent_email: string;
    lead_id: string | null;
  };
  students: Array<{
    id: string;
    first_name: string;
    last_name: string | null;
    grade: string | null;
    school: string | null;
  }>;
  enrollments: Array<{
    id: string;
    student_id: string;
    program: string;
    program_label: string | null;
    status: string;
    tutor_assigned: string | null;
    baseline_score: string | null;
    target_score: string | null;
    program_start_date: string | null;
    amount_paid_cents: number | null;
    paid_at: string | null;
    stripe_checkout_session_id: string | null;
    created_at: string;
  }>;
  payments: Array<{
    id: string;
    amount_cents: number;
    paid_at: string;
    source: string;
    notes: string | null;
  }>;
  lead: { id: string; parent_email: string; stage: string } | null;
  touches: Array<{
    id: string;
    event_type: string;
    created_at: string;
    payload: Record<string, unknown>;
    source: string | null;
  }>;
};

export async function listCrmClients(limit = 200): Promise<ClientListRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: clients } = await supabase
    .from("clients")
    .select(
      "id, parent_email, parent_first, parent_last, status, created_at, lead_id, weekly_report_email_opt_in, weekly_report_sms_opt_in"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  const external = (clients ?? []).filter(
    (c) => !isInternalCrmEmail(c.parent_email)
  );
  if (external.length === 0) return [];

  const ids = external.map((c) => c.id);
  const leadIds = external.map((c) => c.lead_id).filter(Boolean) as string[];

  const [studentsRes, enrollmentsRes, paymentsRes, leadsRes] = await Promise.all([
    supabase.from("students").select("id, client_id, first_name").in("client_id", ids),
    supabase
      .from("enrollments")
      .select("client_id, program_label, paid_at, status")
      .in("client_id", ids)
      .order("paid_at", { ascending: false }),
    supabase
      .from("client_payments")
      .select("client_id, amount_cents")
      .in("client_id", ids),
    leadIds.length
      ? supabase.from("leads").select("id, utm_campaign").in("id", leadIds)
      : Promise.resolve({ data: [] as Array<{ id: string; utm_campaign: string | null }> })
  ]);

  const studentsByClient = new Map<string, string[]>();
  for (const s of studentsRes.data ?? []) {
    const arr = studentsByClient.get(s.client_id) ?? [];
    arr.push(s.first_name);
    studentsByClient.set(s.client_id, arr);
  }

  const enrollmentByClient = new Map<
    string,
    { programLabel: string | null; paidAt: string | null }
  >();
  for (const e of enrollmentsRes.data ?? []) {
    if (!enrollmentByClient.has(e.client_id)) {
      enrollmentByClient.set(e.client_id, {
        programLabel: e.program_label,
        paidAt: e.paid_at
      });
    }
  }

  const paymentTotalByClient = new Map<string, number>();
  for (const p of paymentsRes.data ?? []) {
    paymentTotalByClient.set(
      p.client_id,
      (paymentTotalByClient.get(p.client_id) ?? 0) + (p.amount_cents ?? 0)
    );
  }

  const campaignByLead = new Map<string, string | null>();
  for (const l of leadsRes.data ?? []) {
    campaignByLead.set(l.id, l.utm_campaign);
  }

  return external.map((c) => ({
    id: c.id,
    parentEmail: c.parent_email,
    parentFirst: c.parent_first,
    parentLast: c.parent_last,
    status: c.status,
    createdAt: c.created_at,
    leadId: c.lead_id,
    studentNames: studentsByClient.get(c.id) ?? [],
    programLabel: enrollmentByClient.get(c.id)?.programLabel ?? null,
    paidAt: enrollmentByClient.get(c.id)?.paidAt ?? null,
    paymentTotalCents: paymentTotalByClient.get(c.id) ?? 0,
    weeklyReportEmailOptIn: !!c.weekly_report_email_opt_in,
    weeklyReportSmsOptIn: !!c.weekly_report_sms_opt_in,
    sourceUtmCampaign: c.lead_id ? campaignByLead.get(c.lead_id) ?? null : null
  }));
}

export async function getClientDetail(id: string): Promise<ClientDetail | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!client) return null;

  const leadId = (client as { lead_id?: string | null }).lead_id ?? null;

  const [studentsRes, enrollmentsRes, paymentsRes, leadRes, clientTouchesRes, leadTouchesRes] =
    await Promise.all([
      supabase
        .from("students")
        .select("id, first_name, last_name, grade, school")
        .eq("client_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("enrollments")
        .select(
          "id, student_id, program, program_label, status, tutor_assigned, baseline_score, target_score, program_start_date, amount_paid_cents, paid_at, stripe_checkout_session_id, created_at"
        )
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("client_payments")
        .select("id, amount_cents, paid_at, source, notes")
        .eq("client_id", id)
        .order("paid_at", { ascending: false }),
      leadId
        ? supabase
            .from("leads")
            .select("id, parent_email, stage")
            .eq("id", leadId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("touch_events")
        .select("id, event_type, created_at, payload, source")
        .eq("client_id", id)
        .order("created_at", { ascending: false })
        .limit(120),
      leadId
        ? supabase
            .from("touch_events")
            .select("id, event_type, created_at, payload, source")
            .eq("lead_id", leadId)
            .order("created_at", { ascending: false })
            .limit(120)
        : Promise.resolve({ data: [] as ClientDetail["touches"] })
    ]);

  // Merge + dedupe touches across the lead_id and client_id sides.
  const merged = new Map<string, ClientDetail["touches"][number]>();
  for (const t of (clientTouchesRes.data ?? []) as ClientDetail["touches"]) {
    merged.set(t.id, t);
  }
  for (const t of (leadTouchesRes.data ?? []) as ClientDetail["touches"]) {
    merged.set(t.id, t);
  }
  const touches = Array.from(merged.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    client: client as ClientDetail["client"],
    students: (studentsRes.data ?? []) as ClientDetail["students"],
    enrollments: (enrollmentsRes.data ?? []) as ClientDetail["enrollments"],
    payments: (paymentsRes.data ?? []) as ClientDetail["payments"],
    lead: (leadRes.data ?? null) as ClientDetail["lead"],
    touches
  };
}

export async function updateClientOpsNotes(
  id: string,
  opsNotes: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "supabase_not_configured" };
  const { error } = await supabase
    .from("clients")
    .update({ ops_notes: opsNotes })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
