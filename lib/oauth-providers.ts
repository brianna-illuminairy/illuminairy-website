import { PLAN_BUILDER_B_PATH } from "@/lib/plan-builder-b-routes";

export type OAuthProviderId = "google" | "facebook";

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId =
    process.env.GOOGLE_CLIENT_ID?.trim() || process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET?.trim() || process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function getFacebookOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.FACEBOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET?.trim();
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

/** Return path after Google/Facebook sign-in on Plan Builder B email step (relative — required by Auth.js). */
export function planBuilderOAuthCallbackUrl(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.set("step", "b-email");
  params.set("oauth_return", "1");
  return `${PLAN_BUILDER_B_PATH}?${params.toString()}`;
}

export function nextAuthProviderSignInUrl(
  provider: OAuthProviderId,
  callbackUrl: string
): string {
  return `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
