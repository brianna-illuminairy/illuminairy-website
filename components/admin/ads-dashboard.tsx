"use client";

import { useEffect, useState } from "react";

type SpendRow = {
  spendDate: string;
  utmCampaign: string;
  utmContent: string;
  spendCents: number;
  impressions: number | null;
  clicks: number | null;
};

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function AdsDashboard() {
  const [rows, setRows] = useState<SpendRow[]>([]);
  const [csv, setCsv] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/ads")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load ad spend.");
        return res.json() as Promise<{ rows?: SpendRow[] }>;
      })
      .then((json) => setRows(json.rows ?? []))
      .catch(() => setError("Could not load ad spend."));
  }, []);

  async function reloadAds() {
    const res = await fetch("/api/admin/ads");
    if (!res.ok) return;
    const json = (await res.json()) as { rows?: SpendRow[] };
    setRows(json.rows ?? []);
  }

  async function importCsv(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/ads/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv })
    });
    if (!res.ok) {
      setError("Import failed.");
      return;
    }
    const json = (await res.json()) as { count?: number };
    setMessage(`Imported ${json.count ?? 0} rows.`);
    setCsv("");
    void reloadAds();
  }

  const totalSpend = rows.reduce((s, r) => s + r.spendCents, 0);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Ads</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Meta spend by campaign and creative (30d). Import CSV from Ads Manager until the
          Marketing API cron is live.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Total spend (30d)
        </p>
        <p className="mt-2 text-2xl font-semibold tabular-nums">{dollars(totalSpend)}</p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Import CSV</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Columns: date, utm_campaign, utm_content, spend_dollars, impressions, clicks
        </p>
        <form onSubmit={importCsv} className="mt-4 space-y-3">
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-border bg-background p-3 font-mono text-xs"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="2026-06-01,meta-sat-june,script_5,42.50,1200,34"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Import
          </button>
        </form>
        {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Spend by row</h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No spend data yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Campaign</th>
                  <th className="py-2 pr-3 font-medium">Content</th>
                  <th className="py-2 pr-3 font-medium">Spend</th>
                  <th className="py-2 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.spendDate}:${row.utmCampaign}:${row.utmContent}`}
                    className="border-b border-border/60"
                  >
                    <td className="py-2.5 pr-3">{row.spendDate}</td>
                    <td className="max-w-[140px] truncate py-2.5 pr-3 font-mono text-xs">
                      {row.utmCampaign || "—"}
                    </td>
                    <td className="max-w-[120px] truncate py-2.5 pr-3 font-mono text-xs">
                      {row.utmContent || "—"}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums">{dollars(row.spendCents)}</td>
                    <td className="py-2.5 tabular-nums">{row.clicks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
