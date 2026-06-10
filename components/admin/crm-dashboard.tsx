"use client";

import { useEffect, useState } from "react";

type Pipeline = {
  byStage: Record<string, number>;
  bookRatePct: number | null;
  showRatePct: number | null;
  noShowCount: number;
  totalLeads: number;
};

type LeadRow = {
  id: string;
  parentEmail: string;
  parentFirst: string | null;
  parentLast: string | null;
  studentFirst: string | null;
  stage: string;
  funnel: string;
  utmCampaign: string | null;
  bookedCallAt: string | null;
  attendedAt: string | null;
  createdAt: string;
};

function pct(v: number | null) {
  if (v === null) return "—";
  return `${v}%`;
}

export function CrmDashboard() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    lead: Record<string, unknown>;
    touches: Array<{ event_type: string; created_at: string; source: string | null }>;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  function loadLeads() {
    return fetch("/api/admin/crm/leads")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load CRM.");
        return res.json() as Promise<{ pipeline: Pipeline; leads: LeadRow[] }>;
      })
      .then((json) => {
        setPipeline(json.pipeline);
        setLeads(json.leads);
      });
  }

  useEffect(() => {
    void fetch("/api/admin/crm/leads")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load CRM.");
        return res.json() as Promise<{ pipeline: Pipeline; leads: LeadRow[] }>;
      })
      .then((json) => {
        setPipeline(json.pipeline);
        setLeads(json.leads);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    void fetch(`/api/admin/leads/${selectedId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load lead.");
        return res.json() as Promise<{
          lead: Record<string, unknown>;
          touches: Array<{ event_type: string; created_at: string; source: string | null }>;
        }>;
      })
      .then(setDetail)
      .catch((err: Error) => setError(err.message));
  }, [selectedId]);

  async function patchLead(body: Record<string, unknown>) {
    if (!selectedId) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not update lead.");
      return;
    }
    await loadLeads();
    const detailRes = await fetch(`/api/admin/leads/${selectedId}`);
    if (detailRes.ok) {
      setDetail(await detailRes.json());
    }
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!pipeline) {
    return <p className="text-sm text-muted-foreground">Loading CRM…</p>;
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leads, bookings, show rate, and pipeline stages (internal emails excluded).
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total leads", pipeline.totalLeads],
          ["Book rate", pct(pipeline.bookRatePct)],
          ["Show rate", pct(pipeline.showRatePct)],
          ["No-show risk", pipeline.noShowCount]
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
        <h2 className="text-lg font-semibold">Pipeline by stage</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(pipeline.byStage).map(([stage, count]) => (
            <li key={stage} className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{stage}</span>
              <p className="text-lg font-semibold tabular-nums">{count}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Leads</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Parent</th>
                <th className="py-2 pr-3 font-medium">Student</th>
                <th className="py-2 pr-3 font-medium">Stage</th>
                <th className="py-2 pr-3 font-medium">Funnel</th>
                <th className="py-2 pr-3 font-medium">Campaign</th>
                <th className="py-2 font-medium">Booked</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className={`cursor-pointer border-b border-border/60 hover:bg-muted/30 ${
                    selectedId === lead.id ? "bg-muted/40" : ""
                  }`}
                  onClick={() => {
                    setSelectedId(lead.id);
                    setDetail(null);
                  }}
                >
                  <td className="py-2.5 pr-3">
                    <span className="block font-medium">
                      {[lead.parentFirst, lead.parentLast].filter(Boolean).join(" ") || "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">{lead.parentEmail}</span>
                  </td>
                  <td className="py-2.5 pr-3">{lead.studentFirst ?? "—"}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs">{lead.stage}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs">{lead.funnel}</td>
                  <td className="max-w-[140px] truncate py-2.5 pr-3 font-mono text-xs">
                    {lead.utmCampaign ?? "—"}
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {lead.bookedCallAt
                      ? new Date(lead.bookedCallAt).toLocaleDateString()
                      : "—"}
                    {lead.attendedAt ? " · attended" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detail && selectedId ? (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">Lead detail</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {String(detail.lead.parent_email ?? "")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="text-sm">
              Stage
              <select
                className="ml-2 rounded border border-border bg-background px-2 py-1"
                value={String(detail.lead.stage ?? "")}
                disabled={saving}
                onChange={(e) => void patchLead({ stage: e.target.value })}
              >
                {[
                  "intake_submitted",
                  "call_booked",
                  "call_attended",
                  "won",
                  "lost"
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={saving}
              className="rounded-lg border border-border px-3 py-1.5 text-sm"
              onClick={() => void patchLead({ attended: true })}
            >
              Mark attended
            </button>
          </div>
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {detail.touches.slice(0, 8).map((t, i) => (
              <li key={`${t.event_type}-${i}`}>
                {t.event_type} · {new Date(t.created_at).toLocaleString()} · {t.source}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
