import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForTokens,
  fetchUserInfo,
  missingScopes,
  parseGrantedScopes
} from "@/lib/integrations/google/oauth";
import { upsertGoogleToken } from "@/lib/integrations/google/tokens";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATE_COOKIE = "illuminairy_google_oauth_state";

export async function GET(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.redirect(new URL("/admin/login", baseUrl()));
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/integrations", baseUrl()));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  const jar = await cookies();
  const expectedState = jar.get(STATE_COOKIE)?.value ?? null;
  jar.delete(STATE_COOKIE);

  if (errorParam) {
    return redirectToIntegrations({ error: errorParam });
  }
  if (!code || !state) {
    return redirectToIntegrations({ error: "missing_code_or_state" });
  }
  if (!expectedState || expectedState !== state) {
    return redirectToIntegrations({ error: "bad_state" });
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code);
  } catch (e) {
    return redirectToIntegrations({
      error: "token_exchange_failed",
      detail: e instanceof Error ? e.message : "unknown"
    });
  }

  if (!tokens.refresh_token) {
    return redirectToIntegrations({ error: "no_refresh_token_granted" });
  }

  let userInfo;
  try {
    userInfo = await fetchUserInfo(tokens.access_token);
  } catch (e) {
    return redirectToIntegrations({
      error: "userinfo_failed",
      detail: e instanceof Error ? e.message : "unknown"
    });
  }

  const grantedScopes = parseGrantedScopes(tokens.scope ?? "");
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  try {
    await upsertGoogleToken({
      ownerEmail: userInfo.email,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      accessTokenExpiresAt: expiresAt,
      scopes: grantedScopes
    });
  } catch (e) {
    return redirectToIntegrations({
      error: "token_store_failed",
      detail: e instanceof Error ? e.message : "unknown"
    });
  }

  const missing = missingScopes(tokens.scope ?? "");
  const params = new URLSearchParams({
    connected: userInfo.email,
    ...(missing.length > 0 ? { missing_scopes: missing.join(",") } : {})
  });
  return NextResponse.redirect(new URL(`/admin/integrations?${params.toString()}`, baseUrl()));
}

function baseUrl(): string {
  return process.env.ILLUMINAIRY_BASE_URL ?? "http://localhost:3000";
}

function redirectToIntegrations(args: { error: string; detail?: string }): NextResponse {
  const params = new URLSearchParams({ error: args.error });
  if (args.detail) params.set("detail", args.detail);
  return NextResponse.redirect(new URL(`/admin/integrations?${params.toString()}`, baseUrl()));
}
