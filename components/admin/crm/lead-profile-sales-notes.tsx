"use client";

import { useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";

/**
 * Long-form sales notes for a lead. Lives on its own Notes tab so the
 * Overview can stay focused on actionable info. Explicit Save (no
 * debounce-while-typing) so editing feels stable.
 */
export function LeadProfileSalesNotes({
  detail,
  saving,
  onPatch
}: {
  detail: LeadDetail;
  saving: boolean;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const l = detail.lead as unknown as {
    sales_notes: string | null;
  };

  const initial = l.sales_notes ?? "";
  const [notes, setNotes] = useState(initial);
  const [savedValue, setSavedValue] = useState(initial);
  const [notesSaving, setNotesSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const dirty = notes !== savedValue;

  async function save() {
    if (!dirty || notesSaving) return;
    setNotesSaving(true);
    const value = notes;
    const ok = await onPatch({ sales_notes: value || null });
    if (ok) {
      setSavedValue(value);
      setSavedAt(new Date().toLocaleTimeString());
    }
    setNotesSaving(false);
  }

  function discard() {
    setNotes(savedValue);
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sales notes
        </h2>
        <span className="text-[10px] text-muted-foreground">
          {dirty ? "Unsaved changes" : savedAt ? `Saved ${savedAt}` : null}
        </span>
      </div>
      <textarea
        className="h-64 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
        placeholder="Quick context, why they reached out, payment plan agreed, parent objections, etc."
        value={notes}
        disabled={saving || notesSaving}
        onChange={(e) => setNotes(e.target.value)}
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
          disabled={!dirty || notesSaving || saving}
          className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          title="\u2318\u23CE to save"
        >
          {notesSaving ? "Saving\u2026" : "Save notes"}
        </button>
        {dirty ? (
          <button
            type="button"
            onClick={discard}
            disabled={notesSaving}
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
