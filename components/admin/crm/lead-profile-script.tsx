"use client";

import { useEffect, useState } from "react";

type Script = {
  id: string;
  generated_at: string;
  script_markdown: string;
  owner_edits_markdown: string | null;
};

export function LeadProfileScript({ leadId }: { leadId: string }) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState("");
  const [showEdits, setShowEdits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateHasContent, setTemplateHasContent] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/leads/${leadId}/script`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json: { script: Script | null; templateHasContent: boolean } | null
        ) => {
          if (cancelled) return;
          if (!json) {
            setError("Could not load script.");
            setLoading(false);
            return;
          }
          setScript(json.script);
          setEdits(json.script?.owner_edits_markdown ?? "");
          setTemplateHasContent(json.templateHasContent);
          setLoading(false);
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError("Could not load script.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [leadId, reloadKey]);

  function bumpReload() {
    setReloadKey((k) => k + 1);
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/script`, { method: "POST" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        setError(j.message ?? j.error ?? "Could not generate script.");
        return;
      }
      bumpReload();
    } finally {
      setGenerating(false);
    }
  }

  async function saveEdits() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/script`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editsMarkdown: edits })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Could not save edits.");
        return;
      }
      bumpReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Personalized sales script</h2>
          <p className="text-xs text-muted-foreground">
            Built from the SSOT template plus this lead&apos;s intake. In-app only. Never emailed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={generating || !templateHasContent}
          className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
        >
          {generating ? "Generating…" : script ? "Regenerate" : "Generate"}
        </button>
      </header>

      {!templateHasContent && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          The SSOT sales-script template is empty. Set it at{" "}
          <a href="/admin/automations" className="underline">
            /admin/automations
          </a>{" "}
          before generating per-lead scripts.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !script ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
          No script generated yet for this lead.
        </p>
      ) : (
        <>
          <article className="rounded-xl border border-border bg-surface p-4">
            <header className="mb-3 text-xs text-muted-foreground">
              Generated {fmt(script.generated_at)}
            </header>
            <pre className="prose prose-sm max-w-none whitespace-pre-wrap break-words font-sans text-sm">
              {script.script_markdown}
            </pre>
          </article>

          <div>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => setShowEdits((v) => !v)}
            >
              {showEdits ? "Hide owner edits" : "Add or edit owner edits (override layer)"}
            </button>
            {showEdits && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={edits}
                  onChange={(e) => setEdits(e.target.value)}
                  className="block h-48 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Free-form edits that override the generated script. Saved only. Never sent automatically."
                />
                <button
                  type="button"
                  onClick={() => void saveEdits()}
                  disabled={saving}
                  className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save edits"}
                </button>
                {script.owner_edits_markdown && (
                  <pre className="mt-3 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs whitespace-pre-wrap">
                    {script.owner_edits_markdown}
                  </pre>
                )}
              </div>
            )}
          </div>
        </>
      )}
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
