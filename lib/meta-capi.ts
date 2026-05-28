import { createHash } from "crypto";
import type { AttributionSnapshot } from "@/lib/attribution";

const GRAPH = "https://graph.facebook.com/v21.0";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export type MetaCapiUser = {
  email?: string;
  phone?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
};

export async function sendMetaCapiEvent(
  eventName: "Lead" | "Schedule",
  eventId: string,
  user: MetaCapiUser,
  customData?: Record<string, string | number>,
  attribution?: AttributionSnapshot
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return { ok: false as const, skipped: "not_configured" as const };
  }

  const userData: Record<string, unknown> = {};
  if (user.email) userData.em = [sha256(user.email)];
  if (user.phone) userData.ph = [sha256(user.phone.replace(/\D/g, ""))];
  if (user.clientIp) userData.client_ip_address = user.clientIp;
  if (user.clientUserAgent) userData.client_user_agent = user.clientUserAgent;
  if (user.fbc) userData.fbc = user.fbc;
  if (user.fbp) userData.fbp = user.fbp;
  if (attribution?.fbclid && !user.fbc) {
    userData.fbc = `fb.1.${Date.now()}.${attribution.fbclid}`;
  }

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        user_data: userData,
        custom_data: customData ?? {}
      }
    ]
  };

  try {
    const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Meta CAPI error:", res.status, text);
      return { ok: false as const, error: text };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("Meta CAPI fetch failed:", err);
    return { ok: false as const, error: String(err) };
  }
}

export function makeMetaEventId(prefix: string, seed: string) {
  return `${prefix}_${seed}_${Date.now()}`;
}
