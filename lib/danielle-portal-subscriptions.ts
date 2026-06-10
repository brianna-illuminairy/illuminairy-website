import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getDanielleNotifyRegistry } from "@/lib/danielle-notify-registry";
import { normalizeDaniellePhone } from "@/lib/danielle-phone";

export type DanielleNotifySubscription = {
  email: string;
  phone: string | null;
  emailOptIn: boolean;
  smsOptIn: boolean;
  smsOptInAt: string | null;
};

type SubscriptionRow = {
  email: string;
  phone: string | null;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  sms_opt_in_at: string | null;
};

function mapRow(row: SubscriptionRow): DanielleNotifySubscription {
  return {
    email: row.email,
    phone: row.phone,
    emailOptIn: row.email_opt_in,
    smsOptIn: row.sms_opt_in,
    smsOptInAt: row.sms_opt_in_at
  };
}

export function isDanielleNotifyConfigured() {
  return Boolean(getSupabaseAdmin());
}

export async function getDanielleNotifySubscription(
  email: string
): Promise<DanielleNotifySubscription | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("danielle_portal_notify_subscriptions")
    .select("email, phone, email_opt_in, sms_opt_in, sms_opt_in_at")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRow(data as SubscriptionRow);
}

export async function upsertDanielleNotifySubscription(input: {
  email: string;
  phone?: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "notify_not_configured" };
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  let phone: string | null = null;
  if (input.phone?.trim()) {
    phone = normalizeDaniellePhone(input.phone);
    if (!phone) {
      return { ok: false as const, error: "invalid_phone" };
    }
  }

  if (input.smsOptIn && !phone) {
    return { ok: false as const, error: "phone_required_for_sms" };
  }

  const existing = await getDanielleNotifySubscription(normalizedEmail);
  const smsOptInAt =
    input.smsOptIn && !existing?.smsOptIn ? new Date().toISOString() : existing?.smsOptInAt ?? null;

  const { error } = await supabase.from("danielle_portal_notify_subscriptions").upsert(
    {
      email: normalizedEmail,
      phone,
      email_opt_in: input.emailOptIn,
      sms_opt_in: input.smsOptIn,
      sms_opt_in_at: input.smsOptIn ? smsOptInAt : null,
      updated_at: new Date().toISOString()
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("danielle notify subscription upsert:", error);
    return { ok: false as const, error: "save_failed" };
  }

  return { ok: true as const };
}

export async function syncDanielleNotifyRegistry() {
  const entries = getDanielleNotifyRegistry();
  const results = [];

  for (const entry of entries) {
    const saved = await upsertDanielleNotifySubscription({
      email: entry.email,
      phone: entry.phone ?? undefined,
      emailOptIn: true,
      smsOptIn: Boolean(entry.phone)
    });
    results.push({ email: entry.email, ...saved });
  }

  return results;
}

export async function listDanielleNotifySubscribers() {
  await syncDanielleNotifyRegistry();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("danielle_portal_notify_subscriptions")
    .select("email, phone, email_opt_in, sms_opt_in, sms_opt_in_at")
    .or("email_opt_in.eq.true,sms_opt_in.eq.true");

  if (error || !data) {
    return [];
  }

  return (data as SubscriptionRow[]).map(mapRow);
}

export async function wasDanielleUpdateDelivered(
  updateId: string,
  email: string,
  channel: "email" | "sms"
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const { data } = await supabase
    .from("danielle_portal_notify_deliveries")
    .select("id")
    .eq("update_id", updateId)
    .eq("email", email)
    .eq("channel", channel)
    .maybeSingle();

  return Boolean(data);
}

export async function recordDanielleUpdateDelivery(
  updateId: string,
  email: string,
  channel: "email" | "sms"
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return;
  }

  await supabase.from("danielle_portal_notify_deliveries").upsert(
    {
      update_id: updateId,
      email,
      channel,
      sent_at: new Date().toISOString()
    },
    { onConflict: "update_id,email,channel" }
  );
}
