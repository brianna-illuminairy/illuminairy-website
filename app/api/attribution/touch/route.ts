import { NextResponse } from "next/server";
import {
  parseAttributionFromSearch,
  type AttributionSnapshot
} from "@/lib/attribution";
import { appendTouchEvent } from "@/lib/crm/touch";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "attribution_captured",
  "internal_redirect",
  "intake_started",
  "schedule_viewed"
]);

type TouchBody = {
  visitorId?: string;
  eventType?: string;
  path?: string;
  fullUrl?: string;
  referrer?: string;
  leadId?: string;
  attribution?: AttributionSnapshot;
};

export async function POST(request: Request) {
  let body: TouchBody;
  try {
    body = (await request.json()) as TouchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const visitorId = body.visitorId?.trim();
  const eventType = body.eventType?.trim() ?? "page_view";

  if (!visitorId) {
    return NextResponse.json({ error: "visitorId required." }, { status: 400 });
  }

  if (!ALLOWED_EVENTS.has(eventType)) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
  }

  let attribution = body.attribution ?? {};
  if (body.fullUrl) {
    try {
      const url = new URL(body.fullUrl);
      attribution = {
        ...parseAttributionFromSearch(url.search),
        ...attribution,
        landing_page: attribution.landing_page ?? body.fullUrl
      };
    } catch {
      /* ignore bad url */
    }
  }

  const result = await appendTouchEvent({
    visitor_id: visitorId,
    lead_id: body.leadId,
    event_type: eventType,
    path: body.path,
    full_url: body.fullUrl,
    referrer: body.referrer ?? request.headers.get("referer") ?? undefined,
    attribution,
    source: "client"
  });

  if (!result.ok) {
    if (result.error === "supabase_not_configured") {
      return NextResponse.json({ ok: true, skipped: true });
    }
    return NextResponse.json({ error: "Could not record touch." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
