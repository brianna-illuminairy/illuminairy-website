"use client";

import { useEffect, useState } from "react";

type Touch = {
  id: string;
  event_type: string;
  created_at: string;
  payload: Record<string, unknown>;
  source: string | null;
};

type Call = {
  id: string;
  call_at: string;
  duration_minutes: number | null;
  summary: string | null;
};

type Item = {
  key: string;
  at: string;
  kind: "event" | "call";
  label: string;
  detail?: string;
};

function eventLabel(event: string, payload: Record<string, unknown>): string {
  switch (event) {
    case "page_view":
      return `Viewed ${String(payload.path ?? "page")}`;
    case "funnel_cta_click":
      return "Clicked LP CTA";
    case "quiz_started":
      return "Started quiz";
    case "quiz_step_view":
      return `Quiz step: ${String(payload.step ?? "")}`;
    case "quiz_lead_submitted":
      return "Submitted intake form";
    case "call_booked":
      return "Booked Strategy Call";
    case "lead_updated":
      return "Lead updated";
    case "checkout_completed":
      return "Stripe checkout completed";
    default:
      return event;
  }
}

function eventDetail(payload: Record<string, unknown>): string | undefined {
  const parts: string[] = [];
  if (payload.utm_campaign) parts.push(`utm:${String(payload.utm_campaign)}`);
  if (payload.utm_content) parts.push(`content:${String(payload.utm_content)}`);
  if (payload.value !== undefined) parts.push(`value:${String(payload.value)}`);
  if (payload.stage) parts.push(`stage:${String(payload.stage)}`);
  return parts.length ? parts.join(" · ") : undefined;
}

export function ActivityTimeline({
  leadId,
  clientId,
  touches,
  convertedAt
}: {
  leadId?: string;
  clientId?: string;
  touches?: Touch[];
  convertedAt?: string | null;
}) {
  const [calls, setCalls] = useState<Call[]>([]);
  const allTouches = touches ?? [];

  useEffect(() => {
    const base = leadId
      ? `/api/admin/leads/${leadId}/calls`
      : clientId
        ? `/api/admin/clients/${clientId}/calls`
        : null;
    if (!base) return;
    const ctrl = new AbortController();
    fetch(base, { cache: "no-store", signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : { calls: [] }))
      .then((j: { calls: Call[] }) => setCalls(j.calls ?? []))
      .catch(() => {
        /* component unmounted or fetch failed; no-op */
      });
    return () => ctrl.abort();
  }, [leadId, clientId]);

  const items: Item[] = [
    ...allTouches.map((t) => ({
      key: `t:${t.id}`,
      at: t.created_at,
      kind: "event" as const,
      label: eventLabel(t.event_type, t.payload ?? {}),
      detail: eventDetail(t.payload ?? {})
    })),
    ...calls.map((c) => ({
      key: `c:${c.id}`,
      at: c.call_at,
      kind: "call" as const,
      label: `Call${c.duration_minutes ? ` · ${c.duration_minutes} min` : ""}`,
      detail: c.summary ?? undefined
    })),
    ...(convertedAt
      ? [
          {
            key: `conv:${convertedAt}`,
            at: convertedAt,
            kind: "event" as const,
            label: "Became a client",
            detail: "Stripe checkout completed — lead → client"
          }
        ]
      : [])
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li
          key={item.key}
          className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <span
            className={`mt-1 inline-block h-2 w-2 flex-none rounded-full ${
              item.kind === "call" ? "bg-violet-500" : "bg-sky-500"
            }`}
          />
          <div className="flex-1">
            <p className="font-medium">{item.label}</p>
            {item.detail ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(item.at).toLocaleString()}
          </span>
        </li>
      ))}
    </ol>
  );
}
