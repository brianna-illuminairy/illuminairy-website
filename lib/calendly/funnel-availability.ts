/**
 * Calendly availability for quiz s5 scheduler — max 6 slots per day.
 */

import { site } from "@/lib/site";

const CALENDLY_API = "https://api.calendly.com";
const MAX_SLOTS_PER_DAY = 6;
const MAX_DAY_TABS = 4;
/** Per-day targets (sum = MAX_SLOTS_PER_DAY): spread across the day in ET. */
const SLOTS_PER_PERIOD = {
  morning: 2,
  afternoon: 2,
  evening: 2,
} as const;
/** Calendly API: end_time − start_time must be ≤ 7 days. */
const CALENDLY_MAX_RANGE_DAYS = 7;
/** Poll up to two adjacent windows when the first week has few weekdays. */
const AVAILABILITY_WINDOW_COUNT = 2;
const START_TIME_BUFFER_MS = 90_000;
const DISPLAY_TZ = "America/New_York";
/** Avoid repeating /users/me + event_types pagination on every book. */
const EVENT_TYPE_URI_TTL_MS = 15 * 60 * 1000;
const eventTypeUriCache = new Map<string, { uri: string; expiresAt: number }>();

export type CalendlySlot = {
  startTime: string;
  schedulingUrl: string;
  label: string;
};

export type CalendlyDayGroup = {
  dateKey: string;
  weekdayShort: string;
  dayTitle: string;
  slots: CalendlySlot[];
};

type CalendlyCollection<T> = {
  collection?: T[];
};

function parsePublicEventUrl(url: string): { userSlug: string; eventSlug: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { userSlug: parts[0], eventSlug: parts[1] };
  } catch {
    return null;
  }
}

