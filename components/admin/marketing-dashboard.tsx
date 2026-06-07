"use client";

import { useEffect, useState } from "react";

type FunnelDropStage = {
  id: string;
  label: string;
  reached: number;
  continued: number;
  dropped: number;
  dropPct: number | null;
  retainFromLpPct: number | null;
};

type MarketingPayload = {
  funnel: {
    lpViews: number;
    ctaClicks: number;
    quizStarts: number;
    leads: number;
    books: number;
  };
  dropoff: {
    periodDays: number;
    stages: FunnelDropStage[];
    landingBouncePct: number | null;
    topDropStage: FunnelDropStage | null;
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
    dropCount: number | null;
    retainFromQuizStartPct: number | null;
    retainFromLpPct: number | null;
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

function pctVal(value: number | null) {
  if (value === null) return "—";
  return `${value}%`;
}

function dropTone(dropPct: number | null): string {
  if (dropPct === null) return "text-muted-foreground";
  if (dropPct >= 50) return "text-red-600 font-medium";
  if (dropPct >= 30) return "text-amber-700 font-medium";
  return "text-muted-foreground";
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
  const dropoff = data.dropoff;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing performance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last {dropoff.periodDays} days from Supabase touch_events. PostHog for experiment
          drill-down.
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
        <h2 className="text-lg font-semibold">Where they drop off</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each row is a funnel stage. <strong className="font-medium text-foreground">Left</strong>{" "}
          = visitors who did not continue to the next stage. Drop % is relative to that stage.
        </p>

        {f.lpViews === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No landing page traffic yet in this window.
          </p>
        ) : (
          <>
            {dropoff.landingBouncePct !== null ? (
              <p className="mt-4 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                <strong className="font-medium">Landing page bounce:</strong>{" "}
                {dropoff.landingBouncePct}% viewed the LP without clicking the CTA (
                {f.lpViews - f.ctaClicks} of {f.lpViews}).
              </p>
            ) : null}
            {dropoff.topDropStage ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Biggest drop so far:{" "}
                <span className="font-medium text-foreground">
                  {dropoff.topDropStage.label}
                </span>{" "}
                ({dropoff.topDropStage.dropPct}% left at this stage).
              </p>
            ) : null}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Stage</th>
                    <th className="py-2 pr-3 font-medium">Reached</th>
                    <th className="py-2 pr-3 font-medium">Continued</th>
                    <th className="py-2 pr-3 font-medium">Left</th>
                    <th className="py-2 pr-3 font-medium">Drop %</th>
                    <th className="py-2 font-medium">% of LP views</th>
                  </tr>
                </thead>
                <tbody>
                  {dropoff.stages.map((row) => (
                    <tr key={row.id} className="border-b border-border/60">
                      <td className="max-w-[220px] py-2.5 pr-3">
                        <span className="block font-medium">{row.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {row.id}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums">{row.reached}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{row.continued}</td>
                      <td className="py-2.5 pr-3 tabular-nums">{row.dropped}</td>
                      <td className={`py-2.5 pr-3 tabular-nums ${dropTone(row.dropPct)}`}>
                        {pctVal(row.dropPct)}
                      </td>
                      <td className="py-2.5 tabular-nums text-muted-foreground">
                        {pctVal(row.retainFromLpPct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Quiz step detail</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Unique visitors per plan-builder step (last {dropoff.periodDays}d). Drop vs prior step
          in the quiz only.
        </p>
        {data.stepDropoffs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No quiz step views yet. Step tracking fires on each screen load.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Step</th>
                  <th className="py-2 pr-3 font-medium">Visitors</th>
                  <th className="py-2 pr-3 font-medium">Left vs prior</th>
                  <th className="py-2 pr-3 font-medium">Drop %</th>
                  <th className="py-2 pr-3 font-medium">% of quiz starts</th>
                  <th className="py-2 font-medium">% of LP views</th>
                </tr>
              </thead>
              <tbody>
                {data.stepDropoffs.map((row) => (
                  <tr key={row.step} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-mono text-xs">{row.step}</td>
                    <td className="py-2 pr-3 tabular-nums">{row.visitors}</td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.dropCount !== null ? row.dropCount : "—"}
                    </td>
                    <td className={`py-2 pr-3 tabular-nums ${dropTone(row.dropPct)}`}>
                      {row.dropPct !== null ? `${row.dropPct}%` : "—"}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {pctVal(row.retainFromQuizStartPct)}
                    </td>
                    <td className="py-2 tabular-nums text-muted-foreground">
                      {pctVal(row.retainFromLpPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Stage conversion summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>LP → CTA: {pct(f.ctaClicks, f.lpViews)}</li>
          <li>CTA → quiz start: {pct(f.quizStarts, f.ctaClicks)}</li>
          <li>Quiz → lead: {pct(f.leads, f.quizStarts)}</li>
          <li>Lead → book: {pct(f.books, f.leads)}</li>
        </ul>
      </section>

      {data.leaks.length > 0 ? (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">Alerts</h2>
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
        </section>
      ) : null}

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
          Supabase.
        </p>
      </section>
    </div>
  );
}
