"use client";

import { useEffect, useState } from "react";
import type { ScoreHistoryRow } from "@/lib/admin/lead-audit";

type Props = {
  leadId: string;
  currentScore?: number | null;
};

export function LeadProfileScore({ leadId, currentScore }: Props) {
  const [history, setHistory] = useState<ScoreHistoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    fetch(`/api/admin/leads/${leadId}/score-history`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          setError("Could not load score history.");
          setHistory([]);
          return;
        }
        const json = (await res.json()) as { history: ScoreHistoryRow[] };
        if (!aborted) setHistory(json.history);
      })
      .catch(() => setError("Could not load score history."));
    return () => {
      aborted = true;
    };
  }, [leadId]);

  const latest = history?.[0] ?? null;
  const components = latest?.components ?? null;

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold">Lead heat</h2>
          <p className="text-xs text-muted-foreground">
            Composite score combining intake fit, engagement, decay, and call signals. Recomputed by triggers + the daily decay cron.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{currentScore ?? "—"}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">current</p>
        </div>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {components && (
        <div className="grid gap-2 sm:grid-cols-5">
          {(["base", "intake", "engagement", "call", "decay"] as const).map((k) => (
            <div key={k} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</p>
              <p className="text-lg font-semibold">{components[k] ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {history && history.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sparkline (last {history.length})
          </p>
          <Sparkline values={history.map((h) => h.score).reverse()} />
        </div>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold">Recent changes</h3>
        {history === null ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
        ) : history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No score history yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs">
            {history.slice(0, 20).map((h) => (
              <li key={h.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="font-mono">{h.score}</span>
                <span className="flex-1 px-3 text-muted-foreground">{h.reason}</span>
                <span className="text-muted-foreground">{fmt(h.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  const w = 320;
  const h = 60;
  const max = Math.max(100, ...values);
  const min = Math.min(0, ...values);
  const range = Math.max(1, max - min);
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={w} height={h} className="rounded-lg border border-border bg-surface">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={pts.join(" ")}
        className="text-violet-700"
      />
    </svg>
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
