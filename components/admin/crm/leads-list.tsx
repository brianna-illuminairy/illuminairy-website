"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CrmLeadRow } from "@/lib/admin/crm-queries";
import { formatBookingDateTime, formatFollowup } from "@/lib/admin/format-booking";
import {
  FOLLOWUP_KIND_CONFIG,
  followupKindTone,
  isFollowupKind
} from "@/lib/admin/followup-kinds";
import { useWallClock } from "@/lib/admin/use-wall-clock";
import { URGENCY_META, type UrgencyLevel } from "@/lib/admin/lead-tag-suggestions";
import { StageBadge } from "./stage-badge";

type SortKey =
  | "upcoming_calls"
  | "newest"
  | "oldest"
  | "followup_soonest"
  | "booking_soonest";

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: "upcoming_calls", label: "Upcoming calls first" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "followup_soonest", label: "Followup soonest" },
  { id: "booking_soonest", label: "Booking soonest" }
];

/**
 * Three-tier sort that puts what you need to act on at the top:
 *   1. Future bookings (soonest first) — your next active call leads.
 *   2. No-show outreach needed: explicit `no_show` stage, OR `call_booked`
 *      with a past booking and no attended_at. Most-recently-passed first
 *      since those are freshest.
 *   3. Everything else by created_at desc.
 */
function upcomingCallsRank(
  lead: {
    stage: string;
    bookedCallAt: string | null;
    attendedAt: string | null;
    createdAt: string;
  },
  now: number
): { tier: 0 | 1 | 2; tiebreaker: number } {
  if (lead.bookedCallAt) {
    const bookedMs = new Date(lead.bookedCallAt).getTime();
    if (bookedMs >= now && lead.stage !== "no_show") {
      return { tier: 0, tiebreaker: bookedMs };
    }
    if (lead.stage === "no_show" || (!lead.attendedAt && lead.stage === "call_booked")) {
      return { tier: 1, tiebreaker: -bookedMs };
    }
  } else if (lead.stage === "no_show") {
    return { tier: 1, tiebreaker: -new Date(lead.createdAt).getTime() };
  }
  return { tier: 2, tiebreaker: -new Date(lead.createdAt).getTime() };
}

