"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ClientListRow } from "@/lib/admin/clients-queries";

function formatMoney(cents: number): string {
  if (!cents) return "$0";
  return `$${(cents / 100).toLocaleString("en-US", {
    maximumFractionDigits: 0
  })}`;
}

export function ParentsList() {
  const [clients, setClients] = useState<ClientListRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/admin/clients", { cache: "no-store", signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load clients.");
        return res.json() as Promise<{ clients: ClientListRow[] }>;
      })
      .then((j) => setClients(j.clients))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => ctrl.abort();
  }, []);

  const filtered = useMemo(() => {
    if (!clients) return [];
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!query) return true;
      const hay = [
        c.parentEmail,
        c.parentFirst,
        c.parentLast,
        ...c.studentNames
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query.toLowerCase());
    });
  }, [clients, query, statusFilter]);

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          className="w-72 max-w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Search by parent, email, student…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {clients ? (
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {clients.length}
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Parent</th>
              <th className="px-4 py-2.5 font-medium">Student(s)</th>
              <th className="px-4 py-2.5 font-medium">Program</th>
              <th className="px-4 py-2.5 font-medium">Started</th>
              <th className="px-4 py-2.5 font-medium">Payment</th>
              <th className="px-4 py-2.5 font-medium">Weekly</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!clients ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  {clients.length === 0
                    ? "No clients yet."
                    : "No clients match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/crm/clients/${c.id}`} className="block">
                      <span className="block font-medium">
                        {[c.parentFirst, c.parentLast].filter(Boolean).join(" ") ||
                          "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.parentEmail}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {c.studentNames.length > 0 ? (
                      <span>
                        {c.studentNames.join(", ")}
                        {c.studentNames.length > 1 ? (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({c.studentNames.length})
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-xs">
                    {c.programLabel ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {c.paidAt
                      ? new Date(c.paidAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatMoney(c.paymentTotalCents)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      title="Weekly email opt-in"
                      className={`mr-1 inline-block h-2 w-2 rounded-full ${
                        c.weeklyReportEmailOptIn ? "bg-emerald-500" : "bg-muted"
                      }`}
                    />
                    <span
                      title="Weekly SMS opt-in"
                      className={`inline-block h-2 w-2 rounded-full ${
                        c.weeklyReportSmsOptIn ? "bg-emerald-500" : "bg-muted"
                      }`}
                    />
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {c.sourceUtmCampaign ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                        c.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
