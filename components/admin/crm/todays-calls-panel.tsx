"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TodayCall } from "@/lib/admin/todays-calls";
import { URGENCY_META } from "@/lib/admin/lead-tag-suggestions";

export function TodaysCallsPanel() {
  const [calls, setCalls] = useState<TodayCall[] | null>(null);

  useEffect(() => {
    let aborted = false;
    fetch("/api/admin/crm/todays-calls", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { calls: TodayCall[] };
        if (!aborted) setCalls(json.calls);
      })
      .catch(() => {
        /* silent */
      });
    return () => {
      aborted = true;
    };
  }, []);

  if (calls === null) {
    return (
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Today&apos;s calls</h2>
        <p className="mt-2 text-xs text-muted-foreground">Loading…</p>
      </section>
    );
  }

  if (calls.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Today&apos;s calls</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          No scheduled Strategy Calls left today.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Today&apos;s calls</h2>
        <span className="text-[10px] text-muted-foreground">{calls.length} scheduled</span>
      </div>
      <ul className="mt-3 space-y-2">
        {calls.map((c) => (
          <li
            key={c.callId}
            className={`flex items-center gap-3 rounded-lg border p-2 text-sm ${
              c.urgencyLevel === "critical"
                ? "border-rose-300 bg-rose-50/40"
                : c.urgencyLevel === "high"
                  ? "border-amber-300 bg-amber-50/40"
                  : c.noShowRisk
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-border bg-background"
            }`}
          >
            <div className="w-16 text-right text-xs font-mono">{fmtTime(c.scheduledStart)}</div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">
                {c.parentName ?? c.parentEmail}
                {c.studentFirst && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    · {c.studentFirst}
                  </span>
                )}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{c.parentEmail}</p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {c.urgencyLevel && (
                  <span
                    title={c.urgencyReason ?? URGENCY_META[c.urgencyLevel].description}
                    className={`rounded-sm px-1 py-0.5 text-[9px] font-semibold uppercase ${URGENCY_META[c.urgencyLevel].tone}`}
                  >
                    {URGENCY_META[c.urgencyLevel].label}
                  </span>
                )}
                {c.noShowRisk && (
                  <span
                    title={c.noShowRiskReason ?? ""}
                    className="rounded-sm bg-amber-200 px-1 py-0.5 text-[9px] font-semibold uppercase text-amber-900"
                  >
                    ⚠ risk
                  </span>
                )}
                {c.confirmedAt && (
                  <span className="rounded-sm bg-emerald-200 px-1 py-0.5 text-[9px] font-semibold uppercase text-emerald-900">
                    ✓ confirmed
                  </span>
                )}
              </div>
            </div>
            {c.leadScore !== null && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  c.leadScore >= 80
                    ? "bg-rose-200 text-rose-900"
                    : c.leadScore >= 60
                      ? "bg-amber-200 text-amber-900"
                      : "bg-sky-200 text-sky-900"
                }`}
              >
                {c.leadScore}
              </span>
            )}
            <div className="flex flex-col items-end gap-0.5 text-xs">
              {c.meetLink && (
                <a
                  href={c.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-700 underline"
                >
                  Meet
                </a>
              )}
              {c.leadId && (
                <Link href={`/admin/crm/leads/${c.leadId}#calls`} className="underline">
                  Brief
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York"
    });
  } catch {
    return iso;
  }
}
