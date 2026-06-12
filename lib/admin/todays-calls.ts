/**
 * "Today's calls" dashboard query. Returns up to 20 lead_calls whose
 * scheduled_start (or call_at fallback) falls between now and end-of-day in
 * America/New_York.
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type TodayCall = {
  callId: string;
  leadId: string | null;
  parentName: string | null;
  parentEmail: string;
  studentFirst: string | null;
  scheduledStart: string;
  scheduledEnd: string | null;
  callStatus: string;
  meetLink: string | null;
  leadScore: number | null;
  noShowRisk: boolean;
  noShowRiskReason: string | null;
  confirmedAt: string | null;
  urgencyLevel: "low" | "medium" | "high" | "critical" | null;
  urgencyReason: string | null;
};

function endOfNyDay(now: Date): Date {
  // Approximate by using ICU formatter. Returns a UTC Date corresponding to
  // 23:59:59 of "today" in the America/New_York calendar.
  const ny = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  ny.setHours(23, 59, 59, 999);
  // Convert that ICU-local date back to a UTC Date.
  const utcMs =
    ny.getTime() +
    (new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime() -
      new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getTime());
  return new Date(utcMs);
}

export async function listTodaysCalls(now = new Date()): Promise<TodayCall[]> {
  const supabase = requireSupabaseAdmin();
  const end = endOfNyDay(now).toISOString();
  const start = now.toISOString();

  const { data, error } = await supabase
    .from("lead_calls")
    .select(
      "id, lead_id, scheduled_start, scheduled_end, call_at, call_status, meet_link, no_show_risk, no_show_risk_reason, confirmed_at, leads:lead_id(parent_first, parent_last, parent_email, student_first, lead_score_current, urgency_level, urgency_reason)"
    )
    .in("call_status", ["booked", "confirmed"])
    .gte("scheduled_start", start)
    .lte("scheduled_start", end)
    .order("scheduled_start", { ascending: true })
    .limit(20);

  if (error) {
    console.warn("listTodaysCalls failed", error.message);
    return [];
  }

  return (data ?? []).map((r) => {
    const rawLead = r.leads as unknown;
    const lead = (Array.isArray(rawLead) ? rawLead[0] ?? null : rawLead) as
      | {
          parent_first: string | null;
          parent_last: string | null;
          parent_email: string;
          student_first: string | null;
          lead_score_current: number | null;
          urgency_level: TodayCall["urgencyLevel"] | null;
          urgency_reason: string | null;
        }
      | null;
    return {
      callId: r.id,
      leadId: r.lead_id,
      parentName: lead
        ? [lead.parent_first, lead.parent_last].filter(Boolean).join(" ") || null
        : null,
      parentEmail: lead?.parent_email ?? "",
      studentFirst: lead?.student_first ?? null,
      scheduledStart: r.scheduled_start ?? r.call_at,
      scheduledEnd: r.scheduled_end,
      callStatus: r.call_status,
      meetLink: r.meet_link,
      leadScore: lead?.lead_score_current ?? null,
      noShowRisk: Boolean(r.no_show_risk),
      noShowRiskReason: (r.no_show_risk_reason as string | null) ?? null,
      confirmedAt: (r.confirmed_at as string | null) ?? null,
      urgencyLevel: lead?.urgency_level ?? null,
      urgencyReason: lead?.urgency_reason ?? null
    };
  });
}
