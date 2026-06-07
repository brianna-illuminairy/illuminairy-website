import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SAT_PARENT_LP_PATHS } from "@/lib/plan-builder-routes";

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

export type CreativeRow = {
  utmContent: string;
  utmCampaign: string;
  pageViews: number;
  ctaClicks: number;
  quizStarts: number;
  leads: number;
  books: number;
  ctaRatePct: number | null;
  leadRatePct: number | null;
};

async function countTouches(
  eventType: string,
  since: string,
  extra?: { path?: string; paths?: readonly string[] }
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
  } else if (extra?.paths?.length) {
    q = q.in("path", [...extra.paths]);
  }

  const { count, error } = await q;
  if (error) {
    console.error("countTouches", eventType, error);
    return 0;
  }
  return count ?? 0;
}

async function countLandingPageViews(since: string) {
  return countTouches("page_view", since, { paths: SAT_PARENT_LP_PATHS });
}

export async function getFunnelCounts(days = 7): Promise<FunnelCounts> {
  const since = daysAgoIso(days);
  const [lpViews, ctaClicks, quizStarts, leads, books] = await Promise.all([
    countLandingPageViews(since),
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

export async function getCreativeRows(days = 30): Promise<CreativeRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = daysAgoIso(days);
  const { data, error } = await supabase
    .from("touch_events")
    .select("event_type, utm_campaign, utm_content")
    .gte("created_at", since);

  if (error || !data) return [];

  const map = new Map<
    string,
    {
      utmCampaign: string;
      pageViews: number;
      ctaClicks: number;
      quizStarts: number;
      leads: number;
      books: number;
    }
  >();

  for (const row of data) {
    const content = row.utm_content?.trim() || "(none)";
    const camp = row.utm_campaign?.trim() || "(none)";
    const key = `${camp}::${content}`;
    const bucket = map.get(key) ?? {
      utmCampaign: camp,
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
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .map(([key, c]) => {
      const utmContent = key.split("::")[1] ?? "(none)";
      return {
        utmContent,
        utmCampaign: c.utmCampaign,
        pageViews: c.pageViews,
        ctaClicks: c.ctaClicks,
        quizStarts: c.quizStarts,
        leads: c.leads,
        books: c.books,
        ctaRatePct:
          c.pageViews > 0
            ? Math.round((1000 * c.ctaClicks) / c.pageViews) / 10
            : null,
        leadRatePct:
          c.quizStarts > 0
            ? Math.round((1000 * c.leads) / c.quizStarts) / 10
            : null
      };
    })
    .filter((row) => row.utmContent !== "(none)" || row.pageViews > 0)
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
