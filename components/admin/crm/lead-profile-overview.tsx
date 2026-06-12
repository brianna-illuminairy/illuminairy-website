"use client";

import type { LeadDetail } from "@/lib/admin/crm-queries";
import { formatBookingDateTime } from "@/lib/admin/format-booking";
import { ProfileCard as Card, ProfileRow as Row } from "./profile-card";

export function LeadProfileOverview({ detail }: { detail: LeadDetail }) {
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
        <Row
          label="Name"
          value={[l.parent_first, l.parent_last].filter(Boolean).join(" ")}
        />
        <Row
          label="Email"
          value={
            <a
              className="font-mono text-xs underline [overflow-wrap:anywhere]"
              href={`mailto:${l.parent_email}`}
            >
              {l.parent_email}
            </a>
          }
        />
        <Row
          label="Phone"
          value={
            l.parent_phone ? (
              <a className="underline" href={`tel:${l.parent_phone}`}>
                {l.parent_phone}
              </a>
            ) : null
          }
        />
      </Card>

      <Card title="Student">
        <Row label="Name" value={l.student_first} />
        <Row label="Grade" value={l.student_grade} />
        <Row label="School" value={l.student_school} />
        <Row label="Target" value={l.target_exam} />
        <Row label="Baseline" value={l.sat_baseline ?? l.score_range} />
        <Row label="Main goal" value={l.main_goal} />
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
