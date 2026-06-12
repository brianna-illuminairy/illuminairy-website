/**
 * Storage + retrieval for Google OAuth tokens in `integration_tokens`.
 *
 * Access tokens have ~1hr lifetimes; we cache the access token (encrypted) and
 * its expiry, and refresh on demand using the refresh token. Refresh tokens
 * are stable for the life of the grant and only rotate if Google forces a
 * re-consent.
 */

import { decryptToken, encryptToken } from "@/lib/integrations/encrypt";
import {
  refreshAccessToken,
  type GoogleTokenResponse
} from "@/lib/integrations/google/oauth";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

const PROVIDER = "google" as const;

export type StoredGoogleToken = {
  id: string;
  ownerEmail: string;
  scopes: string[];
  status: "active" | "revoked" | "error";
  statusDetail: string | null;
  lastRefreshedAt: string | null;
  lastUsedAt: string | null;
  accessTokenExpiresAt: string | null;
};

export async function upsertGoogleToken(args: {
  ownerEmail: string;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: Date;
  scopes: string[];
}): Promise<StoredGoogleToken> {
  const supabase = requireSupabaseAdmin();
  const now = new Date().toISOString();
  const row = {
    provider: PROVIDER,
    owner_email: args.ownerEmail.toLowerCase(),
    refresh_token_enc: encryptToken(args.refreshToken),
    access_token_enc: encryptToken(args.accessToken),
    access_token_expires_at: args.accessTokenExpiresAt.toISOString(),
    scopes: args.scopes,
    last_refreshed_at: now,
    last_used_at: now,
    status: "active" as const,
    status_detail: null as string | null
  };

  const { data, error } = await supabase
    .from("integration_tokens")
    .upsert(row, { onConflict: "provider,owner_email" })
    .select(
      "id, owner_email, scopes, status, status_detail, last_refreshed_at, last_used_at, access_token_expires_at"
    )
    .single();

  if (error || !data) {
    throw new Error(`upsertGoogleToken failed: ${error?.message ?? "no data"}`);
  }
  return mapRow(data);
}

export async function listGoogleTokens(): Promise<StoredGoogleToken[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("integration_tokens")
    .select(
      "id, owner_email, scopes, status, status_detail, last_refreshed_at, last_used_at, access_token_expires_at"
    )
    .eq("provider", PROVIDER)
    .order("owner_email", { ascending: true });
  if (error) {
    throw new Error(`listGoogleTokens failed: ${error.message}`);
  }
  return (data ?? []).map(mapRow);
}

export async function getGoogleTokenByOwner(
  ownerEmail: string
): Promise<StoredGoogleToken | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("integration_tokens")
    .select(
      "id, owner_email, scopes, status, status_detail, last_refreshed_at, last_used_at, access_token_expires_at"
    )
    .eq("provider", PROVIDER)
    .eq("owner_email", ownerEmail.toLowerCase())
    .maybeSingle();
  if (error) {
    throw new Error(`getGoogleTokenByOwner failed: ${error.message}`);
  }
  return data ? mapRow(data) : null;
}

export async function disconnectGoogleToken(ownerEmail: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase
    .from("integration_tokens")
    .delete()
    .eq("provider", PROVIDER)
    .eq("owner_email", ownerEmail.toLowerCase());
  if (error) {
    throw new Error(`disconnectGoogleToken failed: ${error.message}`);
  }
}

/**
 * Returns a valid access token for the given owner. Refreshes on demand using
 * the stored refresh token. Throws if the owner has no token row or the
 * refresh attempt fails (callers should surface as a Google integration
 * disconnect).
 */
export async function getValidAccessToken(ownerEmail: string): Promise<string> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("integration_tokens")
    .select(
      "id, refresh_token_enc, access_token_enc, access_token_expires_at, status"
    )
    .eq("provider", PROVIDER)
    .eq("owner_email", ownerEmail.toLowerCase())
    .maybeSingle();
  if (error || !data) {
    throw new Error(`google_token_not_found: ${ownerEmail}`);
  }
  if (data.status === "revoked") {
    throw new Error(`google_token_revoked: ${ownerEmail}`);
  }

  const expiresAt = data.access_token_expires_at
    ? new Date(data.access_token_expires_at).getTime()
    : 0;
  const skewMs = 60_000; // refresh 60s before expiry
  if (data.access_token_enc && expiresAt - skewMs > Date.now()) {
    await markUsed(data.id);
    return decryptToken(data.access_token_enc);
  }

  let refreshed: GoogleTokenResponse;
  try {
    refreshed = await refreshAccessToken(decryptToken(data.refresh_token_enc));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabase
      .from("integration_tokens")
      .update({
        status: "error",
        status_detail: message.slice(0, 500)
      })
      .eq("id", data.id);
    throw e;
  }

  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);
  await supabase
    .from("integration_tokens")
    .update({
      access_token_enc: encryptToken(refreshed.access_token),
      access_token_expires_at: newExpiresAt.toISOString(),
      last_refreshed_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
      status: "active",
      status_detail: null
    })
    .eq("id", data.id);

  return refreshed.access_token;
}

async function markUsed(id: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase
    .from("integration_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", id);
}

type Row = {
  id: string;
  owner_email: string;
  scopes: string[];
  status: string;
  status_detail: string | null;
  last_refreshed_at: string | null;
  last_used_at: string | null;
  access_token_expires_at: string | null;
};

function mapRow(r: Row): StoredGoogleToken {
  return {
    id: r.id,
    ownerEmail: r.owner_email,
    scopes: r.scopes ?? [],
    status: (r.status === "revoked" || r.status === "error" ? r.status : "active") as
      | "active"
      | "revoked"
      | "error",
    statusDetail: r.status_detail,
    lastRefreshedAt: r.last_refreshed_at,
    lastUsedAt: r.last_used_at,
    accessTokenExpiresAt: r.access_token_expires_at
  };
}

/**
 * Returns the primary owner email used for server-side Google API calls. For
 * now this is hardcoded to brianna@illuminairy.com (single-operator CRM). When
 * multi-user is needed, switch this to a per-call argument.
 */
export function primaryGoogleOwnerEmail(): string {
  return "brianna@illuminairy.com";
}
