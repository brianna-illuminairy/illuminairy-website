import { createHash } from "crypto";
import type { AttributionSnapshot } from "@/lib/attribution";

const GRAPH = "https://graph.facebook.com/v21.0";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export type MetaCapiUser = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Lead/visitor id — hashed before send (Meta external_id). */
  externalId?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
  /** Landing-time timestamp (ms) for synthesizing `_fbc` from `fbclid`. */
  fbcTs?: number;
};

export type MetaCapiSendOptions = {
  /** Unix seconds — when the conversion action occurred (defaults to now). */
  eventTimeSec?: number;
};

/** Lead row fields used to rebuild CAPI user_data on server-side Schedule. */
export type LeadMetaMatchRow = {
  id: string;
  parent_email: string;
  parent_first?: string | null;
  parent_last?: string | null;
  parent_phone?: string | null;
  fbclid?: string | null;
  meta_fbp?: string | null;
  meta_fbc?: string | null;
  meta_fbc_ts?: number | null;
  meta_client_ip?: string | null;
  meta_client_user_agent?: string | null;
};

export function metaCapiUserFromLead(
  lead: LeadMetaMatchRow,
  email?: string
): MetaCapiUser {
  return {
    email: email ?? lead.parent_email,
    phone: lead.parent_phone ?? undefined,
    firstName: lead.parent_first ?? undefined,
    lastName: lead.parent_last ?? undefined,
    externalId: lead.id,
    clientIp: lead.meta_client_ip ?? undefined,
    clientUserAgent: lead.meta_client_user_agent ?? undefined,
    fbp: lead.meta_fbp ?? undefined,
    fbc: lead.meta_fbc ?? undefined,
    fbcTs:
      typeof lead.meta_fbc_ts === "number" && lead.meta_fbc_ts > 0
        ? lead.meta_fbc_ts
        : undefined
  };
}

export function attributionFromLeadFbclid(
  fbclid?: string | null
): AttributionSnapshot | undefined {
  if (!fbclid) return undefined;
  return { fbclid };
}

export async function sendMetaCapiEvent(
  eventName: "Lead" | "Schedule",
  eventId: string,
  user: MetaCapiUser,
  customData?: Record<string, string | number>,
  attribution?: AttributionSnapshot,
  options?: MetaCapiSendOptions
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return { ok: false as const, skipped: "not_configured" as const };
  }

  const userData: Record<string, unknown> = {};
  if (user.email) userData.em = [sha256(user.email)];
  if (user.phone) userData.ph = [sha256(user.phone.replace(/\D/g, ""))];
  if (user.firstName) userData.fn = [sha256(user.firstName)];
  if (user.lastName) userData.ln = [sha256(user.lastName)];
  if (user.externalId) userData.external_id = [sha256(user.externalId)];
  if (user.clientIp) userData.client_ip_address = user.clientIp;
  if (user.clientUserAgent) userData.client_user_agent = user.clientUserAgent;
  if (user.fbc) userData.fbc = user.fbc;
  if (user.fbp) userData.fbp = user.fbp;
  if (attribution?.fbclid && !user.fbc) {
    const fbcTs = user.fbcTs && user.fbcTs > 0 ? user.fbcTs : Date.now();
    userData.fbc = `fb.1.${fbcTs}.${attribution.fbclid}`;
  }

  const eventTime =
    options?.eventTimeSec && options.eventTimeSec > 0
      ? options.eventTimeSec
      : Math.floor(Date.now() / 1000);

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
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
