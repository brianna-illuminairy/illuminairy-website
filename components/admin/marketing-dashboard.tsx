"use client";

import { useEffect, useState } from "react";

type MarketingPayload = {
  funnel: {
    lpViews: number;
    ctaClicks: number;
    quizStarts: number;
    leads: number;
    books: number;
  };
  leaks: Array<{
    id: string;
    label: string;
    severity: string;
    ratePct: number | null;
    detail: string;
  }>;
  stepDropoffs: Array<{
    step: string;
    stepIndex: number;
    visitors: number;
    dropPct: number | null;
  }>;
  campaigns: Array<{
    utmCampaign: string;
    pageViews: number;
    ctaClicks: number;
    leads: number;
    books: number;
    ctaRatePct: number | null;
    leadRatePct: number | null;
  }>;
  creatives: Array<{
    utmContent: string;
    utmCampaign: string;
    pageViews: number;
    ctaClicks: number;
    leads: number;
    books: number;
    ctaRatePct: number | null;
    leadRatePct: number | null;
  }>;
  anonymousAbandon: number;
};

function pct(num: number, den: number) {
  if (den <= 0) return "—";
  return `${Math.round((1000 * num) / den) / 10}%`;
}

export function MarketingDashboard() {
  const [data, setData] = useState<MarketingPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/marketing")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load metrics.");
        return res.json() as Promise<MarketingPayload & { ok?: boolean }>;
      })
      .then((json) => setData(json))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing performance</h1>
        <p className="mt-4 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing performance</h1>
        <p className="mt-4 text-sm text-muted-foreground">Loading funnel metrics…</p>
      </div>
    );
  }

  const f = data.funnel;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing performance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last 7 days from Supabase touch_events + leads. Drill down in PostHog for experiments.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["LP views", f.lpViews],
          ["CTA clicks", f.ctaClicks],
          ["Quiz starts", f.quizStarts],
          ["Leads", f.leads],
          ["Books", f.books]
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
        <h2 className="text-lg font-semibold">Conversion rates</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>LP → CTA: {pct(f.ctaClicks, f.lpViews)}</li>
          <li>CTA → quiz start: {pct(f.quizStarts, f.ctaClicks)}</li>
          <li>Quiz → lead: {pct(f.leads, f.quizStarts)}</li>
          <li>Lead → book: {pct(f.books, f.leads)}</li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Biggest leaks (ranked)</h2>
        {data.leaks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Not enough traffic yet for leak ranking (need more LP views / quiz starts).
          </p>
        ) : (
          <ol className="mt-4 space-y-4">
            {data.leaks.map((leak, i) => (
              <li key={leak.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-medium">
                  {i + 1}. {leak.label}
                  {leak.ratePct !== null ? (
                    <span className="ml-2 text-muted-foreground">({leak.ratePct}%)</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{leak.detail}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Quiz step drop-off</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Step</th>
                <th className="py-2 pr-4 font-medium">Visitors</th>
                <th className="py-2 font-medium">Drop vs prior</th>
              </tr>
            </thead>
            <tbody>
              {data.stepDropoffs.map((row) => (
                <tr key={row.step} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono text-xs">{row.step}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.visitors}</td>
                  <td className="py-2 tabular-nums">
                    {row.dropPct !== null ? `${row.dropPct}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Campaign quality (30d)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Campaign</th>
                <th className="py-2 pr-3 font-medium">Views</th>
                <th className="py-2 pr-3 font-medium">CTA rate</th>
                <th className="py-2 pr-3 font-medium">Leads</th>
                <th className="py-2 font-medium">Lead rate</th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((c) => (
                <tr key={c.utmCampaign} className="border-b border-border/60">
                  <td className="max-w-[180px] truncate py-2 pr-3 font-mono text-xs">
                    {c.utmCampaign}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{c.pageViews}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    {c.ctaRatePct !== null ? `${c.ctaRatePct}%` : "—"}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{c.leads}</td>
                  <td className="py-2 tabular-nums">
                    {c.leadRatePct !== null ? `${c.leadRatePct}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Creative performance (utm_content, 30d)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Content</th>
                <th className="py-2 pr-3 font-medium">Campaign</th>
                <th className="py-2 pr-3 font-medium">Views</th>
                <th className="py-2 pr-3 font-medium">CTA rate</th>
                <th className="py-2 pr-3 font-medium">Leads</th>
                <th className="py-2 font-medium">Lead rate</th>
              </tr>
            </thead>
            <tbody>
              {data.creatives.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-muted-foreground">
                    No utm_content traffic yet.
                  </td>
                </tr>
              ) : (
                data.creatives.map((c) => (
                  <tr
                    key={`${c.utmCampaign}:${c.utmContent}`}
                    className="border-b border-border/60"
                  >
                    <td className="max-w-[160px] truncate py-2 pr-3 font-mono text-xs">
                      {c.utmContent}
                    </td>
                    <td className="max-w-[160px] truncate py-2 pr-3 font-mono text-xs">
                      {c.utmCampaign}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{c.pageViews}</td>
                    <td className="py-2 pr-3 tabular-nums">
                      {c.ctaRatePct !== null ? `${c.ctaRatePct}%` : "—"}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{c.leads}</td>
                    <td className="py-2 tabular-nums">
                      {c.leadRatePct !== null ? `${c.leadRatePct}%` : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        <p>
          Anonymous quiz abandon (step ≥ q3, last 7d, no email):{" "}
          <strong className="text-foreground">{data.anonymousAbandon}</strong> visitors in
          Supabase. Use for Meta retargeting audiences or Flow B2 once email is captured.
        </p>
      </section>
    </div>
  );
}
