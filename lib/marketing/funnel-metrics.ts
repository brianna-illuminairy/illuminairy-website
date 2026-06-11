import { INTERNAL_CRM_EMAILS } from "@/lib/admin/internal-emails";
import { canonicalizeUtmContent } from "@/lib/marketing/utm-content-aliases";
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
  dropCount: number | null;
  retainFromQuizStartPct: number | null;
  retainFromLpPct: number | null;
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

async function getExternalLeadIds(): Promise<Set<string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return new Set<string>();

  const { data, error } = await supabase.from("leads").select("id, parent_email");

  if (error || !data) return new Set<string>();

  const internalLower = INTERNAL_CRM_EMAILS.map((e) => e.toLowerCase());
  const out = new Set<string>();
  for (const row of data) {
    const email = row.parent_email?.trim().toLowerCase();
    if (!email) continue;
    if (internalLower.indexOf(email) !== -1) continue;
    out.add(row.id);
  }

  return out;
}

async function distinctLeadIdsForEvent(
  eventType: string,
  since: string,
  externalLeadIds: Set<string>
): Promise<Set<string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return new Set();

  const { data, error } = await supabase
    .from("touch_events")
    .select("lead_id")
    .eq("event_type", eventType)
    .gte("created_at", since)
    .not("lead_id", "is", null);

  if (error || !data) return new Set();

  const out = new Set<string>();
  for (const row of data) {
    if (!row.lead_id) continue;
    if (!externalLeadIds.has(row.lead_id)) continue;
    out.add(row.lead_id);
  }
  return out;
}

export async function getFunnelCounts(days = 7): Promise<FunnelCounts> {
  const since = daysAgoIso(days);
  const externalLeadIds = await getExternalLeadIds();

  const [lpViews, ctaClicks, quizStarts, leadIdsSubmitted, leadIdsBooked] =
    await Promise.all([
      countLandingPageViews(since),
      countTouches("funnel_cta_click", since),
      countTouches("quiz_started", since),
      distinctLeadIdsForEvent("quiz_lead_submitted", since, externalLeadIds),
      distinctLeadIdsForEvent("call_booked", since, externalLeadIds)
    ]);

  const funnelAttributedBooked = new Set<string>();
  leadIdsBooked.forEach((id) => {
    if (leadIdsSubmitted.has(id)) funnelAttributedBooked.add(id);
  });

  return {
    lpViews,
    ctaClicks,
    quizStarts,
    leads: leadIdsSubmitted.size,
    books: funnelAttributedBooked.size
  };
}

export async function getStepDropoffs(
  days = 7,
  lpViews = 0,
  quizStarts = 0
): Promise<StepDrop[]> {
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
  const quizTop = quizStarts > 0 ? quizStarts : sorted[0]?.visitors ?? 0;
  const lpTop = lpViews;

  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = sorted[i - 1];
    const dropCount =
      prev && prev.visitors > 0 ? prev.visitors - curr.visitors : null;
    const dropPct =
      prev && prev.visitors > 0
        ? Math.round(1000 * (1 - curr.visitors / prev.visitors)) / 10
        : null;
    out.push({
      ...curr,
      dropPct,
      dropCount: dropCount !== null ? Math.max(0, dropCount) : null,
      retainFromQuizStartPct:
        quizTop > 0
          ? Math.round((1000 * curr.visitors) / quizTop) / 10
          : null,
      retainFromLpPct:
        lpTop > 0 ? Math.round((1000 * curr.visitors) / lpTop) / 10 : null
    });
  }
  return out;
}

