"use client";

import type { LeadDetail } from "@/lib/admin/crm-queries";
import { formatBookingDateTime } from "@/lib/admin/format-booking";
import { ProfileCard as Card, ProfileRow as Row } from "./profile-card";
import { EditableRow } from "./editable-row";

function formatUsPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

export function LeadProfileOverview({
  detail,
  saving,
  onPatch
}: {
  detail: LeadDetail;
  saving: boolean;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const l = detail.lead as unknown as {
    parent_first: string | null;
    parent_last: string | null;
    parent_email: string;
    parent_phone: string | null;
    student_first: string | null;
    student_grade: string | null;
    student_school: string | null;
    target_exam: string | null;
    sat_baseline: string | null;
    score_range: string | null;
    main_goal: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    landing_page: string | null;
    referrer: string | null;
    gclid: string | null;
    fbclid: string | null;
    booked_call_at: string | null;
    attended_at: string | null;
    calendly_event_uri: string | null;
    created_at: string;
    first_touch_at: string | null;
  };

  const booking = formatBookingDateTime(l.booked_call_at);

  return (
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <Card title="Parent contact">
        <EditableRow
          label="First name"
          value={l.parent_first}
          field="parent_first"
          onSave={onPatch}
          saving={saving}
          placeholder="First name"
        />
        <EditableRow
          label="Last name"
          value={l.parent_last}
          field="parent_last"
          onSave={onPatch}
          saving={saving}
          placeholder="Last name"
        />
        <EditableRow
          label="Email"
          value={l.parent_email}
          field="parent_email"
          onSave={onPatch}
          saving={saving}
          type="email"
          inputMode="email"
          placeholder="parent@example.com"
        />
        <EditableRow
          label="Phone"
          value={l.parent_phone}
          field="parent_phone"
          onSave={onPatch}
          saving={saving}
          type="tel"
          inputMode="tel"
          placeholder="(555) 555-5555"
          formatDisplay={formatUsPhone}
        />
      </Card>

      <Card title="Student">
        <EditableRow
          label="Name"
          value={l.student_first}
          field="student_first"
          onSave={onPatch}
          saving={saving}
          placeholder="Student first name"
        />
        <EditableRow
          label="Grade"
          value={l.student_grade}
          field="student_grade"
          onSave={onPatch}
          saving={saving}
          placeholder="e.g. 11"
        />
        <EditableRow
          label="School"
          value={l.student_school}
          field="student_school"
          onSave={onPatch}
          saving={saving}
          placeholder="School name"
        />
        <EditableRow
          label="Target"
          value={l.target_exam}
          field="target_exam"
          onSave={onPatch}
          saving={saving}
          placeholder="SAT"
        />
        <EditableRow
          label="Baseline"
          value={l.sat_baseline ?? l.score_range}
          field="sat_baseline"
          onSave={onPatch}
          saving={saving}
          placeholder="e.g. 1100-1200"
        />
        <EditableRow
          label="Main goal"
          value={l.main_goal}
          field="main_goal"
          onSave={onPatch}
          saving={saving}
          placeholder="e.g. 1400"
        />
      </Card>

      <Card title="Calendly">
        <Row
          label="Booked for"
          value={
            booking ? (
              <span>
                {booking.absolute}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({booking.relative || "scheduled"})
                </span>
              </span>
            ) : null
          }
        />
        <Row
          label="Attended"
          value={l.attended_at ? new Date(l.attended_at).toLocaleString() : null}
        />
        <Row
          label="Event"
          value={
            l.calendly_event_uri ? (
              <a
                className="font-mono text-xs underline break-all"
                href={l.calendly_event_uri}
                target="_blank"
                rel="noreferrer"
              >
                {l.calendly_event_uri}
              </a>
            ) : null
          }
        />
      </Card>

      <Card title="Source & attribution">
        <Row label="Campaign" value={l.utm_campaign} />
        <Row label="Content" value={l.utm_content} />
        <Row label="Source" value={l.utm_source} />
        <Row label="Medium" value={l.utm_medium} />
        <Row label="Landing" value={l.landing_page} />
        <Row label="Referrer" value={l.referrer} />
        <Row
          label="Click IDs"
          value={[l.gclid, l.fbclid].filter(Boolean).join(" · ") || null}
        />
        <Row
          label="First touch"
          value={
            l.first_touch_at
              ? new Date(l.first_touch_at).toLocaleString()
              : new Date(l.created_at).toLocaleString()
          }
        />
      </Card>
    </div>
  );
}