async function calendlyFetch<T>(
  path: string,
  token: string,
  options?: { fresh?: boolean }
): Promise<T> {
  const res = await fetch(`${CALENDLY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...(options?.fresh
      ? { cache: "no-store" as RequestCache }
      : { next: { revalidate: 60 } }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendly ${path}: ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function resolveEventTypeUri(token: string, publicUrl: string): Promise<string> {
  const cached = eventTypeUriCache.get(publicUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.uri;
  }

  const parsed = parsePublicEventUrl(publicUrl);
  if (!parsed) throw new Error("Invalid Calendly URL");

  const me = await calendlyFetch<{ resource: { current_organization: string } }>(
    "/users/me",
    token
  );
  const orgUri = me.resource.current_organization;

  let pageToken: string | undefined;
  do {
    const qs = new URLSearchParams({
      organization: orgUri,
      active: "true",
      count: "100",
    });
    if (pageToken) qs.set("page_token", pageToken);

    const data = await calendlyFetch<
      CalendlyCollection<{
        uri: string;
        slug: string;
        scheduling_url: string;
      }> & { pagination?: { next_page_token?: string } }
    >(`/event_types?${qs}`, token);

    for (const et of data.collection ?? []) {
      if (et.slug === parsed.eventSlug) {
        eventTypeUriCache.set(publicUrl, {
          uri: et.uri,
          expiresAt: Date.now() + EVENT_TYPE_URI_TTL_MS,
        });
        return et.uri;
      }
      if (et.scheduling_url?.includes(`/${parsed.eventSlug}`)) {
        eventTypeUriCache.set(publicUrl, {
          uri: et.uri,
          expiresAt: Date.now() + EVENT_TYPE_URI_TTL_MS,
        });
        return et.uri;
      }
    }
    pageToken = data.pagination?.next_page_token;
  } while (pageToken);

  throw new Error(`Event type not found: ${parsed.eventSlug}`);
}

export type EventTypeBookingMeta = {
  eventTypeUri: string;
  locationKind?: string;
  kidQuestion?: { name: string; position: number };
};

/** Event type config for POST /invitees (location + custom questions). */
export async function fetchEventTypeBookingMeta(
  token: string,
  publicUrl: string = site.calendlyUrl
): Promise<EventTypeBookingMeta> {
  const eventTypeUri = await resolveEventTypeUri(token, publicUrl);
  const path = new URL(eventTypeUri).pathname;
  const data = await calendlyFetch<{
    resource: {
      locations?: { kind: string }[];
      custom_questions?: { name: string; position: number; enabled?: boolean }[];
    };
  }>(path, token);

  const locations = data.resource?.locations ?? [];
  const questions = (data.resource?.custom_questions ?? []).filter(
    (q) => q.enabled !== false
  );
  const kidQuestion =
    questions.find((q) => /student|child/i.test(q.name)) ?? questions[0];

  return {
    eventTypeUri,
    locationKind: locations[0]?.kind,
    kidQuestion: kidQuestion
      ? { name: kidQuestion.name, position: kidQuestion.position }
      : undefined,
  };
}

function formatSlotLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function weekdayShort(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    weekday: "short",
  })
    .format(new Date(iso))
    .toUpperCase()
    .replace(/\.$/, "");
}

function dayTitle(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function dateKeyInTz(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function isWeekday(iso: string): boolean {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    weekday: "short",
  }).format(new Date(iso));
  return wd !== "Sat" && wd !== "Sun";
}

type DayPeriod = keyof typeof SLOTS_PER_PERIOD;

function hourInEt(iso: string): number {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    hour: "numeric",
    hour12: false,
  })
    .formatToParts(new Date(iso))
    .find((p) => p.type === "hour");
  return Number(part?.value ?? 0);
}

function periodForSlot(iso: string): DayPeriod {
  const hour = hourInEt(iso);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function rowToSlot(row: AvailableTimeRow, publicUrl: string): CalendlySlot {
  return {
    startTime: row.start_time,
    schedulingUrl: row.scheduling_url ?? publicUrl,
    label: formatSlotLabel(row.start_time),
  };
}

/** Evenly sample `count` items from a chronologically sorted pool. */
function pickSpreadInBucket(pool: AvailableTimeRow[], count: number): AvailableTimeRow[] {
  if (count <= 0 || pool.length === 0) return [];
  if (pool.length <= count) return [...pool];
  if (count === 1) return [pool[0]];

  const picked: AvailableTimeRow[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * (pool.length - 1)) / (count - 1));
    const row = pool[idx];
    if (!seen.has(row.start_time)) {
      seen.add(row.start_time);
      picked.push(row);
    }
  }
  return picked;
}

/**
 * Up to 6 slots per day: 2 morning, 2 afternoon, 2 evening (ET), then backfill.
 */
function pickVariedSlots(
  candidates: AvailableTimeRow[],
  publicUrl: string
): CalendlySlot[] {
  const byPeriod: Record<DayPeriod, AvailableTimeRow[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  for (const row of candidates) {
    if (row.status !== "available" || !row.start_time) continue;
    byPeriod[periodForSlot(row.start_time)].push(row);
  }

  for (const period of Object.keys(byPeriod) as DayPeriod[]) {
    byPeriod[period].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }

  const chosenRows: AvailableTimeRow[] = [];
  const chosenTimes = new Set<string>();

  for (const period of Object.keys(SLOTS_PER_PERIOD) as DayPeriod[]) {
    const quota = SLOTS_PER_PERIOD[period];
    for (const row of pickSpreadInBucket(byPeriod[period], quota)) {
      if (chosenTimes.has(row.start_time)) continue;
      chosenTimes.add(row.start_time);
      chosenRows.push(row);
    }
  }

  if (chosenRows.length < MAX_SLOTS_PER_DAY) {
    const remainder = candidates
      .filter(
        (row) =>
          row.status === "available" &&
          row.start_time &&
          !chosenTimes.has(row.start_time)
      )
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

    for (const row of remainder) {
      if (chosenRows.length >= MAX_SLOTS_PER_DAY) break;
      chosenTimes.add(row.start_time);
      chosenRows.push(row);
    }
  }

  chosenRows.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return chosenRows.map((row) => rowToSlot(row, publicUrl));
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** Calendly rejects start_time at or before "now"; use a small buffer. */
function availabilityRangeStart(): Date {
  return new Date(Date.now() + START_TIME_BUFFER_MS);
}

type AvailableTimeRow = {
  status: string;
  start_time: string;
  scheduling_url?: string;
};

function ingestAvailableRows(
  byDayRaw: Map<string, AvailableTimeRow[]>,
  rows: AvailableTimeRow[]
): void {
  for (const row of rows) {
    if (row.status !== "available" || !row.start_time) continue;
    if (!isWeekday(row.start_time)) continue;
    const key = dateKeyInTz(row.start_time);
    const list = byDayRaw.get(key) ?? [];
    list.push(row);
    byDayRaw.set(key, list);
  }
}

function finalizeDaySlots(
  byDayRaw: Map<string, AvailableTimeRow[]>,
  publicUrl: string
): Map<string, CalendlySlot[]> {
  const byDay = new Map<string, CalendlySlot[]>();
  for (const [key, rows] of Array.from(byDayRaw.entries())) {
    const slots = pickVariedSlots(rows, publicUrl);
    if (slots.length > 0) byDay.set(key, slots);
  }
  return byDay;
}

async function fetchAvailableTimesChunk(
  token: string,
  eventTypeUri: string,
  start: Date,
  end: Date,
  options?: { fresh?: boolean }
): Promise<AvailableTimeRow[]> {
  const qs = new URLSearchParams({
    event_type: eventTypeUri,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  });

  const data = await calendlyFetch<CalendlyCollection<AvailableTimeRow>>(
    `/event_type_available_times?${qs}`,
    token,
    options
  );
  return data.collection ?? [];
}

/**
 * Live check before booking — list UI can be a few minutes stale if the parent
 * spent time on the form or another invitee took the slot.
 */
export async function isSlotStillAvailable(
  token: string,
  startTimeIso: string,
  publicUrl: string = site.calendlyUrl
): Promise<boolean> {
  const eventTypeUri = await resolveEventTypeUri(token, publicUrl);
  const slotMs = new Date(startTimeIso).getTime();
  const windowStart = new Date(slotMs - 60_000);
  const windowEnd = new Date(slotMs + 90 * 60_000);

  const rows = await fetchAvailableTimesChunk(
    token,
    eventTypeUri,
    windowStart,
    windowEnd,
    { fresh: true }
  );

  return rows.some(
    (row) => row.status === "available" && row.start_time === startTimeIso
  );
}

function dayGroupsFromMap(byDay: Map<string, CalendlySlot[]>): CalendlyDayGroup[] {
  const sortedKeys = Array.from(byDay.keys()).sort();
  const days: CalendlyDayGroup[] = [];

  for (const dateKey of sortedKeys) {
    const slots = byDay.get(dateKey);
    if (!slots?.length) continue;
    const first = slots[0].startTime;
    days.push({
      dateKey,
      weekdayShort: weekdayShort(first),
      dayTitle: dayTitle(first),
      slots,
    });
    if (days.length >= MAX_DAY_TABS) break;
  }

  return days;
}

/** Fetch availability grouped by day, capped at 6 slots per day and 4 day tabs. */
export async function fetchFunnelSchedulerDays(
  token: string,
  publicUrl: string = site.calendlyUrl,
  options?: { fresh?: boolean }
): Promise<CalendlyDayGroup[]> {
  const eventTypeUri = await resolveEventTypeUri(token, publicUrl);
  const byDayRaw = new Map<string, AvailableTimeRow[]>();

  let windowStart = availabilityRangeStart();

  for (let i = 0; i < AVAILABILITY_WINDOW_COUNT; i++) {
    const windowEnd = addUtcDays(windowStart, CALENDLY_MAX_RANGE_DAYS);
    const rows = await fetchAvailableTimesChunk(
      token,
      eventTypeUri,
      windowStart,
      windowEnd,
      options
    );
    ingestAvailableRows(byDayRaw, rows);

    const byDay = finalizeDaySlots(byDayRaw, publicUrl);
    const days = dayGroupsFromMap(byDay);
    if (days.length >= MAX_DAY_TABS) {
      return days;
    }

    windowStart = windowEnd;
  }

  return dayGroupsFromMap(finalizeDaySlots(byDayRaw, publicUrl));
}

export function timezoneLabel(): string {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    timeZoneName: "short",
  })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "ET";
}
