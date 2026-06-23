import { PLAN_BUILDER_B_PATH } from "@/lib/plan-builder-b-routes";

export type OAuthProviderId = "google" | "facebook";

/** Cookie read by auth error redirect to return users to the right surface. */
export const OAUTH_RETURN_PATH_COOKIE = "oauth_return_path";
const OAUTH_RETURN_PATH_MAX_AGE_SEC = 600;

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = readEnv(
    "AUTH_GOOGLE_ID",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_OAUTH_CLIENT_ID"
  );
  const clientSecret = readEnv(
    "AUTH_GOOGLE_SECRET",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_OAUTH_CLIENT_SECRET"
  );
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getFacebookOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = readEnv(
    "AUTH_FACEBOOK_ID",
    "FACEBOOK_CLIENT_ID",
    "FACEBOOK_APP_ID",
    "META_APP_ID"
  );
  const clientSecret = readEnv(
    "AUTH_FACEBOOK_SECRET",
    "FACEBOOK_CLIENT_SECRET",
    "FACEBOOK_APP_SECRET",
    "META_APP_SECRET"
  );
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured(): boolean {
  return getGoogleOAuthCredentials() !== null;
}

export function isFacebookOAuthConfigured(): boolean {
  return getFacebookOAuthCredentials() !== null;
}

export function isNextAuthOAuthConfigured(): boolean {
  return isGoogleOAuthConfigured() || isFacebookOAuthConfigured();
}

export function oauthProviderStatus() {
  return {
    google: isGoogleOAuthConfigured(),
    facebook: isFacebookOAuthConfigured(),
  };
}

/**
 * Auth.js requires a same-origin relative callback path (not a full URL).
 * Absolute URLs cause sign-in to fail with Configuration / InvalidCallbackUrl.
 */
export function normalizeOAuthCallbackUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return defaultPlanBuilderEmailCallback();
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return defaultPlanBuilderEmailCallback();
  }
}

function defaultPlanBuilderEmailCallback(): string {
  return `${PLAN_BUILDER_B_PATH}?step=b-email&oauth_return=1`;
}

/** Return path after Google/Facebook sign-in on Plan Builder B email step. */
export function planBuilderOAuthCallbackUrl(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.set("step", "b-email");
  params.set("oauth_return", "1");
  return normalizeOAuthCallbackUrl(`${PLAN_BUILDER_B_PATH}?${params.toString()}`);
}

export function oauthReturnPathCookieWrite(callbackPath: string): string {
  const value = encodeURIComponent(normalizeOAuthCallbackUrl(callbackPath));
  return `${OAUTH_RETURN_PATH_COOKIE}=${value}; Path=/; Max-Age=${OAUTH_RETURN_PATH_MAX_AGE_SEC}; SameSite=Lax`;
}

export function readOAuthReturnPathFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const prefix = `${OAUTH_RETURN_PATH_COOKIE}=`;
  const row = cookieHeader.split("; ").find((c) => c.startsWith(prefix));
  if (!row) return null;
  try {
    return normalizeOAuthCallbackUrl(decodeURIComponent(row.slice(prefix.length)));
  } catch {
    return null;
  }
}
