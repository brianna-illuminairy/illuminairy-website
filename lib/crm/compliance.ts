/**
 * Compliance helpers — quiet hours, OOO mode, suppression check.
 *
 * Used by Phase 6's Gemini draft creator (and any future auto-send code) to
 * decide whether outbound messages are allowed at this moment for this lead.
 *
 * Quiet hours and OOO are global (one inbox, one owner). Suppression is per
 * identifier (email / phone).
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";
import { isSuppressed } from "@/lib/crm/suppression";

export type QuietHoursConfig = {
  startHourLocal: number;
  endHourLocal: number;
  defaultTimezone: string;
};

export type OooPeriod = {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string | null;
};

export async function getQuietHours(): Promise<QuietHoursConfig> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("quiet_hours_config")
    .select("start_hour_local, end_hour_local, default_timezone")
    .eq("id", 1)
    .maybeSingle();
  return {
    startHourLocal: data?.start_hour_local ?? 21,
    endHourLocal: data?.end_hour_local ?? 8,
    defaultTimezone: data?.default_timezone ?? "America/New_York"
  };
}

export async function setQuietHours(cfg: QuietHoursConfig): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("quiet_hours_config")
    .upsert(
      {
        id: 1,
        start_hour_local: cfg.startHourLocal,
        end_hour_local: cfg.endHourLocal,
        default_timezone: cfg.defaultTimezone,
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );
}

export async function listOoo(includePast = false): Promise<OooPeriod[]> {
  const supabase = requireSupabaseAdmin();
  let q = supabase
    .from("ooo_periods")
    .select("id, starts_at, ends_at, reason")
    .order("starts_at", { ascending: false });
  if (!includePast) {
    q = q.gte("ends_at", new Date().toISOString());
  }
  const { data } = await q;
  return (data ?? []).map((r) => ({
    id: r.id,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    reason: r.reason
  }));
}

export async function createOoo(args: {
  startsAt: string;
  endsAt: string;
  reason?: string;
}): Promise<OooPeriod | null> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("ooo_periods")
    .insert({
      starts_at: args.startsAt,
      ends_at: args.endsAt,
      reason: args.reason ?? null
    })
    .select("id, starts_at, ends_at, reason")
    .single();
  return data
    ? { id: data.id, startsAt: data.starts_at, endsAt: data.ends_at, reason: data.reason }
    : null;
}

export async function deleteOoo(id: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase.from("ooo_periods").delete().eq("id", id);
}

export async function inOooMode(now = new Date()): Promise<OooPeriod | null> {
  const supabase = requireSupabaseAdmin();
  const nowIso = now.toISOString();
  const { data } = await supabase
    .from("ooo_periods")
    .select("id, starts_at, ends_at, reason")
    .lte("starts_at", nowIso)
    .gte("ends_at", nowIso)
    .order("ends_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data
    ? { id: data.id, startsAt: data.starts_at, endsAt: data.ends_at, reason: data.reason }
    : null;
}

export async function inQuietHours(now = new Date()): Promise<boolean> {
  const cfg = await getQuietHours();
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: cfg.defaultTimezone,
      hour: "numeric",
      hour12: false
    }).format(now),
    10
  );
  if (cfg.startHourLocal <= cfg.endHourLocal) {
    return hour >= cfg.startHourLocal && hour < cfg.endHourLocal;
  }
  // Window spans midnight (e.g. 21 -> 8).
  return hour >= cfg.startHourLocal || hour < cfg.endHourLocal;
}

/**
 * One-stop check: should the system send an automated message to this
 * identifier RIGHT NOW? Returns a tuple [allowed, reason].
 *
 * Use this from any future auto-send path. The Phase 6 draft creator already
 * skips sending — it only creates drafts — so this is mostly defensive.
 */
export async function canAutomateSend(args: {
  channel: "email" | "sms";
  identifier: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (await isSuppressed({ channel: args.channel, identifier: args.identifier })) {
    return { ok: false, reason: "suppressed" };
  }
  if (await inOooMode()) {
    return { ok: false, reason: "ooo" };
  }
  if (args.channel === "sms" && (await inQuietHours())) {
    return { ok: false, reason: "quiet_hours" };
  }
  return { ok: true };
}

export type SuppressionRow = {
  id: string;
  channel: "email" | "sms" | "all";
  identifier: string;
  reason: string;
  reasonDetail: string | null;
  addedAt: string;
  addedBy: string | null;
};

export async function listSuppression(opts?: { limit?: number }): Promise<SuppressionRow[]> {
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("suppression_list")
    .select("id, channel, identifier, reason, reason_detail, added_at, added_by")
    .order("added_at", { ascending: false })
    .limit(opts?.limit ?? 500);
  return (data ?? []).map((r) => ({
    id: r.id,
    channel: r.channel,
    identifier: r.identifier,
    reason: r.reason,
    reasonDetail: r.reason_detail,
    addedAt: r.added_at,
    addedBy: r.added_by
  }));
}

export async function removeSuppression(id: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase.from("suppression_list").delete().eq("id", id);
}
