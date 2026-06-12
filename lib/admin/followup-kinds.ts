/**
 * Follow-up task classification for leads. Keep in sync with the
 * `leads_next_followup_kind_chk` check constraint in migration
 * 20260612124000_crm_v1_followup_kind.sql.
 *
 * Each kind ships a default offset (when the follow-up should land if you
 * click the quick-preset button) and a starter note. The user can still
 * edit both before saving.
 */

export const FOLLOWUP_KINDS = [
  "mark_attendance",
  "no_show_reschedule",
  "post_call",
  "post_call_check_in",
  "general"
] as const;

export type FollowupKind = (typeof FOLLOWUP_KINDS)[number];

type KindConfig = {
  label: string;
  shortLabel: string;
  /** Tailwind classes for the colored tag rendered in lists/profiles. */
  tone: string;
  /** Hours from "now" the quick-preset button should set next_followup_at to. */
  defaultOffsetHours: number;
  /** Starter note text the quick-preset button drops into next_followup_note. */
  defaultNote: string;
  /**
   * True when this kind is created automatically by DB triggers or the
   * follow-up state machine. Hidden from the manual preset buttons because
   * the user shouldn't pick them directly — the system does.
   */
  auto: boolean;
};

export const FOLLOWUP_KIND_CONFIG: Record<FollowupKind, KindConfig> = {
  mark_attendance: {
    label: "Mark attendance",
    shortLabel: "Mark attendance",
    tone: "bg-sky-100 text-sky-900",
    defaultOffsetHours: 0,
    defaultNote: "Mark Strategy Call attended or no-show",
    auto: true
  },
  no_show_reschedule: {
    label: "No-show reschedule",
    shortLabel: "Reschedule",
    tone: "bg-amber-100 text-amber-900",
    defaultOffsetHours: 18,
    defaultNote: "Reach out re: rescheduling the Strategy Call",
    auto: false
  },
  post_call: {
    label: "Send post-call email",
    shortLabel: "Post-call email",
    tone: "bg-violet-100 text-violet-900",
    defaultOffsetHours: 0,
    defaultNote: "Send post-call email",
    auto: false
  },
  post_call_check_in: {
    label: "Post-call check-in",
    shortLabel: "Check-in",
    tone: "bg-fuchsia-100 text-fuchsia-900",
    defaultOffsetHours: 72,
    defaultNote: "Check in 3 days after the Strategy Call",
    auto: true
  },
  general: {
    label: "General follow-up",
    shortLabel: "Follow-up",
    tone: "bg-slate-100 text-slate-800",
    defaultOffsetHours: 24,
    defaultNote: "",
    auto: false
  }
};

export const MANUAL_FOLLOWUP_KINDS = FOLLOWUP_KINDS.filter(
  (k) => !FOLLOWUP_KIND_CONFIG[k].auto
);

export function isFollowupKind(value: unknown): value is FollowupKind {
  return typeof value === "string" && (FOLLOWUP_KINDS as readonly string[]).includes(value);
}

export function followupKindLabel(kind: string | null): string | null {
  if (!kind || !isFollowupKind(kind)) return null;
  return FOLLOWUP_KIND_CONFIG[kind].label;
}

export function followupKindTone(kind: string | null): string {
  if (!kind || !isFollowupKind(kind)) return "bg-slate-100 text-slate-800";
  return FOLLOWUP_KIND_CONFIG[kind].tone;
}

/**
 * Produce a date string suitable for an `<input type="datetime-local">` field
 * representing `offsetHours` from now, snapped to the next 9am if the result
 * would land outside 8am–7pm local time.
 */
export function defaultFollowupDateTimeLocal(offsetHours: number): string {
  const target = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  const hour = target.getHours();
  if (hour < 8 || hour >= 19) {
    if (hour >= 19) target.setDate(target.getDate() + 1);
    target.setHours(9, 0, 0, 0);
  }
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(
    target.getHours()
  )}:${pad(target.getMinutes())}`;
}
