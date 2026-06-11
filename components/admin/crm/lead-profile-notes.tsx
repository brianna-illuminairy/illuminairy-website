"use client";

import { useRef, useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";
import { formatFollowup } from "@/lib/admin/format-booking";

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function LeadProfileNotes({
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
    next_followup_at: string | null;
    next_followup_note: string | null;
  };

  const [notes, setNotes] = useState(l.sales_notes ?? "");
  const [followupAt, setFollowupAt] = useState(
    toDatetimeLocal(l.next_followup_at)
  );
  const [followupNote, setFollowupNote] = useState(l.next_followup_note ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleSave(body: Record<string, unknown>) {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const ok = await onPatch(body);
      if (ok) setSavedAt(new Date().toLocaleTimeString());
    }, 600);
  }

  const followupPreview = formatFollowup(l.next_followup_at);

  const followupTone =
    followupPreview?.tone === "overdue"
      ? "text-rose-700"
      : followupPreview?.tone === "today"
        ? "text-amber-700"
        : "text-muted-foreground";

  return (
    <section className="space-y-5 rounded-xl border border-border bg-surface p-4">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sales notes
          </h2>
          {savedAt ? (
            <span className="text-[10px] text-muted-foreground">
              Saved {savedAt}
            </span>
          ) : null}
        </div>
        <textarea
          className="mt-2 h-40 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Quick context, why they reached out, payment plan agreed, parent objections, etc."
          value={notes}
          disabled={saving}
          onChange={(e) => {
            setNotes(e.target.value);
            scheduleSave({ sales_notes: e.target.value });
          }}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Next followup
        </h2>
        <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
          <input
            type="datetime-local"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={followupAt}
            disabled={saving}
            onChange={(e) => {
              setFollowupAt(e.target.value);
              scheduleSave({
                next_followup_at: fromDatetimeLocal(e.target.value)
              });
            }}
          />
          <input
            type="text"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder='e.g. "Check in re: payment plan"'
            value={followupNote}
            disabled={saving}
            onChange={(e) => {
              setFollowupNote(e.target.value);
              scheduleSave({ next_followup_note: e.target.value || null });
            }}
          />
        </div>
        {followupPreview ? (
          <p className={`text-xs ${followupTone}`}>
            Due {followupPreview.relative} · {followupPreview.absolute}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No followup scheduled.</p>
        )}
        {followupAt ? (
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => {
              setFollowupAt("");
              setFollowupNote("");
              scheduleSave({ next_followup_at: null, next_followup_note: null });
            }}
          >
            Clear followup
          </button>
        ) : null}
      </div>
    </section>
  );
}
