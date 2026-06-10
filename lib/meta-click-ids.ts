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
 *
 * Timestamp correctness: Meta's `_fbc` format is `fb.1.<creationTime>.<fbclid>`
 * where `creationTime` is when the click ID was first observed (≈ ad click /
 * landing time). We capture that timestamp once at landing and persist it
 * (`il_fbc_ts`) so every later synthesis — including the server-side CAPI
 * fallback — reuses the landing time instead of the lead-submit time. Using
 * the submit time (which can be many minutes after the click) degrades Meta
 * ad attribution, especially for in-app browsers where the pixel never runs.
 */

const FBP_COOKIE = "_fbp";
const FBC_COOKIE = "_fbc";
const FIRST_PARTY_FBP = "il_fbp";
const FIRST_PARTY_FBC = "il_fbc";
const FIRST_PARTY_FBC_TS = "il_fbc_ts";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days (best-effort; ITP may shorten)

export type MetaClickIds = { fbp?: string; fbc?: string; fbcTs?: number };

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

/** Read the persisted landing-time timestamp (ms) used to synthesize `_fbc`. */
function readPersistedFbcTimestamp(): number | undefined {
  const raw = readCookie(FIRST_PARTY_FBC_TS);
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** Build a Meta-format `_fbc` value from an `fbclid` query param. */
function synthesizeFbc(fbclid: string | undefined, ts: number): string | undefined {
  if (!fbclid) return undefined;
  return `fb.1.${ts}.${fbclid}`;
}

/**
 * Resolve fbp/fbc: live pixel cookies first, then persisted first-party, then
 * synthesized fbc. Synthesis reuses the persisted landing timestamp when known.
 */
export function resolveMetaClickIds(fbclid?: string): MetaClickIds {
  const fbp = readCookie(FBP_COOKIE) ?? readCookie(FIRST_PARTY_FBP);
  const fbcTs = readPersistedFbcTimestamp();
  const fbc =
    readCookie(FBC_COOKIE) ??
    readCookie(FIRST_PARTY_FBC) ??
    synthesizeFbc(fbclid, fbcTs ?? Date.now());
  return { fbp, fbc, fbcTs };
}

/** Capture + persist click IDs (durable first-party cookies). Call at LP load. */
export function persistMetaClickIds(fbclid?: string): MetaClickIds {
  // Stamp the landing time once; reuse it on every later page view / resolve.
  const fbcTs = readPersistedFbcTimestamp() ?? Date.now();
  const fbp = readCookie(FBP_COOKIE) ?? readCookie(FIRST_PARTY_FBP);
  const fbc =
    readCookie(FBC_COOKIE) ??
    readCookie(FIRST_PARTY_FBC) ??
    synthesizeFbc(fbclid, fbcTs);
  if (fbp) writeCookie(FIRST_PARTY_FBP, fbp);
  if (fbc) {
    writeCookie(FIRST_PARTY_FBC, fbc);
    writeCookie(FIRST_PARTY_FBC_TS, String(fbcTs));
  }
  return { fbp, fbc, fbcTs };
}
