"use client";

import { useRef, useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";
import { formatFollowup } from "@/lib/admin/format-booking";
import {
  FOLLOWUP_KIND_CONFIG,
  MANUAL_FOLLOWUP_KINDS,
  type FollowupKind,
  defaultFollowupDateTimeLocal,
  followupKindTone,
  isFollowupKind
} from "@/lib/admin/followup-kinds";

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
    next_followup_kind: string | null;
  };

  const [notes, setNotes] = useState(l.sales_notes ?? "");
  const [notesSavedValue, setNotesSavedValue] = useState(l.sales_notes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [followupAt, setFollowupAt] = useState(
    toDatetimeLocal(l.next_followup_at)
  );
  const [followupNote, setFollowupNote] = useState(l.next_followup_note ?? "");
  const [followupKind, setFollowupKind] = useState<FollowupKind | null>(
    isFollowupKind(l.next_followup_kind) ? l.next_followup_kind : null
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notesDirty = notes !== notesSavedValue;

  async function saveNotes() {
    if (!notesDirty || notesSaving) return;
    setNotesSaving(true);
    const value = notes;
    const ok = await onPatch({ sales_notes: value || null });
    if (ok) {
      setNotesSavedValue(value);
      setSavedAt(new Date().toLocaleTimeString());
    }
    setNotesSaving(false);
  }

  function discardNotes() {
    setNotes(notesSavedValue);
  }

  function scheduleSave(body: Record<string, unknown>) {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const ok = await onPatch(body);
      if (ok) setSavedAt(new Date().toLocaleTimeString());
    }, 600);
  }

  async function applyPreset(kind: FollowupKind) {
    const cfg = FOLLOWUP_KIND_CONFIG[kind];
    const datetimeLocal = defaultFollowupDateTimeLocal(cfg.defaultOffsetHours);
    const isoUtc = fromDatetimeLocal(datetimeLocal);
    setFollowupKind(kind);
    setFollowupAt(datetimeLocal);
    setFollowupNote(cfg.defaultNote);
    if (debounce.current) clearTimeout(debounce.current);
    const ok = await onPatch({
      next_followup_at: isoUtc,
      next_followup_note: cfg.defaultNote || null,
      next_followup_kind: kind
    });
    if (ok) setSavedAt(new Date().toLocaleTimeString());
  }

  function clearFollowup() {
    setFollowupAt("");
    setFollowupNote("");
    setFollowupKind(null);
    scheduleSave({
      next_followup_at: null,
      next_followup_note: null,
      next_followup_kind: null
    });
  }

  async function markDone() {
    if (debounce.current) clearTimeout(debounce.current);
    const wasPostCall = followupKind === "post_call";
    setFollowupKind(wasPostCall ? "post_call_check_in" : null);
    if (wasPostCall) {
      const next = defaultFollowupDateTimeLocal(72);
      setFollowupAt(next);
      setFollowupNote("Check in 3 days after the Strategy Call");
    } else {
      setFollowupAt("");
      setFollowupNote("");
    }
    const ok = await onPatch({ complete_followup: true });
    if (ok) setSavedAt(new Date().toLocaleTimeString());
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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sales notes
          </h2>
          <span className="text-[10px] text-muted-foreground">
            {notesDirty
              ? "Unsaved changes"
              : savedAt
                ? `Saved ${savedAt}`
                : null}
          </span>
        </div>
        <textarea
          className="mt-2 h-40 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Quick context, why they reached out, payment plan agreed, parent objections, etc."
          value={notes}
          disabled={saving || notesSaving}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              void saveNotes();
            }
          }}
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => void saveNotes()}
            disabled={!notesDirty || notesSaving || saving}
            className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            title="\u2318\u23CE to save"
          >
            {notesSaving ? "Saving\u2026" : "Save notes"}
          </button>
          {notesDirty ? (
            <button
              type="button"
              onClick={discardNotes}
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
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Next followup
          </h2>
          {followupKind ? (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${followupKindTone(followupKind)}`}
            >
              {FOLLOWUP_KIND_CONFIG[followupKind].label}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Mark for:
          </span>
          {MANUAL_FOLLOWUP_KINDS.map((kind) => {
            const cfg = FOLLOWUP_KIND_CONFIG[kind];
            const active = followupKind === kind;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => applyPreset(kind)}
                disabled={saving}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  active
                    ? `border-transparent ${cfg.tone}`
                    : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
          {followupKind ? (
            <button
              type="button"
              onClick={markDone}
              disabled={saving}
              className="ml-auto rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900 transition hover:bg-emerald-100"
              title={
                followupKind === "post_call"
                  ? "Sent the email \u2014 schedule the 3-day check-in"
                  : "Mark this task done and clear the follow-up"
              }
            >
              {followupKind === "post_call" ? "Email sent \u2192 check-in" : "Mark done"}
            </button>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
          <input
            type="datetime-local"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={followupAt}
            disabled={saving}
            onChange={(e) => {
              setFollowupAt(e.target.value);
              const next: Record<string, unknown> = {
                next_followup_at: fromDatetimeLocal(e.target.value)
              };
              if (e.target.value && !followupKind) {
                setFollowupKind("general");
                next.next_followup_kind = "general";
              }
              scheduleSave(next);
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
            onClick={clearFollowup}
          >
            Clear followup
          </button>
        ) : null}
      </div>
    </section>
  );
}
