"use client";

import {
  isValidOAuthEmail,
  OAUTH_PENDING_MAX_AGE_MS,
  OAUTH_PENDING_STORAGE_KEY,
  OAUTH_SESSION_API,
} from "@/lib/quiz-funnel-b/oauth-complete";
import {
  clearOAuthEmailCookieClient,
  readOAuthEmailCookieClient,
} from "@/lib/quiz-funnel-b/oauth-email-client";

export function markOAuthSignInPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(OAUTH_PENDING_STORAGE_KEY, String(Date.now()));
  } catch {
    /* private mode */
  }
}

export function clearOAuthSignInPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(OAUTH_PENDING_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isOAuthSignInPending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(OAUTH_PENDING_STORAGE_KEY);
    if (!raw) return false;
    const started = Number(raw);
    if (!Number.isFinite(started) || Date.now() - started > OAUTH_PENDING_MAX_AGE_MS) {
      clearOAuthSignInPending();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Cookie set by /api/funnel-b/oauth/complete (fast path). */
export function readOAuthEmailFromBrowser(): string | null {
  return readOAuthEmailCookieClient();
}

/** Session is SSOT — works even when the handoff cookie is blocked or missing. */
export async function fetchOAuthSessionEmail(maxAttempts = 6): Promise<string | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(OAUTH_SESSION_API, {
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { email?: string };
      const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      if (isValidOAuthEmail(email)) return email;
    } catch {
      /* retry */
    }
    await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
  }
  return null;
}

export async function resolveOAuthEmailAfterRedirect(): Promise<string | null> {
  const fromCookie = readOAuthEmailFromBrowser();
  if (isValidOAuthEmail(fromCookie)) return fromCookie;
  return fetchOAuthSessionEmail();
}

export function clearOAuthHandoffArtifacts(): void {
  clearOAuthSignInPending();
  clearOAuthEmailCookieClient();
}