export async function getCampaignRows(days = 30): Promise<CampaignRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = daysAgoIso(days);
  const externalLeadIds = await getExternalLeadIds();

  const { data, error } = await supabase
    .from("touch_events")
    .select("event_type, utm_campaign, lead_id")
    .gte("created_at", since);

  if (error || !data) return [];

  type Bucket = {
    pageViews: number;
    ctaClicks: number;
    quizStarts: number;
    leadSet: Set<string>;
    bookSet: Set<string>;
  };
  const map = new Map<string, Bucket>();

  for (const row of data) {
    const camp = row.utm_campaign?.trim() || "(none)";
    const bucket = map.get(camp) ?? {
      pageViews: 0,
      ctaClicks: 0,
      quizStarts: 0,
      leadSet: new Set<string>(),
      bookSet: new Set<string>()
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
        if (row.lead_id && externalLeadIds.has(row.lead_id)) {
          bucket.leadSet.add(row.lead_id);
        }
        break;
      case "call_booked":
        if (row.lead_id && externalLeadIds.has(row.lead_id)) {
          bucket.bookSet.add(row.lead_id);
        }
        break;
      default:
        break;
    }
    map.set(camp, bucket);
  }

  return Array.from(map.entries())
    .map(([utmCampaign, c]) => {
      // Scope books to funnel-attributed (intersect with leads who submitted)
      const attributedBooks = new Set<string>();
      c.bookSet.forEach((id) => {
        if (c.leadSet.has(id)) attributedBooks.add(id);
      });
      return {
        utmCampaign,
        pageViews: c.pageViews,
        ctaClicks: c.ctaClicks,
        quizStarts: c.quizStarts,
        leads: c.leadSet.size,
        books: attributedBooks.size,
        ctaRatePct:
          c.pageViews > 0
            ? Math.round((1000 * c.ctaClicks) / c.pageViews) / 10
            : null,
        leadRatePct:
          c.quizStarts > 0
            ? Math.round((1000 * c.leadSet.size) / c.quizStarts) / 10
            : null
      };
    })
    .sort((a, b) => b.pageViews - a.pageViews);
}

export async function getCreativeRows(days = 30): Promise<CreativeRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = daysAgoIso(days);
  const externalLeadIds = await getExternalLeadIds();

  const { data, error } = await supabase
    .from("touch_events")
    .select("event_type, utm_campaign, utm_content, lead_id")
    .gte("created_at", since);

  if (error || !data) return [];

  type CreativeBucket = {
    utmCampaign: string;
    pageViews: number;
    ctaClicks: number;
    quizStarts: number;
    leadSet: Set<string>;
    bookSet: Set<string>;
  };
  const map = new Map<string, CreativeBucket>();

  for (const row of data) {
    const content = row.utm_content?.trim()
      ? canonicalizeUtmContent(row.utm_content)
      : "(none)";
    const camp = row.utm_campaign?.trim() || "(none)";
    const key = `${camp}::${content}`;
    const bucket = map.get(key) ?? {
      utmCampaign: camp,
      pageViews: 0,
      ctaClicks: 0,
      quizStarts: 0,
      leadSet: new Set<string>(),
      bookSet: new Set<string>()
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
        if (row.lead_id && externalLeadIds.has(row.lead_id)) {
          bucket.leadSet.add(row.lead_id);
        }
        break;
      case "call_booked":
        if (row.lead_id && externalLeadIds.has(row.lead_id)) {
          bucket.bookSet.add(row.lead_id);
        }
        break;
      default:
        break;
    }
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .map(([key, c]) => {
      const utmContent = key.split("::")[1] ?? "(none)";
      const attributedBooks = new Set<string>();
      c.bookSet.forEach((id) => {
        if (c.leadSet.has(id)) attributedBooks.add(id);
      });
      return {
        utmContent,
        utmCampaign: c.utmCampaign,
        pageViews: c.pageViews,
        ctaClicks: c.ctaClicks,
        quizStarts: c.quizStarts,
        leads: c.leadSet.size,
        books: attributedBooks.size,
        ctaRatePct:
          c.pageViews > 0
            ? Math.round((1000 * c.ctaClicks) / c.pageViews) / 10
            : null,
        leadRatePct:
          c.quizStarts > 0
            ? Math.round((1000 * c.leadSet.size) / c.quizStarts) / 10
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
