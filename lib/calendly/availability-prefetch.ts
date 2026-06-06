"use client";

/** Client-side Calendly availability cache + prefetch for s5. */

const TTL_MS = 50_000;

type DayGroup = {
  dateKey: string;
  weekdayShort: string;
  dayTitle: string;
  slots: Array<{ startTime: string; schedulingUrl: string; label: string }>;
};

let cached: { at: number; days: DayGroup[] } | null = null;
let inflight: Promise<DayGroup[] | null> | null = null;

export function readPrefetchedAvailability(): DayGroup[] | null {
  if (!cached) return null;
  if (Date.now() - cached.at > TTL_MS) return null;
  return cached.days;
}

export async function prefetchCalendlyAvailability(): Promise<DayGroup[] | null> {
  if (typeof window === "undefined") return null;

  const hit = readPrefetchedAvailability();
  if (hit?.length) return hit;

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch("/api/funnel/calendly-availability");
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !Array.isArray(data.days) || !data.days.length) {
        return null;
      }
      cached = { at: Date.now(), days: data.days as DayGroup[] };
      return cached.days;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function invalidateAvailabilityCache() {
  cached = null;
}
