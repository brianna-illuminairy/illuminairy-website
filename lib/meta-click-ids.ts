/**
 * Meta click-ID capture with Safari/ITP resilience.
 *
 * Problem: Safari ITP caps client-set cookies (incl. the Meta pixel's
 * `_fbp` / `_fbc`) to ~7 days, and the pixel may not have written `_fbc`
 * yet when the lead is submitted. If those cookies are gone by the time the
 * parent finishes the quiz, CAPI loses match quality.
 *
 * Fix: at landing-page load we read `_fbp` / `_fbc`, synthesize `_fbc` from
 * the `fbclid` query param when needed, then persist the resolved values to:
 *   1. a durable first-party cookie (`il_fbp` / `il_fbc`), and
 *   2. the session attribution snapshot (sessionStorage) — which is NOT
 *      subject to ITP's cookie cap and survives the in-session LP -> quiz hop.
 * The quiz finale then resolves with live cookies first, falling back to the
 * persisted values, so the Lead CAPI event keeps `fbp` / `fbc`.
 */

const FBP_COOKIE = "_fbp";
const FBC_COOKIE = "_fbc";
const FIRST_PARTY_FBP = "il_fbp";
const FIRST_PARTY_FBC = "il_fbc";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days (best-effort; ITP may shorten)

export type MetaClickIds = { fbp?: string; fbc?: string };

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined" || !value) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

/** Build a Meta-format `_fbc` value from an `fbclid` query param. */
function synthesizeFbc(fbclid: string | undefined): string | undefined {
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

/** Resolve fbp/fbc: live pixel cookies first, then persisted first-party, then synthesized fbc. */
export function resolveMetaClickIds(fbclid?: string): MetaClickIds {
  const fbp = readCookie(FBP_COOKIE) ?? readCookie(FIRST_PARTY_FBP);
  const fbc =
    readCookie(FBC_COOKIE) ??
    readCookie(FIRST_PARTY_FBC) ??
    synthesizeFbc(fbclid);
  return { fbp, fbc };
}

/** Capture + persist click IDs (durable first-party cookies). Call at LP load. */
export function persistMetaClickIds(fbclid?: string): MetaClickIds {
  const ids = resolveMetaClickIds(fbclid);
  if (ids.fbp) writeCookie(FIRST_PARTY_FBP, ids.fbp);
  if (ids.fbc) writeCookie(FIRST_PARTY_FBC, ids.fbc);
  return ids;
}
