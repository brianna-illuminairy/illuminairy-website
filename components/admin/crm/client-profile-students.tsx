"use client";

import type { ClientDetail } from "@/lib/admin/clients-queries";

export function ClientProfileStudents({ detail }: { detail: ClientDetail }) {
  if (detail.students.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No students on file.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {detail.students.map((s) => {
        const enrollment = detail.enrollments.find((e) => e.student_id === s.id);
        return (
          <section
            key={s.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">
                {[s.first_name, s.last_name].filter(Boolean).join(" ")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {[s.grade, s.school].filter(Boolean).join(" · ") || "—"}
              </p>
            </header>
            {enrollment ? (
              <dl
                className="mt-3 grid gap-x-6 gap-y-2 text-sm"
                style={{
                  gridTemplateColumns:
                    "minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content) minmax(0, 1fr)"
                }}
              >
                <dt className="text-xs text-muted-foreground">Program</dt>
                <dd className="min-w-0 break-words [overflow-wrap:anywhere]">
                  {enrollment.program_label ?? enrollment.program}
                </dd>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="min-w-0 break-words">{enrollment.status}</dd>
                <dt className="text-xs text-muted-foreground">Tutor</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.tutor_assigned ?? "—"}
                </dd>
                <dt className="text-xs text-muted-foreground">Baseline</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.baseline_score ?? "—"}
                </dd>
                <dt className="text-xs text-muted-foreground">Target</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.target_score ?? "—"}
                </dd>
                <dt className="text-xs text-muted-foreground">Start date</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.program_start_date ?? "—"}
                </dd>
                <dt className="text-xs text-muted-foreground">Amount paid</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.amount_paid_cents
                    ? `$${(enrollment.amount_paid_cents / 100).toLocaleString()}`
                    : "—"}
                </dd>
                <dt className="text-xs text-muted-foreground">Paid at</dt>
                <dd className="min-w-0 break-words">
                  {enrollment.paid_at
                    ? new Date(enrollment.paid_at).toLocaleDateString()
                    : "—"}
                </dd>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No enrollment for this student.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
