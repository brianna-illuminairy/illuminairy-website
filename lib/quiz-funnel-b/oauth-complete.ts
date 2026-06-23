/**
 * Plan Builder B OAuth completion — shared constants + pure helpers.
 * Server route + client sync both import from here (no next/headers).
 */

export const OAUTH_COMPLETE_PATH = "/api/funnel-b/oauth/complete";
export const OAUTH_SESSION_API = "/api/funnel-b/oauth";

export const OAUTH_OK_PARAM = "oauth_ok";
export const OAUTH_ERROR_PARAM = "oauth_error";
export const OAUTH_REASON_PARAM = "oauth_reason";

/** Set before redirect to Google/Facebook; cleared after email lands in funnel state. */
export const OAUTH_PENDING_STORAGE_KEY = "qfb_oauth_pending";
export const OAUTH_PENDING_MAX_AGE_MS = 10 * 60 * 1000;

const STRIP_FROM_OAUTH_RETURN = new Set([
  "step",
  "oauth_return",
  OAUTH_OK_PARAM,
  OAUTH_ERROR_PARAM,
  OAUTH_REASON_PARAM,
]);

export function isValidOAuthEmail(raw: string | null | undefined): boolean {
  const email = raw?.trim().toLowerCase() ?? "";
  if (!email.includes("@")) return false;
  const domain = email.split("@")[1];
  return Boolean(domain?.includes("."));
}

export function stripOAuthFunnelParams(params: URLSearchParams): URLSearchParams {
  const cleaned = new URLSearchParams();
  params.forEach((value, key) => {
    if (STRIP_FROM_OAUTH_RETURN.has(key)) return;
    if (value) cleaned.set(key, value);
  });
  return cleaned;
}

/** Auth.js redirectTo — relative path only. Preserves UTMs, drops funnel step flags. */
export function planBuilderOAuthCompleteCallbackUrl(search: string): string {
  const params = stripOAuthFunnelParams(
    new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  );
  const qs = params.toString();
  return qs ? `${OAUTH_COMPLETE_PATH}?${qs}` : OAUTH_COMPLETE_PATH;
}

/** @deprecated alias */
export function planBuilderOAuthCallbackUrl(search: string): string {
  return planBuilderOAuthCompleteCallbackUrl(search);
}
