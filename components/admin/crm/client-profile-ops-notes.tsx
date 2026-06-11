"use client";

import { useRef, useState } from "react";
import type { ClientDetail } from "@/lib/admin/clients-queries";

export function ClientProfileOpsNotes({
  detail,
  clientId,
  onSaved
}: {
  detail: ClientDetail;
  clientId: string;
  onSaved: () => Promise<void> | void;
}) {
  const initial = (detail.client as { ops_notes?: string | null }).ops_notes ?? "";
  const [value, setValue] = useState(initial);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function schedule(next: string) {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setError(null);
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ops_notes: next || null })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Could not save ops notes.");
        return;
      }
      setSavedAt(new Date().toLocaleTimeString());
      await onSaved();
    }, 600);
  }

  return (
    <section className="max-w-2xl space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ops notes
        </h2>
        {savedAt ? (
          <span className="text-[10px] text-muted-foreground">
            Saved {savedAt}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : null}
      <textarea
        className="h-64 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
        placeholder="Internal operations notes: special accommodations, parent preferences, billing arrangements, escalations…"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          schedule(e.target.value);
        }}
      />
    </section>
  );
}
