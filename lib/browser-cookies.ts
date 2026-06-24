/** Shared first-party cookie helpers (attribution, Meta click IDs, legacy visitor). */

export const BROWSER_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 180;

export function readBrowserCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function writeBrowserCookie(name: string, value: string, maxAgeSec = BROWSER_COOKIE_MAX_AGE_SEC): void {
  if (typeof document === "undefined" || !value) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}
