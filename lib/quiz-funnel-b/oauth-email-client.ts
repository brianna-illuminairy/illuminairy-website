import { OAUTH_EMAIL_COOKIE } from "@/lib/quiz-funnel-b/oauth-constants";

export function readOAuthEmailCookieClient(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${OAUTH_EMAIL_COOKIE}=`;
  const row = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  if (!row) return null;
  const email = decodeURIComponent(row.slice(prefix.length)).trim().toLowerCase();
  return email.includes("@") ? email : null;
}

export function clearOAuthEmailCookieClient(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${OAUTH_EMAIL_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
