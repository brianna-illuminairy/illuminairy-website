/**
 * Server-side GA4 Measurement Protocol — sends business-milestone events
 * (call_attended, qualified, no_show, payment_link_sent) with the parent's
 * GA4 client_id stitched in. This is in addition to client-side tracking;
 * the server side guarantees attribution even when the user closes the tab
 * before the GA4 SDK flushes.
 *
 * Requires:
 *   - GA4_MEASUREMENT_ID  (G-XXXXXX)
 *   - GA4_API_SECRET      (created in GA4 admin → Data Streams → Measurement Protocol)
 */

const ENDPOINT = "https://www.google-analytics.com/mp/collect";

export type Ga4Event = {
  name: string;
  params?: Record<string, string | number | boolean | null>;
};

export async function sendGa4Event(args: {
  clientId: string;
  events: Ga4Event[];
  userId?: string;
  userProperties?: Record<string, { value: string }>;
}): Promise<{ ok: boolean; status?: number; error?: string }> {
  const measurementId = process.env.GA4_MEASUREMENT_ID?.trim();
  const apiSecret = process.env.GA4_API_SECRET?.trim();
  if (!measurementId || !apiSecret) {
    return { ok: false, error: "ga4_not_configured" };
  }

  const url = `${ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
  const body: Record<string, unknown> = {
    client_id: args.clientId,
    events: args.events,
    non_personalized_ads: false
  };
  if (args.userId) body.user_id = args.userId;
  if (args.userProperties) body.user_properties = args.userProperties;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: (await res.text()).slice(0, 200) };
    }
    return { ok: true, status: 200 };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "unknown"
    };
  }
}
