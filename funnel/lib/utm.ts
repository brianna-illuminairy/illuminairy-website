/** Persist UTM params for funnel attribution (sessionStorage). */

export const UTM_STORAGE_KEY = "illuminairy_funnel_utm";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function parseUtmFromSearchParams(
  params: URLSearchParams
): UtmParams {
  const utm: UtmParams = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ] as const) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export function persistUtm(utm: UtmParams) {
  if (typeof window === "undefined") return;
  if (!Object.keys(utm).length) return;
  try {
    const existing = readPersistedUtm();
    sessionStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify({ ...existing, ...utm })
    );
  } catch {
    // ignore
  }
}

export function readPersistedUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}

export function utmForAnalytics(): Record<string, string> {
  const utm = readPersistedUtm();
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(utm)) {
    if (v) out[k] = v;
  }
  return out;
}
