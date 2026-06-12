import { isInternalCrmEmail } from "@/lib/admin/internal-emails";
import { collapseAnswerAliases } from "@/lib/admin/quiz-answer-labels";
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
  nextFollowupAt: string | null;
  nextFollowupNote: string | null;
  lastActivityAt: string | null;
  convertedClientId: string | null;
  convertedAt: string | null;
  salesNotes: string | null;
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

export async function listCrmLeads(limit = 200): Promise<CrmLeadRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, parent_last, student_first, stage, funnel, utm_campaign, booked_call_at, attended_at, created_at, next_followup_at, next_followup_note, last_activity_at, converted_client_id, converted_at, sales_notes"
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
      createdAt: l.created_at,
      nextFollowupAt: l.next_followup_at ?? null,
      nextFollowupNote: l.next_followup_note ?? null,
      lastActivityAt: l.last_activity_at ?? null,
      convertedClientId: l.converted_client_id ?? null,
      convertedAt: l.converted_at ?? null,
      salesNotes: l.sales_notes ?? null
    }));
}

export type LeadDetail = {
  lead: Record<string, unknown> & {
    id: string;
    parent_email: string;
    converted_client_id: string | null;
  };
  touches: Array<{
    id: string;
    event_type: string;
    created_at: string;
    payload: Record<string, unknown>;
    source: string | null;
  }>;
  quizAnswers: Record<string, unknown>;
  client: {
    id: string;
    parent_email: string;
    status: string;
  } | null;
};

export async function getCrmLeadDetail(id: string): Promise<LeadDetail | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) return null;

  const { data: touches } = await supabase
    .from("touch_events")
    .select("id, event_type, created_at, payload, source")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(80);

  const allTouches = (touches ?? []) as LeadDetail["touches"];

  // Build the answers map from three sources, oldest -> newest so later writes win.
  //   1. Touch events (best-effort, captures in-progress drops)
  //   2. lead.additional_context JSON (funnel metadata like sat_lp_variant)
  //   3. lead.quiz_answers column (canonical structured snapshot at submission)
  const quizAnswers: Record<string, unknown> = {};

  for (let i = allTouches.length - 1; i >= 0; i--) {
    const t = allTouches[i];
    if (t.event_type !== "quiz_step_view" && t.event_type !== "quiz_lead_submitted") {
      continue;
    }
    const payload = t.payload ?? {};
    const answers = (payload as { answers?: Record<string, unknown> }).answers;
    if (answers && typeof answers === "object") {
      Object.assign(quizAnswers, answers);
    }
    const step = (payload as { step?: string }).step;
    const value = (payload as { value?: unknown }).value;
    if (step && value !== undefined && value !== null && value !== "") {
      quizAnswers[step] = value;
    }
  }

  const leadRow = lead as {
    quiz_answers?: Record<string, unknown> | null;
    additional_context?: string | null;
  };

  if (typeof leadRow.additional_context === "string") {
    try {
      const parsed = JSON.parse(leadRow.additional_context);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        Object.assign(quizAnswers, parsed as Record<string, unknown>);
      }
    } catch {
      // Older rows may not be JSON; ignore.
    }
  }

  if (
    leadRow.quiz_answers &&
    typeof leadRow.quiz_answers === "object" &&
    !Array.isArray(leadRow.quiz_answers)
  ) {
    Object.assign(quizAnswers, leadRow.quiz_answers);
  }

  const mergedAnswers = collapseAnswerAliases(quizAnswers);

  let client: LeadDetail["client"] = null;
  const convertedClientId = (lead as { converted_client_id?: string | null })
    .converted_client_id;
  if (convertedClientId) {
    const { data: c } = await supabase
      .from("clients")
      .select("id, parent_email, status")
      .eq("id", convertedClientId)
      .maybeSingle();
    if (c) client = c as LeadDetail["client"];
  }

  return {
    lead: lead as LeadDetail["lead"],
    touches: allTouches,
    quizAnswers: mergedAnswers,
    client
  };
}

export type LeadFollowupRow = {
  id: string;
  parentEmail: string;
  parentFirst: string | null;
  parentLast: string | null;
  studentFirst: string | null;
  stage: string;
  nextFollowupAt: string;
  nextFollowupNote: string | null;
};

export async function listLeadsDueToday(): Promise<LeadFollowupRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  // Anything with a followup at or before end-of-today UTC, excluding closed stages.
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const { data } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, parent_last, student_first, stage, next_followup_at, next_followup_note"
    )
    .not("next_followup_at", "is", null)
    .lte("next_followup_at", endOfDay.toISOString())
    .not("stage", "in", "(won,lost)")
    .order("next_followup_at", { ascending: true });

  return (data ?? [])
    .filter((l) => !isInternalCrmEmail(l.parent_email))
    .map((l) => ({
      id: l.id,
      parentEmail: l.parent_email,
      parentFirst: l.parent_first,
      parentLast: l.parent_last,
      studentFirst: l.student_first,
      stage: l.stage,
      nextFollowupAt: l.next_followup_at,
      nextFollowupNote: l.next_followup_note
    }));
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
