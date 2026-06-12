"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ClientDetail } from "@/lib/admin/clients-queries";
import { LeadProfileCalls } from "./lead-profile-calls";
import { ActivityTimeline } from "./activity-timeline";
import { ClientProfileOverview } from "./client-profile-overview";
import { ClientProfileOpsNotes } from "./client-profile-ops-notes";
import { ClientProfileStudents } from "./client-profile-students";
import { ClientProfileLeadHistory } from "./client-profile-lead-history";

type Tab = "overview" | "ops" | "students" | "calls" | "activity";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "ops", label: "Ops notes" },
  { id: "students", label: "Students" },
  { id: "calls", label: "Calls" },
  { id: "activity", label: "Activity" }
];

function paymentTotal(detail: ClientDetail): number {
  return detail.payments.reduce((s, p) => s + (p.amount_cents ?? 0), 0);
}

export function ClientProfile({
  initialDetail,
  clientId
}: {
  initialDetail: ClientDetail;
  clientId: string;
}) {
  const [detail, setDetail] = useState<ClientDetail>(initialDetail);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as Tab;
      if (TABS.find((t) => t.id === h)) setTab(h);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  async function refresh() {
    const res = await fetch(`/api/admin/clients/${clientId}`, {
      cache: "no-store"
    });
    if (!res.ok) return;
    const json = (await res.json()) as ClientDetail & { ok?: boolean };
    setDetail({
      client: json.client,
      students: json.students,
      enrollments: json.enrollments,
      payments: json.payments,
      lead: json.lead ?? null,
      touches: json.touches ?? []
    });
  }

  const client = detail.client as unknown as {
    parent_first: string | null;
    parent_last: string | null;
    parent_email: string;
    status: string;
    lead_id: string | null;
  };

  const parentName =
    [client.parent_first, client.parent_last].filter(Boolean).join(" ") ||
    client.parent_email;
  const studentNames = detail.students.map((s) => s.first_name).join(", ");

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        {detail.lead ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <p className="text-sm text-sky-900">
              <span className="font-semibold">← Originally a lead.</span> Pre-payment
              sales notes, attribution, and call history live on the lead
              profile.
            </p>
            <Link
              href={`/admin/crm/leads/${detail.lead.id}`}
              className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-800"
            >
              View original lead →
            </Link>
          </div>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">
              {parentName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {studentNames ? `${studentNames} · ` : ""}
              <span className="font-mono text-xs [overflow-wrap:anywhere]">
                {client.parent_email}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                client.status === "active"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {client.status}
            </span>
            <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium">
              ${(paymentTotal(detail) / 100).toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setTab(t.id);
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", `#${t.id}`);
              }
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-6">
          <ClientProfileOverview detail={detail} />
          {detail.lead ? (
            <ClientProfileLeadHistory leadId={detail.lead.id} />
          ) : null}
        </div>
      ) : null}
      {tab === "ops" ? (
        <ClientProfileOpsNotes
          detail={detail}
          clientId={clientId}
          onSaved={refresh}
        />
      ) : null}
      {tab === "students" ? <ClientProfileStudents detail={detail} /> : null}
      {tab === "calls" ? <LeadProfileCalls clientId={clientId} /> : null}
      {tab === "activity" ? (
        <ActivityTimeline
          clientId={clientId}
          touches={detail.touches}
          convertedAt={
            (detail.client as { created_at?: string | null }).created_at ?? null
          }
        />
      ) : null}
    </div>
  );
}
