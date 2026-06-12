"use client";

import { useEffect, useState } from "react";

type Heartbeat = {
  provider: string;
  status: "ok" | "warn" | "error";
  detail?: string | null;
  ranAt: string;
};

const TONE: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-900 border-emerald-200",
  warn: "bg-amber-100 text-amber-900 border-amber-200",
  error: "bg-rose-100 text-rose-900 border-rose-200"
};

export function IntegrationsPill() {
  const [hbs, setHbs] = useState<Heartbeat[] | null>(null);

  useEffect(() => {
    let aborted = false;
    fetch("/api/admin/integrations/heartbeats", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { heartbeats: Heartbeat[] };
        if (!aborted) setHbs(json.heartbeats);
      })
      .catch(() => {
        /* silent */
      });
    return () => {
      aborted = true;
    };
  }, []);

  if (!hbs || hbs.length === 0) return null;

  const worst: "ok" | "warn" | "error" = hbs.some((h) => h.status === "error")
    ? "error"
    : hbs.some((h) => h.status === "warn")
      ? "warn"
      : "ok";

  return (
    <div className={`rounded-lg border px-3 py-2 text-xs ${TONE[worst]}`}>
      <p className="font-medium">Integration heartbeats</p>
      <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
        {hbs.map((h) => (
          <li key={h.provider} className="flex items-center justify-between gap-2">
            <span>{h.provider}</span>
            <span className="font-mono text-[10px] opacity-80">
              {h.status === "ok" ? "ok" : h.status === "warn" ? "warn" : "err"} · {fmtAgo(h.ranAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function fmtAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const m = Math.round((Date.now() - t) / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}
