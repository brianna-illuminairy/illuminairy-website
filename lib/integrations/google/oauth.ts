/**
 * Google OAuth 2.0 (web flow) — installed-app-style for the CRM owner.
 *
 * Flow:
 *   1. /api/admin/integrations/google/connect -> builds authorize URL, sets a
 *      `state` cookie, redirects browser to Google.
 *   2. User grants consent. Google redirects to
 *      /api/admin/integrations/google/callback?code=...&state=...
 *   3. Callback verifies state, exchanges code for tokens (refresh + access),
 *      encrypts the refresh token, and upserts `integration_tokens`.
 *   4. From then on, server-side code calls `getValidAccessToken()` which
 *      transparently refreshes when access tokens expire.
 *
 * No client SDK; we use raw fetch to keep dependencies minimal. Google's
 * Discovery endpoints return JSON via standard `application/x-www-form-urlencoded`
 * exchanges that fetch handles natively.
 */

import { googleScopesParam, GOOGLE_SCOPES, type GoogleScope } from "./scopes";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: "Bearer";
  id_token?: string;
};

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export function getRedirectUri(): string {
  const base = process.env.ILLUMINAIRY_BASE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/admin/integrations/google/callback`;
}

export function buildAuthorizeUrl(state: string): string {
  const clientId = requireEnv("GOOGLE_OAUTH_CLIENT_ID");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: googleScopesParam(),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code"
    })
  });
  if (!res.ok) {
    throw new Error(`google_token_exchange_failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as GoogleTokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
      grant_type: "refresh_token"
    })
  });
  if (!res.ok) {
    throw new Error(`google_token_refresh_failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as GoogleTokenResponse;
}

export async function fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error(`google_userinfo_failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as GoogleUserInfo;
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const res = await fetch(GOOGLE_REVOKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: refreshToken })
  });
  if (!res.ok && res.status !== 400) {
    // 400 = token already invalid; ignore.
    throw new Error(`google_token_revoke_failed: ${res.status} ${await res.text()}`);
  }
}

export function parseGrantedScopes(scopeString: string): GoogleScope[] {
  const granted = new Set(scopeString.split(/\s+/));
  return GOOGLE_SCOPES.filter((s) => granted.has(s));
}

export function missingScopes(grantedScopeString: string): GoogleScope[] {
  const granted = new Set(grantedScopeString.split(/\s+/));
  return GOOGLE_SCOPES.filter((s) => !granted.has(s));
}
