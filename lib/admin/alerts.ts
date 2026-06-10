import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export type AdminAlertInput = {
  alertType: string;
  severity: "critical" | "warning" | "info";
  title: string;
  body?: string;
  linkUrl?: string;
  source: string;
  dedupeKey?: string;
  notify?: boolean;
};

export async function createAdminAlert(input: AdminAlertInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  if (input.dedupeKey) {
    const { data: existing } = await supabase
      .from("admin_alerts")
      .select("id")
      .eq("dedupe_key", input.dedupeKey)
      .is("acknowledged_at", null)
      .maybeSingle();
    if (existing) return { ok: true as const, duplicate: true as const, id: existing.id };
  }

  const { data, error } = await supabase
    .from("admin_alerts")
    .insert({
      alert_type: input.alertType,
      severity: input.severity,
      title: input.title,
      body: input.body ?? null,
      link_url: input.linkUrl ?? null,
      source: input.source,
      dedupe_key: input.dedupeKey ?? null
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false as const, error: error?.message ?? "alert_failed" };
  }

  if (input.notify !== false) {
    void notifyAdminAlertEmail(input);
    await supabase
      .from("admin_alerts")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", data.id);
  }

  return { ok: true as const, duplicate: false as const, id: data.id };
}

async function notifyAdminAlertEmail(input: AdminAlertInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const to =
    process.env.MARKETING_DIGEST_EMAIL?.trim() ??
    process.env.CONTACT_INBOX?.trim() ??
    site.supportEmail;

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Illuminairy <notifications@illuminairy.com>";

  const lines = [input.title, "", input.body ?? ""];
  if (input.linkUrl) lines.push("", input.linkUrl);

  await resend.emails.send({
    from,
    to: [to],
    subject: `[${input.severity.toUpperCase()}] ${input.title}`,
    text: lines.join("\n")
  });
}

export async function listOpenAlerts(limit = 50) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("admin_alerts")
    .select("*")
    .is("acknowledged_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function countOpenAlerts() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("admin_alerts")
    .select("id", { count: "exact", head: true })
    .is("acknowledged_at", null);

  return count ?? 0;
}

export async function acknowledgeAlert(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  const { error } = await supabase
    .from("admin_alerts")
    .update({ acknowledged_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
