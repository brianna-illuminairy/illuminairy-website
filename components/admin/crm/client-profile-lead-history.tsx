"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";

export function ClientProfileLeadHistory({ leadId }: { leadId: string }) {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/admin/leads/${leadId}`, {
      cache: "no-store",
      signal: ctrl.signal
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((j: LeadDetail | null) => {
        if (j) {
          setDetail({
            lead: j.lead,
            touches: j.touches,
            quizAnswers: j.quizAnswers ?? {},
            client: j.client ?? null
          });
        }
      })
      .catch(() => {
        /* aborted or fetch failed */
      });
    return () => ctrl.abort();
  }, [leadId]);

  if (!detail) {
    return null;
  }

  const lead = detail.lead as unknown as {
    sales_notes: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    landing_page: string | null;
    booked_call_at: string | null;
    attended_at: string | null;
    converted_at: string | null;
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Lead history
        </h2>
        <span className="text-xs text-muted-foreground">
          {open ? "Hide" : "Show"} · {detail.touches.length} touches
        </span>
      </button>

      {open ? (
        <div className="mt-4 space-y-4 text-sm">
          {lead.sales_notes ? (
            <div>
              <p className="text-xs text-muted-foreground">Pre-payment sales notes</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2">
                {lead.sales_notes}
              </p>
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <dt className="text-xs text-muted-foreground">Source</dt>
            <dd className="font-mono text-xs">{lead.utm_campaign ?? "—"}</dd>
            <dt className="text-xs text-muted-foreground">Creative</dt>
            <dd className="font-mono text-xs">{lead.utm_content ?? "—"}</dd>
            <dt className="text-xs text-muted-foreground">Landing</dt>
            <dd className="font-mono text-xs">{lead.landing_page ?? "—"}</dd>
            <dt className="text-xs text-muted-foreground">Booked</dt>
            <dd>
              {lead.booked_call_at
                ? new Date(lead.booked_call_at).toLocaleString()
                : "—"}
            </dd>
            <dt className="text-xs text-muted-foreground">Attended</dt>
            <dd>
              {lead.attended_at
                ? new Date(lead.attended_at).toLocaleString()
                : "—"}
            </dd>
            <dt className="text-xs text-muted-foreground">Converted</dt>
            <dd>
              {lead.converted_at
                ? new Date(lead.converted_at).toLocaleString()
                : "—"}
            </dd>
          </dl>

          <Link
            href={`/admin/crm/leads/${leadId}`}
            className="inline-block rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            View full lead profile →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
