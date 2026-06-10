"use client";

import { useEffect, useState } from "react";

type AlertRow = {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  body: string | null;
  link_url: string | null;
  source: string;
  created_at: string;
};

function severityClass(severity: string) {
  if (severity === "critical") return "border-red-300 bg-red-50";
  if (severity === "warning") return "border-amber-300 bg-amber-50";
  return "border-border bg-surface";
}

export function AlertsFeed({ compact = false }: { compact?: boolean }) {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/alerts")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load alerts.");
        return res.json() as Promise<{ alerts?: AlertRow[] }>;
      })
      .then((json) => setAlerts(json.alerts ?? []))
      .catch(() => setError("Could not load alerts."));
  }, []);

  async function ack(id: string) {
    await fetch(`/api/admin/alerts/${id}`, { method: "PATCH" });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!alerts.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {compact ? "No open alerts." : "No open alerts. You are caught up."}
      </p>
    );
  }

  return (
    <ul className={compact ? "space-y-2" : "space-y-3"}>
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`rounded-xl border p-4 ${severityClass(alert.severity)}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {alert.source} · {alert.severity}
              </p>
              <p className="mt-1 font-medium">{alert.title}</p>
              {alert.body ? (
                <p className="mt-1 text-sm text-muted-foreground">{alert.body}</p>
              ) : null}
              {alert.link_url ? (
                <a
                  href={alert.link_url}
                  className="mt-2 inline-block text-sm font-medium text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View details
                </a>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => void ack(alert.id)}
              className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-muted"
            >
              Acknowledge
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
