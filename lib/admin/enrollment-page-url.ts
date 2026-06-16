import { site } from "@/lib/site";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const ENROLL_PATH_RE = /^\/enroll\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/i;

/**
 * Normalize admin input into a canonical enrollment page URL on illuminairy.com.
 * Accepts slug (`sohail-shermeen`), path (`/enroll/sohail-shermeen`), or full URL.
 */
export function normalizeEnrollmentPageUrl(
  input: string | null | undefined
): string | null {
  if (input == null) return null;
  const raw = input.trim();
  if (!raw) return null;

  const siteHost = new URL(site.url).hostname;

  if (SLUG_RE.test(raw) && !raw.includes("/") && !raw.includes(".")) {
    return `${site.url}/enroll/${raw.toLowerCase()}`;
  }

  if (ENROLL_PATH_RE.test(raw)) {
    const path = raw.replace(/\/$/, "");
    return `${site.url}${path}`;
  }

  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (u.hostname !== siteHost) return null;
    if (!ENROLL_PATH_RE.test(u.pathname)) return null;
    return `${u.origin}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

export function enrollmentPageSlugFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const m = /^\/enroll\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/i.exec(u.pathname);
    return m ? m[1].toLowerCase() : null;
  } catch {
    return null;
  }
}
