/**
 * Normalize LP query strings before URLSearchParams.
 * Some chat/link tools paste `?hook%3Dtutor` instead of `?hook=tutor`, which
 * parses as a param named "hook=tutor" (empty value) — hook never resolves.
 * Next's `searchParams.toString()` can round-trip that as `hook%3Dtutor=`.
 */
export function normalizeLandingSearch(search: string): string {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return raw;
  return raw.replace(/hook%3D/gi, "hook=");
}

function cleanParamValue(value: string): string {
  return value.replace(/=+$/, "").trim();
}

function recoverHookParam(params: URLSearchParams): URLSearchParams {
  const existing = params.get("hook");
  if (existing) {
    const cleaned = cleanParamValue(existing);
    if (cleaned !== existing) {
      const fixed = new URLSearchParams(params);
      fixed.set("hook", cleaned);
      return fixed;
    }
    return params;
  }

  for (const key of Array.from(params.keys())) {
    const decoded = decodeURIComponent(key).toLowerCase();
    const inline = decoded.match(/^hook=(.+)$/);
    if (inline?.[1]) {
      const fixed = new URLSearchParams(params);
      fixed.delete(key);
      fixed.set("hook", cleanParamValue(inline[1]));
      return fixed;
    }
  }

  return params;
}

export function landingSearchParams(search: string): URLSearchParams {
  const normalized = normalizeLandingSearch(search);
  return recoverHookParam(new URLSearchParams(normalized));
}

/** Canonical `?foo=bar` for LP routing + analytics (fixes malformed hook paste). */
export function landingSearchQuery(search: string): string {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return "";
  const params = landingSearchParams(raw);
  const next = params.toString();
  return next ? `?${next}` : "";
}
