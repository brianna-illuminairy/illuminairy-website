"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { CrmLeadRow } from "@/lib/admin/crm-queries";
import { formatFollowup } from "@/lib/admin/format-booking";
import { StageBadge } from "./stage-badge";

function useWallClock(intervalMs = 60_000): number {
  return useSyncExternalStore(
    (callback) => {
      const id = setInterval(callback, intervalMs);
      return () => clearInterval(id);
    },
    () => Date.now(),
    () => 0
  );
}

type Bucket = "overdue" | "today" | "thisWeek";

const BUCKET_LABEL: Record<Bucket, string> = {
  overdue: "Overdue",
  today: "Today",
  thisWeek: "This week"
};

function bucketFor(iso: string, nowMs: number): Bucket {
  const target = new Date(iso).getTime();
  const today = new Date(nowMs);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  if (target < today.setHours(0, 0, 0, 0)) return "overdue";
  if (target <= endOfDay.getTime()) return "today";
  return "thisWeek";
}

export function LeadsDueToday({ leads }: { leads: CrmLeadRow[] }) {
  const nowMs = useWallClock();

  const buckets = useMemo(() => {
    const out: Record<Bucket, CrmLeadRow[]> = {
      overdue: [],
      today: [],
      thisWeek: []
    };
    if (!nowMs) return out;
    const weekOut = nowMs + 7 * 24 * 60 * 60 * 1000;
    for (const lead of leads) {
      if (!lead.nextFollowupAt) continue;
      if (lead.stage === "won" || lead.stage === "lost") continue;
      const targetMs = new Date(lead.nextFollowupAt).getTime();
      if (targetMs > weekOut) continue;
      out[bucketFor(lead.nextFollowupAt, nowMs)].push(lead);
    }
    for (const k of Object.keys(out) as Bucket[]) {
      out[k].sort(
        (a, b) =>
          new Date(a.nextFollowupAt as string).getTime() -
          new Date(b.nextFollowupAt as string).getTime()
      );
    }
    return out;
  }, [leads, nowMs]);

  const empty =
    buckets.overdue.length === 0 &&
    buckets.today.length === 0 &&
    buckets.thisWeek.length === 0;

  if (empty) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Nothing on your followup queue this week. Set a followup date from any
        lead profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(Object.keys(buckets) as Bucket[]).map((b) => {
        const rows = buckets[b];
        if (rows.length === 0) return null;
        return (
          <section key={b}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {BUCKET_LABEL[b]}{" "}
              <span className="ml-2 text-xs text-muted-foreground/70">
                {rows.length}
              </span>
            </h2>
            <ul className="space-y-2">
              {rows.map((lead) => (
                <DueRow key={lead.id} lead={lead} bucket={b} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function DueRow({ lead, bucket }: { lead: CrmLeadRow; bucket: Bucket }) {
  const followup = formatFollowup(lead.nextFollowupAt);
  const tone =
    bucket === "overdue"
      ? "border-rose-200 bg-rose-50"
      : bucket === "today"
        ? "border-amber-200 bg-amber-50"
        : "border-border bg-surface";
  return (
    <li>
      <Link
        href={`/admin/crm/leads/${lead.id}`}
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm hover:border-foreground/30 ${tone}`}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium">
            {[lead.parentFirst, lead.parentLast].filter(Boolean).join(" ") ||
              lead.parentEmail}
          </p>
          <p className="text-xs text-muted-foreground">
            {lead.studentFirst ? `${lead.studentFirst} · ` : ""}
            {lead.parentEmail}
          </p>
          {lead.nextFollowupNote ? (
            <p className="mt-1 text-sm">{lead.nextFollowupNote}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1 text-xs">
          <StageBadge stage={lead.stage} />
          {followup ? (
            <span className="text-muted-foreground">
              {followup.relative} · {followup.absolute}
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
