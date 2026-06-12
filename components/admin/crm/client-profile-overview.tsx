"use client";

import type { ClientDetail } from "@/lib/admin/clients-queries";
import { ProfileCard, ProfileRow as BaseRow } from "./profile-card";

function Card(props: { title: string; children: React.ReactNode }) {
  return <ProfileCard {...props} />;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <BaseRow label={label} value={value} labelWidth="120px" />;
}

export function ClientProfileOverview({ detail }: { detail: ClientDetail }) {
  const c = detail.client as unknown as {
    parent_first: string | null;
    parent_last: string | null;
    parent_email: string;
    parent_phone: string | null;
    weekly_report_email_opt_in: boolean | null;
    weekly_report_sms_opt_in: boolean | null;
    weekly_report_sms_consent_at: string | null;
    created_at: string;
  };
  const enrollment = detail.enrollments[0];
  const primaryStudent = detail.students[0];
  const paymentTotal = detail.payments.reduce(
    (s, p) => s + (p.amount_cents ?? 0),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <Card title="Parent">
        <Row
          label="Name"
          value={[c.parent_first, c.parent_last].filter(Boolean).join(" ")}
        />
        <Row
          label="Email"
          value={
            <a
              className="font-mono text-xs underline [overflow-wrap:anywhere]"
              href={`mailto:${c.parent_email}`}
            >
              {c.parent_email}
            </a>
          }
        />
        <Row
          label="Phone"
          value={
            c.parent_phone ? (
              <a className="underline" href={`tel:${c.parent_phone}`}>
                {c.parent_phone}
              </a>
            ) : null
          }
        />
        <Row label="Client since" value={new Date(c.created_at).toLocaleDateString()} />
      </Card>

      <Card title="Primary student">
        {primaryStudent ? (
          <>
            <Row
              label="Name"
              value={
                [primaryStudent.first_name, primaryStudent.last_name]
                  .filter(Boolean)
                  .join(" ")
              }
            />
            <Row label="Grade" value={primaryStudent.grade} />
            <Row label="School" value={primaryStudent.school} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No student on file.</p>
        )}
      </Card>

      <Card title="Program">
        {enrollment ? (
          <>
            <Row label="Program" value={enrollment.program_label ?? enrollment.program} />
            <Row label="Status" value={enrollment.status} />
            <Row label="Tutor" value={enrollment.tutor_assigned} />
            <Row label="Baseline" value={enrollment.baseline_score} />
            <Row label="Target" value={enrollment.target_score} />
            <Row label="Start date" value={enrollment.program_start_date} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No active enrollment.</p>
        )}
      </Card>

      <Card title="Payments">
        <Row
          label="Total paid"
          value={
            <span className="font-semibold">
              ${(paymentTotal / 100).toLocaleString()}
            </span>
          }
        />
        <Row
          label="Most recent"
          value={
            detail.payments[0]
              ? `${new Date(detail.payments[0].paid_at).toLocaleDateString()} · $${(
                  detail.payments[0].amount_cents / 100
                ).toLocaleString()}`
              : null
          }
        />
        <Row label="Payment count" value={detail.payments.length} />
      </Card>

      <Card title="Weekly progress report">
        <Row
          label="Email"
          value={
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                c.weekly_report_email_opt_in
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {c.weekly_report_email_opt_in ? "Opted in" : "Not set"}
            </span>
          }
        />
        <Row
          label="SMS"
          value={
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                c.weekly_report_sms_opt_in
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {c.weekly_report_sms_opt_in ? "Opted in" : "Not set"}
            </span>
          }
        />
        <Row
          label="SMS consent"
          value={
            c.weekly_report_sms_consent_at
              ? new Date(c.weekly_report_sms_consent_at).toLocaleString()
              : null
          }
        />
      </Card>
    </div>
  );
}
