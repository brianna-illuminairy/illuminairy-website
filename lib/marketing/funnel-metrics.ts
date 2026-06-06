import { getSupabaseAdmin } from "@/lib/supabase/server";

export type FunnelCounts = {
  lpViews: number;
  ctaClicks: number;
  quizStarts: number;
  leads: number;
  books: number;
};

export type StepDrop = {
  step: string;
  stepIndex: number;
  visitors: number;
  dropPct: number | null;
};

export type CampaignRow = {
  utmCampaign: string;
  pageViews: number;
  ctaClicks: number;
  quizStarts: number;
  leads: number;
  books: number;
  ctaRatePct: number | null;
  leadRatePct: number | null;
};

function daysAgoIso(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

async function countTouches(
  eventType: string,
  since: string,
  extra?: { path?: string }
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;

  let q = supabase
    .from("touch_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", eventType)
    .gte("created_at", since);

  if (extra?.path) {
    q = q.eq("path", extra.path);
  }

  const { count, error } = await q;
  if (error) {
    console.error("countTouches", eventType, error);
    return 0;
  }
  return count ?? 0;
}

export async function getFunnelCounts(days = 7): Promise<FunnelCounts> {
  const since = daysAgoIso(days);
  const [lpViews, ctaClicks, quizStarts, leads, books] = await Promise.all([
    countTouches("page_view", since, { path: "/" }),
    countTouches("funnel_cta_click", since),
    countTouches("quiz_started", since),
    countTouches("quiz_lead_submitted", since),
    countTouches("call_booked", since)
  ]);
  return { lpViews, ctaClicks, quizStarts, leads, books };
}

export async function getStepDropoffs(days = 7): Promise<StepDrop[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = daysAgoIso(days);
  const { data, error } = await supabase
    .from("touch_events")
    .select("payload, visitor_id")
    .eq("event_type", "quiz_step_view")
    .gte("created_at", since)
    .not("visitor_id", "is", null);

  if (error || !data) return [];

  const byStep = new Map<string, { index: number; visitors: Set<string> }>();
  for (const row of data) {
    const payload = row.payload as { step?: string; step_index?: number };
    const step = payload.step;
    if (!step || !row.visitor_id) continue;
    const idx = payload.step_index ?? 0;
    const entry = byStep.get(step) ?? { index: idx, visitors: new Set() };
    entry.visitors.add(row.visitor_id);
    byStep.set(step, entry);
  }

  const sorted = Array.from(byStep.entries())
    .map(([step, { index, visitors }]) => ({
      step,
      stepIndex: index,
      visitors: visitors.size
    }))
    .sort((a, b) => a.stepIndex - b.stepIndex);

  const out: StepDrop[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = sorted[i - 1];
    const dropPct =
      prev && prev.visitors > 0
        ? Math.round(1000 * (1 - curr.visitors / prev.visitors)) / 10
        : null;
    out.push({ ...curr, dropPct });
  }
  return out;
}

export async function getCampaignRows(days = 30): Promise<CampaignRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = daysAgoIso(days);
  const { data, error } = await supabase
    .from("touch_events")
    .select("event_type, utm_campaign")
    .gte("created_at", since);

  if (error || !data) return [];

  const map = new Map<
    string,
    { pageViews: number; ctaClicks: number; quizStarts: number; leads: number; books: number }
  >();

  for (const row of data) {
    const camp = row.utm_campaign?.trim() || "(none)";
    const bucket = map.get(camp) ?? {
      pageViews: 0,
      ctaClicks: 0,
      quizStarts: 0,
      leads: 0,
      books: 0
    };
    switch (row.event_type) {
      case "page_view":
        bucket.pageViews++;
        break;
      case "funnel_cta_click":
        bucket.ctaClicks++;
        break;
      case "quiz_started":
        bucket.quizStarts++;
        break;
      case "quiz_lead_submitted":
        bucket.leads++;
        break;
      case "call_booked":
        bucket.books++;
        break;
      default:
        break;
    }
    map.set(camp, bucket);
  }

  return Array.from(map.entries())
    .map(([utmCampaign, c]) => ({
      utmCampaign,
      ...c,
      ctaRatePct:
        c.pageViews > 0
          ? Math.round((1000 * c.ctaClicks) / c.pageViews) / 10
          : null,
      leadRatePct:
        c.quizStarts > 0
          ? Math.round((1000 * c.leads) / c.quizStarts) / 10
          : null
    }))
    .sort((a, b) => b.pageViews - a.pageViews);
}

export async function getAnonymousAbandonCount(days = 7) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;

  const since = daysAgoIso(days);
  const { count, error } = await supabase
    .from("visitors")
    .select("id", { count: "exact", head: true })
    .gte("quiz_furthest_step_index", 3)
    .gte("last_seen_at", since);

  if (error) {
    if (error.code === "42P01") return 0;
    return 0;
  }
  return count ?? 0;
}
