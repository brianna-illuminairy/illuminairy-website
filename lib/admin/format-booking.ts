const SHORT_WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});
const TIME_OF_DAY = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit"
});
const RELATIVE = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

function relative(iso: string, nowMs: number): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "";
  const diffMs = target - nowMs;
  const diffMin = Math.round(diffMs / 60000);
  const absMin = Math.abs(diffMin);

  if (absMin < 60) return RELATIVE.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return RELATIVE.format(diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 14) return RELATIVE.format(diffDay, "day");
  const diffWeek = Math.round(diffDay / 7);
  return RELATIVE.format(diffWeek, "week");
}

export type BookingFormat = {
  date: string;
  time: string;
  relative: string;
  absolute: string;
  combined: string;
  isOverdue: boolean;
};

export function formatBookingDateTime(
  iso: string | null | undefined,
  nowMs: number = Date.now()
): BookingFormat | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const weekday = SHORT_WEEKDAY.format(d);
  const date = `${weekday} ${SHORT_DATE.format(d)}`;
  const time = TIME_OF_DAY.format(d);
  const rel = relative(iso, nowMs);

  return {
    date,
    time,
    relative: rel,
    absolute: `${date} · ${time}`,
    combined: rel ? `${date} · ${time} · ${rel}` : `${date} · ${time}`,
    isOverdue: d.getTime() < nowMs
  };
}

export function formatFollowup(
  iso: string | null | undefined,
  nowMs: number = Date.now()
):
  | (BookingFormat & { tone: "overdue" | "today" | "soon" | "later" })
  | null {
  const base = formatBookingDateTime(iso, nowMs);
  if (!base) return null;
  const d = new Date(iso as string);
  const sameDay =
    new Date(nowMs).toDateString() === d.toDateString();
  let tone: "overdue" | "today" | "soon" | "later" = "later";
  if (base.isOverdue && !sameDay) tone = "overdue";
  else if (sameDay) tone = "today";
  else if (d.getTime() - nowMs <= 7 * 24 * 60 * 60 * 1000) tone = "soon";
  return { ...base, tone };
}
