"use client";

import { useState } from "react";
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
  const [savedValue, setSavedValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = value !== savedValue;

  async function save() {
    if (!dirty || saving) return;
    setError(null);
    setSaving(true);
    const next = value;
    const res = await fetch(`/api/admin/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ops_notes: next || null })
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? "Could not save ops notes.");
      setSaving(false);
      return;
    }
    setSavedValue(next);
    setSavedAt(new Date().toLocaleTimeString());
    setSaving(false);
    await onSaved();
  }

  function discard() {
    setValue(savedValue);
    setError(null);
  }

  return (
    <section className="max-w-2xl space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ops notes
        </h2>
        <span className="text-[10px] text-muted-foreground">
          {dirty ? "Unsaved changes" : savedAt ? `Saved ${savedAt}` : null}
        </span>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <textarea
        className="h-64 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
        placeholder="Internal operations notes: special accommodations, parent preferences, billing arrangements, escalations\u2026"
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void save();
          }
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || saving}
          className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          title="\u2318\u23CE to save"
        >
          {saving ? "Saving\u2026" : "Save notes"}
        </button>
        {dirty ? (
          <button
            type="button"
            onClick={discard}
            disabled={saving}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            Discard
          </button>
        ) : null}
        <span className="text-[10px] text-muted-foreground">
          {"\u2318\u23CE to save"}
        </span>
      </div>
    </section>
  );
}
