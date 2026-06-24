/**
 * Meta click-ID capture with Safari/ITP resilience.
 * Persists il_fbp / il_fbc first-party cookies + session attribution for CAPI.
 */

import { readBrowserCookie, writeBrowserCookie } from "@/lib/browser-cookies";

const FBP_COOKIE = "_fbp";
const FBC_COOKIE = "_fbc";
const FIRST_PARTY_FBP = "il_fbp";
const FIRST_PARTY_FBC = "il_fbc";
const FIRST_PARTY_FBC_TS = "il_fbc_ts";

export type MetaClickIds = { fbp?: string; fbc?: string; fbcTs?: number };

function readCookie(name: string): string | undefined {
  const value = readBrowserCookie(name);
  return value || undefined;
}

function writeCookie(name: string, value: string) {
  writeBrowserCookie(name, value);
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