function matchesQuery(lead: CrmLeadRow, q: string): boolean {
  if (!q) return true;
  const haystack = [
    lead.parentEmail,
    lead.parentFirst,
    lead.parentLast,
    lead.studentFirst
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function LeadsList({ leads }: { leads: CrmLeadRow[] }) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [hideConverted, setHideConverted] = useState(true);
  const [sort, setSort] = useState<SortKey>("upcoming_calls");
  const nowMs = useWallClock();

  const stages = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) set.add(l.stage);
    return Array.from(set);
  }, [leads]);

  const filtered = useMemo(() => {
    const out = leads.filter((l) => {
      if (!matchesQuery(l, query)) return false;
      if (stageFilter !== "all" && l.stage !== stageFilter) return false;
      if (hideConverted && l.convertedClientId) return false;
      return true;
    });

    out.sort((a, b) => {
      switch (sort) {
        case "upcoming_calls": {
          const ra = upcomingCallsRank(a, nowMs);
          const rb = upcomingCallsRank(b, nowMs);
          if (ra.tier !== rb.tier) return ra.tier - rb.tier;
          return ra.tiebreaker - rb.tiebreaker;
        }
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "followup_soonest": {
          const av = a.nextFollowupAt
            ? new Date(a.nextFollowupAt).getTime()
            : Number.POSITIVE_INFINITY;
          const bv = b.nextFollowupAt
            ? new Date(b.nextFollowupAt).getTime()
            : Number.POSITIVE_INFINITY;
          return av - bv;
        }
        case "booking_soonest": {
          const av = a.bookedCallAt
            ? new Date(a.bookedCallAt).getTime()
            : Number.POSITIVE_INFINITY;
          const bv = b.bookedCallAt
            ? new Date(b.bookedCallAt).getTime()
            : Number.POSITIVE_INFINITY;
          return av - bv;
        }
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return out;
  }, [leads, query, stageFilter, hideConverted, sort, nowMs]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by parent or student name, email…"
          className="w-72 max-w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="all">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              Sort: {s.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hideConverted}
            onChange={(e) => setHideConverted(e.target.checked)}
          />
          Hide converted clients
        </label>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} of {leads.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Parent</th>
              <th className="px-4 py-2.5 font-medium">Student</th>
              <th className="px-4 py-2.5 font-medium">Stage</th>
              <th className="px-4 py-2.5 font-medium">Heat</th>
              <th className="px-4 py-2.5 font-medium">Booking</th>
              <th className="px-4 py-2.5 font-medium">Followup</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  {leads.length === 0
                    ? "No leads yet."
                    : "No leads match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LeadRow({ lead }: { lead: CrmLeadRow }) {
  const booking = formatBookingDateTime(lead.bookedCallAt);
  const followup = formatFollowup(lead.nextFollowupAt);
  const isConverted = !!lead.convertedClientId;

  const followupClass =
    followup?.tone === "overdue"
      ? "text-rose-700 font-medium"
      : followup?.tone === "today"
        ? "text-amber-700 font-medium"
        : "text-muted-foreground";

  return (
    <tr
      className={`border-b border-border/60 hover:bg-muted/30 ${
        isConverted ? "opacity-60" : ""
      }`}
    >
      <td className="px-4 py-3">
        <Link
          href={`/admin/crm/leads/${lead.id}`}
          className="block"
        >
          <span className="block font-medium">
            {[lead.parentFirst, lead.parentLast].filter(Boolean).join(" ") || "—"}
          </span>
          <span className="text-xs text-muted-foreground">{lead.parentEmail}</span>
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link href={`/admin/crm/leads/${lead.id}`}>{lead.studentFirst ?? "—"}</Link>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <StageBadge stage={lead.stage} />
          {lead.urgencyLevel ? (
            <UrgencyChip level={lead.urgencyLevel} reason={lead.urgencyReason} />
          ) : null}
        </div>
        {lead.awaitingReplySince ? <AwaitingReplyChip since={lead.awaitingReplySince} /> : null}
      </td>
      <td className="px-4 py-3">
        <HeatChip score={lead.leadScoreCurrent} />
      </td>
      <td className="px-4 py-3 text-xs">
        {booking ? (
          <span className="block">
            {booking.absolute}
            <span className="block text-[10px] text-muted-foreground">
              {booking.relative}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className={`px-4 py-3 text-xs ${followupClass}`}>
        {followup ? (
          <span className="block space-y-1">
            <span className="block">{followup.relative}</span>
            <span className="block text-[10px] opacity-70">{followup.absolute}</span>
            {isFollowupKind(lead.nextFollowupKind) ? (
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${followupKindTone(lead.nextFollowupKind)}`}
              >
                {FOLLOWUP_KIND_CONFIG[lead.nextFollowupKind].shortLabel}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="max-w-[160px] truncate px-4 py-3 font-mono text-[11px] text-muted-foreground">
        {lead.utmCampaign ?? "—"}
      </td>
      <td className="px-4 py-3 text-xs">
        {isConverted ? (
          <Link
            href={`/admin/crm/clients/${lead.convertedClientId}`}
            className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 hover:bg-emerald-200"
          >
            Client →
          </Link>
        ) : (
          <span className="text-muted-foreground">Lead</span>
        )}
      </td>
    </tr>
  );
}

function HeatChip({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const tone =
    score >= 80
      ? "bg-rose-200 text-rose-900"
      : score >= 60
        ? "bg-amber-200 text-amber-900"
        : score >= 40
          ? "bg-sky-200 text-sky-900"
          : "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex h-7 w-10 items-center justify-center rounded-md text-xs font-semibold tabular-nums ${tone}`}>
      {score}
    </span>
  );
}

function UrgencyChip({
  level,
  reason
}: {
  level: UrgencyLevel;
  reason: string | null;
}) {
  const meta = URGENCY_META[level];
  return (
    <span
      title={reason ?? meta.description}
      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${meta.tone}`}
    >
      {meta.label}
    </span>
  );
}

function AwaitingReplyChip({ since }: { since: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const days = Math.max(0, Math.floor((now - new Date(since).getTime()) / 86_400_000));
  const tone =
    days >= 3 ? "bg-rose-100 text-rose-900" : days >= 1 ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900";
  return (
    <span className={`mt-1 block w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
      Reply due {days === 0 ? "today" : `${days}d`}
    </span>
  );
}
