import { isInternalCrmEmail } from "@/lib/admin/internal-emails";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type CrmLeadRow = {
  id: string;
  parentEmail: string;
  parentFirst: string | null;
  parentLast: string | null;
  studentFirst: string | null;
  stage: string;
  funnel: string;
  utmCampaign: string | null;
  bookedCallAt: string | null;
  attendedAt: string | null;
  createdAt: string;
};

export type CrmPipelineStats = {
  byStage: Record<string, number>;
  bookRatePct: number | null;
  showRatePct: number | null;
  noShowCount: number;
  totalLeads: number;
};

function pct(num: number, den: number) {
  if (den <= 0) return null;
  return Math.round((1000 * num) / den) / 10;
}

export async function getCrmPipelineStats(): Promise<CrmPipelineStats> {
  const supabase = getSupabaseAdmin();
  const empty: CrmPipelineStats = {
    byStage: {},
    bookRatePct: null,
    showRatePct: null,
    noShowCount: 0,
    totalLeads: 0
  };
  if (!supabase) return empty;

  const { data: leads } = await supabase
    .from("leads")
    .select("stage, parent_email, booked_call_at, attended_at");

  const filtered = (leads ?? []).filter((l) => !isInternalCrmEmail(l.parent_email));

  const byStage: Record<string, number> = {};
  let booked = 0;
  let attended = 0;
  let noShow = 0;
  const now = Date.now();

  for (const lead of filtered) {
    byStage[lead.stage] = (byStage[lead.stage] ?? 0) + 1;
    if (lead.booked_call_at) {
      booked++;
      if (lead.attended_at) attended++;
      else if (new Date(lead.booked_call_at).getTime() < now && lead.stage === "call_booked") {
        noShow++;
      }
    }
  }

  const total = filtered.length;
  const submitted = byStage["intake_submitted"] ?? 0;
  const leadsWithBook = booked;

  return {
    byStage,
    bookRatePct: pct(leadsWithBook, total - (byStage["lost"] ?? 0)),
    showRatePct: pct(attended, booked),
    noShowCount: noShow,
    totalLeads: total
  };
}

export async function listCrmLeads(limit = 100): Promise<CrmLeadRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, parent_last, student_first, stage, funnel, utm_campaign, booked_call_at, attended_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .filter((l) => !isInternalCrmEmail(l.parent_email))
    .map((l) => ({
      id: l.id,
      parentEmail: l.parent_email,
      parentFirst: l.parent_first,
      parentLast: l.parent_last,
      studentFirst: l.student_first,
      stage: l.stage,
      funnel: l.funnel,
      utmCampaign: l.utm_campaign,
      bookedCallAt: l.booked_call_at,
      attendedAt: l.attended_at,
      createdAt: l.created_at
    }));
}

export async function getCrmLeadDetail(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) return null;

  const { data: touches } = await supabase
    .from("touch_events")
    .select("id, event_type, created_at, payload, source")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(40);

  return { lead, touches: touches ?? [] };
}

export async function getOverviewKpis() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { leads: 0, books: 0, enrollments: 0, clients: 0, openAlerts: 0 };
  }

  const { data: leads } = await supabase.from("leads").select("parent_email, stage");
  const externalLeads = (leads ?? []).filter((l) => !isInternalCrmEmail(l.parent_email));

  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { count: clientCount } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true });

  const books = externalLeads.filter((l) =>
    ["call_booked", "call_attended", "won"].includes(l.stage)
  ).length;

  const { count: alertCount } = await supabase
    .from("admin_alerts")
    .select("id", { count: "exact", head: true })
    .is("acknowledged_at", null);

  return {
    leads: externalLeads.length,
    books,
    enrollments: enrollmentCount ?? 0,
    clients: clientCount ?? 0,
    openAlerts: alertCount ?? 0
  };
}
