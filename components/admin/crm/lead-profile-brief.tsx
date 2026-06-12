"use client";

import { useEffect, useState } from "react";

type Brief = {
  id: string;
  lead_call_id: string | null;
  generated_at: string;
  brief_markdown: string;
  model: string | null;
};

export function LeadProfileBrief({ leadId }: { leadId: string }) {
  const [briefs, setBriefs] = useState<Brief[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    fetch(`/api/admin/leads/${leadId}/brief`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          setError("Could not load briefs.");
          setBriefs([]);
          return;
        }
        const json = (await res.json()) as { briefs: Brief[] };
        if (!aborted) setBriefs(json.briefs ?? []);
      })
      .catch(() => setError("Could not load briefs."));
    return () => {
      aborted = true;
    };
  }, [leadId]);

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold">Pre-call brief</h2>
        <p className="text-xs text-muted-foreground">
          Auto-generated 5 min before each upcoming Strategy Call. Regenerates when intake, sales
          notes, or recent activity change.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {briefs === null && <p className="text-sm text-muted-foreground">Loading…</p>}

      {briefs && briefs.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
          No briefs yet. One will be generated the next time this lead has a Strategy Call within 3 hours.
        </p>
      )}

      {briefs?.map((b) => (
        <article key={b.id} className="rounded-xl border border-border bg-surface p-4">
          <header className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Generated {fmt(b.generated_at)}</span>
            {b.model && <span className="font-mono">{b.model}</span>}
          </header>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap font-sans">
            {b.brief_markdown}
          </div>
        </article>
      ))}
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
