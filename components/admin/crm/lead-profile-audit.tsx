"use client";

import { useEffect, useState } from "react";
import type { AuditRow } from "@/lib/admin/lead-audit";

const SOURCE_TONE: Record<string, string> = {
  manual: "bg-slate-100 text-slate-700",
  cron: "bg-violet-100 text-violet-900",
  webhook: "bg-amber-100 text-amber-900",
  gemini: "bg-fuchsia-100 text-fuchsia-900",
  trigger: "bg-sky-100 text-sky-900"
};

export function LeadProfileAudit({ leadId }: { leadId: string }) {
  const [entries, setEntries] = useState<AuditRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    fetch(`/api/admin/leads/${leadId}/audit`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          setError("Could not load audit.");
          setEntries([]);
          return;
        }
        const json = (await res.json()) as { entries: AuditRow[] };
        if (!aborted) setEntries(json.entries);
      })
      .catch(() => setError("Could not load audit."));
    return () => {
      aborted = true;
    };
  }, [leadId]);

  return (
    <div className="space-y-3">
      <header>
        <h2 className="text-lg font-semibold">Audit</h2>
        <p className="text-xs text-muted-foreground">
          Every state change on this lead, its calls, and its tasks. Newest first.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {entries === null && <p className="text-sm text-muted-foreground">Loading…</p>}

      {entries && entries.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No audit entries yet.
        </p>
      )}

      <ol className="space-y-2">
        {entries?.map((e) => (
          <li key={e.id} className="rounded-xl border border-border bg-surface p-3 text-xs">
            <button
              type="button"
              className="flex w-full items-start gap-3 text-left"
              onClick={() => setExpanded((cur) => (cur === e.id ? null : e.id))}
            >
              <span
                className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase ${
                  SOURCE_TONE[e.source] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {e.source}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono font-medium break-words">{e.action}</p>
                <p className="text-muted-foreground">
                  {e.entity_type} {e.entity_id ? `(${e.entity_id.slice(0, 8)})` : ""}
                  {e.actor ? ` · ${e.actor}` : ""}
                </p>
                {e.notes && <p className="mt-1 text-muted-foreground break-words">{e.notes}</p>}
              </div>
              <span className="ml-2 text-right text-muted-foreground">{fmt(e.created_at)}</span>
            </button>
            {expanded === e.id && (e.before_value || e.after_value) ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 border-t border-border pt-3">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    Before
                  </p>
                  <pre className="overflow-auto rounded bg-muted/50 p-2 text-[10px]">
                    {JSON.stringify(e.before_value, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    After
                  </p>
                  <pre className="overflow-auto rounded bg-muted/50 p-2 text-[10px]">
                    {JSON.stringify(e.after_value, null, 2)}
                  </pre>
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York"
    });
  } catch {
    return iso;
  }
}
