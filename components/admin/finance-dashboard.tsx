"use client";

import { useEffect, useState } from "react";
import { SOFTWARE_LICENSE_CENTS } from "@/lib/crm/economics";

type Row = {
  enrollmentId: string;
  clientId: string;
  parentEmail: string;
  studentName: string;
  revenueCents: number;
  costCents: number;
  marginCents: number;
  loggedMinutes: number;
};

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function FinanceDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/finance")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load finance data.");
        return res.json() as Promise<{ enrollments: Row[]; totals: Row }>;
      })
      .then((json) => setRows(json.enrollments))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!rows.length) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          No enrollment economics yet. Active enrollments appear here after payments and costs
          are recorded.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Default software license: {dollars(SOFTWARE_LICENSE_CENTS)} per client.
        </p>
      </div>
    );
  }

  const totalRevenue = rows.reduce((s, r) => s + r.revenueCents, 0);
  const totalCosts = rows.reduce((s, r) => s + r.costCents, 0);
  const totalMargin = totalRevenue - totalCosts;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue, allocated costs (CAC + ${(SOFTWARE_LICENSE_CENTS / 100).toFixed(0)}{" "}
          license), margin, and logged time per client.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total revenue", dollars(totalRevenue)],
          ["Total costs", dollars(totalCosts)],
          ["Gross margin", dollars(totalMargin)]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Per client</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Family</th>
                <th className="py-2 pr-3 font-medium">Revenue</th>
                <th className="py-2 pr-3 font-medium">Costs</th>
                <th className="py-2 pr-3 font-medium">Margin</th>
                <th className="py-2 font-medium">Time logged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.enrollmentId} className="border-b border-border/60">
                  <td className="py-2.5 pr-3">
                    <span className="block font-medium">{row.studentName || "Student"}</span>
                    <span className="text-xs text-muted-foreground">{row.parentEmail}</span>
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">{dollars(row.revenueCents)}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{dollars(row.costCents)}</td>
                  <td
                    className={`py-2.5 pr-3 tabular-nums ${
                      row.marginCents < 0 ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    {dollars(row.marginCents)}
                  </td>
                  <td className="py-2.5 tabular-nums">{row.loggedMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
