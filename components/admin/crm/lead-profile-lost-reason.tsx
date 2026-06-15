"use client";

import { useState } from "react";
import {
  LOST_REASON_PRESETS,
  lostReasonLabel,
  type LostReasonSlug
} from "@/lib/admin/lead-lost-reasons";

export function LeadProfileLostReason({
  leadId,
  stage,
  lostReason,
  saving,
  isConverted,
  onPatch,
  onAfterAction
}: {
  leadId: string;
  stage: string;
  lostReason: string | null;
  saving: boolean;
  isConverted: boolean;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
  onAfterAction?: () => Promise<void>;
}) {
  const [markingInvalid, setMarkingInvalid] = useState(false);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const isLost = stage === "lost";
  const current = lostReason ?? "";

  async function handleReasonChange(next: string) {
    if (!next) {
      await onPatch({ lost_reason: null });
      return;
    }
    if (!isLost) {
      await onPatch({ stage: "lost", lost_reason: next });
      return;
    }
    await onPatch({ lost_reason: next });
  }

  async function markInvalidContact() {
    setMarkingInvalid(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/mark-invalid-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() || null })
      });
      if (!res.ok) {
        return false;
      }
      setShowNote(false);
      setNote("");
      await onAfterAction?.();
      return true;
    } finally {
      setMarkingInvalid(false);
    }
  }

  if (isConverted) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
      <label className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-foreground">Lost reason</span>
        <select
          className="rounded border border-border bg-background px-2 py-1 text-sm"
          value={current}
          disabled={saving || markingInvalid}
          onChange={(e) => void handleReasonChange(e.target.value)}
        >
          <option value="">{isLost ? "Select reason…" : "— (not lost)"}</option>
          {LOST_REASON_PRESETS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
          {current &&
          !LOST_REASON_PRESETS.some((p) => p.slug === current) ? (
            <option value={current}>{lostReasonLabel(current)}</option>
          ) : null}
        </select>
      </label>

      {current ? (
        <p className="text-xs text-muted-foreground">
          {LOST_REASON_PRESETS.find((p) => p.slug === current)?.description ??
            "Custom or system reason."}
        </p>
      ) : null}

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {!showNote ? (
          <button
            type="button"
            disabled={saving || markingInvalid}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
            onClick={() => setShowNote(true)}
          >
            Mark invalid contact
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              className="min-w-[12rem] rounded border border-border bg-background px-2 py-1 text-sm"
              placeholder="Optional note (bounce, fake email…)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={markingInvalid}
            />
            <button
              type="button"
              disabled={markingInvalid}
              className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              onClick={() => void markInvalidContact()}
            >
              {markingInvalid ? "Saving…" : "Confirm invalid"}
            </button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              disabled={markingInvalid}
              onClick={() => {
                setShowNote(false);
                setNote("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export type { LostReasonSlug };
