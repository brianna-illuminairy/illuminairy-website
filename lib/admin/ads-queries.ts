import { getSupabaseAdmin } from "@/lib/supabase/server";

export type AdSpendRow = {
  spendDate: string;
  utmCampaign: string;
  utmContent: string;
  spendCents: number;
  impressions: number | null;
  clicks: number | null;
};

export async function listAdSpend(days = 30): Promise<AdSpendRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const { data } = await supabase
    .from("ad_spend_daily")
    .select("spend_date, utm_campaign, utm_content, spend_cents, impressions, clicks")
    .gte("spend_date", since.toISOString().slice(0, 10))
    .order("spend_date", { ascending: false });

  return (data ?? []).map((row) => ({
    spendDate: row.spend_date,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    spendCents: row.spend_cents,
    impressions: row.impressions,
    clicks: row.clicks
  }));
}

export async function importAdSpendCsvRows(
  rows: Array<{
    spendDate: string;
    utmCampaign: string;
    utmContent: string;
    spendCents: number;
    impressions?: number | null;
    clicks?: number | null;
  }>
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  const payload = rows.map((row) => ({
    spend_date: row.spendDate,
    utm_campaign: row.utmCampaign,
    utm_content: row.utmContent,
    spend_cents: row.spendCents,
    impressions: row.impressions ?? null,
    clicks: row.clicks ?? null,
    synced_at: new Date().toISOString()
  }));

  const { error } = await supabase.from("ad_spend_daily").upsert(payload, {
    onConflict: "spend_date,utm_campaign,utm_content"
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, count: payload.length };
}
