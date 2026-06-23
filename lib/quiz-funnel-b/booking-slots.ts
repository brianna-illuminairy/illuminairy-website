/** Plan Builder B — cap native scheduler to tomorrow + next day, 3 times each. */

const DISPLAY_TZ = "America/New_York";
export const LAB_BOOKING_MAX_DAYS = 2;
export const LAB_BOOKING_MAX_SLOTS_PER_DAY = 3;

export type LabBookingDay = {
  dateKey: string;
  weekdayShort: string;
  dayTitle: string;
  slots: Array<{ startTime: string; schedulingUrl: string; label: string }>;
};

function dateKeyInEt(isoOrDate: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate);
}

function formatMonthDay(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    month: "short",
    day: "numeric",
  }).formatToParts(new Date(iso));
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${month}, ${day}`;
}

/** Relative card title — Today, Tomorrow, or weekday. */
export function labBookingDayCardLabel(
  slotIso: string,
  weekdayShort: string,
  _dayIndex: number,
  dateKey?: string
): { heading: string; sub: string } {
  const sub = formatMonthDay(slotIso);
  const today = dateKeyInEt(new Date());
  const key = dateKey ?? dateKeyInEt(slotIso);

  if (key === today) {
    return { heading: "Today", sub };
  }

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  if (key === dateKeyInEt(tomorrowDate)) {
    return { heading: "Tomorrow", sub };
  }

  return { heading: weekdayShort, sub };
}

/** Keep at most two days (today onward) with three slots each. */
export function limitLabBookingDays(days: LabBookingDay[]): LabBookingDay[] {
  const today = dateKeyInEt(new Date());
  return days
    .filter((day) => day.dateKey >= today && day.slots.length > 0)
    .slice(0, LAB_BOOKING_MAX_DAYS)
    .map((day) => ({
      ...day,
      slots: day.slots.slice(0, LAB_BOOKING_MAX_SLOTS_PER_DAY),
    }));
}
