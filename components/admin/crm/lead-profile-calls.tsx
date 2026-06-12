"use client";

import { useCallback, useEffect, useState } from "react";
import { formatBookingDateTime } from "@/lib/admin/format-booking";

type Call = {
  id: string;
  call_at: string;
  duration_minutes: number | null;
  summary: string | null;
  transcript: string | null;
  recording_url: string | null;
};

function nowDatetimeLocal() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function LeadProfileCalls({
  leadId,
  clientId
}: {
  leadId?: string;
  clientId?: string;
}) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    call_at: nowDatetimeLocal(),
    duration_minutes: "",
    summary: "",
    transcript: "",
    recording_url: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const baseUrl = leadId
    ? `/api/admin/leads/${leadId}/calls`
    : clientId
      ? `/api/admin/clients/${clientId}/calls`
      : null;

  const load = useCallback(async () => {
    if (!baseUrl) return;
    const res = await fetch(baseUrl, { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load calls.");
      return;
    }
    const json = (await res.json()) as { calls: Call[] };
    setCalls(json.calls);
  }, [baseUrl]);

  useEffect(() => {
    if (!baseUrl) return;
    const ctrl = new AbortController();
    fetch(baseUrl, { cache: "no-store", signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) {
          setError("Could not load calls.");
          return;
        }
        const json = (await res.json()) as { calls: Call[] };
        setCalls(json.calls);
      })
      .catch(() => {
        /* aborted or network error */
      });
    return () => ctrl.abort();
  }, [baseUrl]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!baseUrl) return;
    setError(null);
    const body = {
      call_at: form.call_at ? new Date(form.call_at).toISOString() : undefined,
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
      summary: form.summary || null,
      transcript: form.transcript || null,
      recording_url: form.recording_url || null
    };
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? "Could not save call.");
      return;
    }
    setForm({
      call_at: nowDatetimeLocal(),
      duration_minutes: "",
      summary: "",
      transcript: "",
      recording_url: ""
    });
    setAdding(false);
    await load();
  }

  async function remove(id: string) {
    if (!baseUrl) return;
    if (!confirm("Delete this call note?")) return;
    const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete call.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Calls</h2>
        <button
          type="button"
          className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          onClick={() => setAdding((v) => !v)}
        >
          {adding ? "Cancel" : "Add call"}
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {adding ? (
        <form
          onSubmit={submit}
          className="space-y-3 rounded-xl border border-border bg-surface p-4"
        >
          <div className="grid gap-3 sm:grid-cols-[200px_140px_1fr]">
            <label className="text-xs text-muted-foreground">
              When
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={form.call_at}
                onChange={(e) => setForm({ ...form, call_at: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Duration (min)
              <input
                type="number"
                min={0}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Recording URL (optional)
              <input
                type="url"
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="https://fireflies.ai/..."
                value={form.recording_url}
                onChange={(e) =>
                  setForm({ ...form, recording_url: e.target.value })
                }
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Summary
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="One line: what happened, next step"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Transcript (paste from Fireflies / Otter / Fathom)
            <textarea
              className="mt-1 block h-48 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={form.transcript}
              onChange={(e) => setForm({ ...form, transcript: e.target.value })}
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              Save call
            </button>
          </div>
        </form>
      ) : null}

      {calls.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No calls logged yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {calls.map((c) => {
            const when = formatBookingDateTime(c.call_at);
            const isOpen = expanded[c.id];
            return (
              <li
                key={c.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {when?.absolute ?? c.call_at}
                      {c.duration_minutes ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {c.duration_minutes} min
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm break-words [overflow-wrap:anywhere]">
                      {c.summary ?? "—"}
                    </p>
                    {c.recording_url ? (
                      <a
                        href={c.recording_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs font-mono underline"
                      >
                        Recording
                      </a>
                    ) : null}
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1">
                    {c.transcript ? (
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() =>
                          setExpanded({ ...expanded, [c.id]: !isOpen })
                        }
                      >
                        {isOpen ? "Hide transcript" : "Show transcript"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="text-xs text-rose-700 underline"
                      onClick={() => void remove(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {isOpen && c.transcript ? (
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs">
                    {c.transcript}
                  </pre>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
