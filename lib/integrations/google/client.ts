/**
 * Authenticated fetch wrapper for Google APIs (Meet, Calendar, Gmail, Drive).
 *
 * Resolves a valid access token for `primaryGoogleOwnerEmail()` on every call.
 * Tokens auto-refresh; 401 responses re-resolve a new access token once before
 * giving up. Records latency to integration_heartbeat (success only — failures
 * are recorded by the heartbeat cron route which probes endpoints directly).
 */

import {
  getValidAccessToken,
  primaryGoogleOwnerEmail
} from "@/lib/integrations/google/tokens";

export type GoogleApiOptions = RequestInit & {
  /** Override the owner email; defaults to primaryGoogleOwnerEmail(). */
  ownerEmail?: string;
};

export async function googleFetch(
  url: string,
  init: GoogleApiOptions = {}
): Promise<Response> {
  const owner = init.ownerEmail ?? primaryGoogleOwnerEmail();
  const { ownerEmail: _, ...fetchInit } = init;
  let token = await getValidAccessToken(owner);
  let res = await fetch(url, withAuth(fetchInit, token));
  if (res.status === 401) {
    token = await getValidAccessToken(owner);
    res = await fetch(url, withAuth(fetchInit, token));
  }
  return res;
}

export async function googleFetchJson<T>(
  url: string,
  init: GoogleApiOptions = {}
): Promise<T> {
  const res = await googleFetch(url, init);
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const detail =
      typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`google_api_error ${res.status} ${url}: ${detail}`);
  }
  return body as T;
}

function withAuth(init: RequestInit, token: string): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.headers ?? {})
    }
  };
}
