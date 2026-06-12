"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CrmLeadRow } from "@/lib/admin/crm-queries";
import { useWallClock } from "@/lib/admin/use-wall-clock";
import { LeadsList } from "./crm/leads-list";
import { LeadsPipeline } from "./crm/leads-pipeline";
import { LeadsDueToday } from "./crm/leads-due-today";
import { TodaysCallsPanel } from "./crm/todays-calls-panel";

type Pipeline = {
  byStage: Record<string, number>;
  bookRatePct: number | null;
  showRatePct: number | null;
  noShowCount: number;
  totalLeads: number;
};

type Payload = { pipeline: Pipeline; leads: CrmLeadRow[] };

type View = "list" | "pipeline" | "due";

const VIEWS: Array<{ id: View; label: string }> = [
  { id: "list", label: "List" },
  { id: "pipeline", label: "Pipeline" },
  { id: "due", label: "Due today" }
];

function pct(v: number | null) {
  if (v === null) return "—";
  return `${v}%`;
}

export function CrmDashboard() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [leads, setLeads] = useState<CrmLeadRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(() => {
    if (typeof window === "undefined") return "list";
    const params = new URLSearchParams(window.location.search);
    const v = (params.get("view") ?? "list") as View;
    return VIEWS.find((x) => x.id === v) ? v : "list";
  });

  const setViewAndUrl = useCallback((v: View) => {
    setView(v);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", v);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  const load = useCallback(() => {
    return fetch("/api/admin/crm/leads", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load CRM.");
        return res.json() as Promise<Payload & { ok?: boolean }>;
      })
      .then((json) => {
        setPipeline(json.pipeline);
        setLeads(json.leads);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const nowMs = useWallClock();

  const dueTodayCount = useMemo(() => {
    if (!leads || !nowMs) return 0;
    const endOfDay = new Date(nowMs);
    endOfDay.setHours(23, 59, 59, 999);
    return leads.filter((l) => {
      if (!l.nextFollowupAt) return false;
      if (l.stage === "won" || l.stage === "lost") return false;
      return new Date(l.nextFollowupAt).getTime() <= endOfDay.getTime();
    }).length;
  }, [leads, nowMs]);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!pipeline) {
    return <p className="text-sm text-muted-foreground">Loading CRM…</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Leads, pipeline, followups. Internal emails excluded.
          </p>
        </div>
        <Link
          href="/admin/crm/clients"
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          View clients →
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Total leads" value={pipeline.totalLeads} />
        <Kpi label="Book rate" value={pct(pipeline.bookRatePct)} />
        <Kpi label="Show rate" value={pct(pipeline.showRatePct)} />
        <Kpi label="No-show risk" value={pipeline.noShowCount} />
        <Kpi
          label="Due today"
          value={dueTodayCount}
          onClick={() => setViewAndUrl("due")}
          highlight={dueTodayCount > 0}
        />
      </section>

      <TodaysCallsPanel />

      <div className="flex items-center gap-1 border-b border-border">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              view === v.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewAndUrl(v.id)}
          >
            {v.label}
            {v.id === "due" && dueTodayCount > 0 ? (
              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 text-xs text-amber-900">
                {dueTodayCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {view === "list" ? <LeadsList leads={leads} /> : null}
      {view === "pipeline" ? (
        <LeadsPipeline leads={leads} onChange={load} />
      ) : null}
      {view === "due" ? <LeadsDueToday leads={leads} /> : null}
    </div>
  );
}

function Kpi({
  label,
  value,
  onClick,
  highlight
}: {
  label: string;
  value: number | string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  const className = `rounded-xl border p-4 text-left transition-colors ${
    highlight
      ? "border-amber-300 bg-amber-50"
      : "border-border bg-surface hover:border-primary/40"
  }`;
  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}
