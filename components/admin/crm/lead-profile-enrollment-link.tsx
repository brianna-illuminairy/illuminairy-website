"use client";

import { useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";
import { enrollmentPageSlugFromUrl } from "@/lib/admin/enrollment-page-url";

export function LeadProfileEnrollmentLink({
  detail,
  saving,
  onPatch
}: {
  detail: LeadDetail;
  saving: boolean;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const lead = detail.lead as unknown as {
    enrollment_page_url: string | null;
    stage: string;
    converted_client_id: string | null;
  };

  const url = lead.enrollment_page_url?.trim() || "";
  const slug = enrollmentPageSlugFromUrl(url);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(url);
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isConverted = !!lead.converted_client_id;

  const copyLink = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = async () => {
    setLocalError(null);
    const ok = await onPatch({
      enrollment_page_url: draft.trim() || null
    });
    if (ok) {
      setEditing(false);
    } else {
      setLocalError("Could not save. Use a slug, /enroll/slug, or full illuminairy.com URL.");
    }
  };

  if (url && !editing) {
    return (
      <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
              Enrollment page
            </p>
            <p className="mt-1 text-sm text-violet-950">
              Personalized sales page for this family
              {slug ? (
                <span className="ml-1 font-mono text-xs text-violet-700">({slug})</span>
              ) : null}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block font-mono text-sm font-medium text-violet-900 underline [overflow-wrap:anywhere] hover:text-violet-950"
            >
              {url}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-violet-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-800"
            >
              Open page
            </a>
            <button
              type="button"
              className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-900 hover:bg-violet-100"
              onClick={() => void copyLink()}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            {!isConverted ? (
              <button
                type="button"
                disabled={saving}
                className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm text-violet-800 hover:bg-violet-100 disabled:opacity-50"
                onClick={() => {
                  setDraft(url);
                  setEditing(true);
                }}
              >
                Edit
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
        Enrollment page
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Link to a personalized <span className="font-mono text-xs">/enroll/…</span> page after
        the Strategy Call.
      </p>
      {editing || !url ? (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="min-w-[min(100%,280px)] flex-1 text-xs text-muted-foreground">
            URL or slug
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
              placeholder="sohail-shermeen or https://illuminairy.com/enroll/…"
              value={draft}
              disabled={saving || isConverted}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void save();
                if (e.key === "Escape") {
                  setDraft(url);
                  setEditing(false);
                  setLocalError(null);
                }
              }}
            />
          </label>
          <button
            type="button"
            disabled={saving || isConverted}
            className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
            onClick={() => void save()}
          >
            Save
          </button>
          {editing && url ? (
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                setDraft(url);
                setEditing(false);
                setLocalError(null);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      ) : null}
      {localError ? <p className="mt-2 text-sm text-red-600">{localError}</p> : null}
    </div>
  );
}
