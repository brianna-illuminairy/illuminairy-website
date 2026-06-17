"use client";

import { useEffect, useState } from "react";
import { formatBookingDateTime } from "@/lib/admin/format-booking";
import type { LeadCall } from "@/lib/admin/lead-calls";

const CALL_STATUS_TONE: Record<string, string> = {
  booked: "bg-sky-100 text-sky-900",
  confirmed: "bg-sky-100 text-sky-900",
  attended: "bg-emerald-100 text-emerald-900",
  no_show: "bg-rose-100 text-rose-900",
  rescheduled: "bg-amber-100 text-amber-900",
  canceled: "bg-slate-200 text-slate-700",
  recovered: "bg-violet-100 text-violet-900",
  qualified: "bg-emerald-200 text-emerald-900",
  closed: "bg-slate-300 text-slate-900"
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
  const [calls, setCalls] = useState<LeadCall[]>([]);
  const [adding, setAdding] = useState(false);
  const [busyCall, setBusyCall] = useState<string | null>(null);
  const [form, setForm] = useState({
    call_at: nowDatetimeLocal(),
    duration_minutes: "",
    summary: "",
    transcript: "",
    recording_url: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reloadKey, setReloadKey] = useState(0);
  const [nowTick, setNowTick] = useState<number | null>(null);

  const baseUrl = leadId
    ? `/api/admin/leads/${leadId}/calls`
    : clientId
      ? `/api/admin/clients/${clientId}/calls`
      : null;

  useEffect(() => {
    if (!baseUrl) return;
    let cancelled = false;
    fetch(baseUrl, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { calls: LeadCall[] } | null) => {
        if (cancelled) return;
        if (!json) {
          setError("Could not load calls.");
          return;
        }
        setCalls(json.calls);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load calls.");
      });
    return () => {
      cancelled = true;
    };
  }, [baseUrl, reloadKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowTick(Date.now());
    const t = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  function bumpReload() {
    setReloadKey((k) => k + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!baseUrl) return;
    setError(null);
    const body = {
      call_at: form.call_at ? new Date(form.call_at).toISOString() : undefined,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
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
    bumpReload();
  }

  async function override(
    callId: string,
    decision:
      | "attended"
      | "no_show"
      | "override"
      | "confirm"
      | "confirm_received"
      | "flag_risk"
      | "clear_risk"
  ) {
    setBusyCall(callId);
    try {
      const res = await fetch(`/api/admin/lead-calls/${callId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Could not update call.");
        return;
      }
      bumpReload();
    } finally {
      setBusyCall(null);
    }
  }

  async function remove(id: string) {
    if (!baseUrl) return;
    if (!confirm("Delete this call note?")) return;
    const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete call.");
      return;
    }
    bumpReload();
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
          {adding ? "Cancel" : "Add manual call note"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {adding && (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-surface p-4">
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
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Recording URL (optional)
              <input
                type="url"
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="https://..."
                value={form.recording_url}
                onChange={(e) => setForm({ ...form, recording_url: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Summary
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted-foreground">
            Transcript (optional)
            <textarea
              className="mt-1 block h-32 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
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
      )}

      {calls.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No calls logged yet. Once a Calendly invitee is booked, it will show up here.
        </p>
      ) : (
        <ul className="space-y-3">
          {calls.map((c) => {
            const when = formatBookingDateTime(c.scheduled_start ?? c.call_at);
            const isOpen = expanded[c.id];
            const status = c.call_status ?? "booked";
            const pendingNoShow =
              status === "no_show" && c.calendly_no_show_pending_until
                ? new Date(c.calendly_no_show_pending_until)
                : null;
            const pendingActive =
              pendingNoShow && nowTick !== null && pendingNoShow.getTime() > nowTick;

            return (
              <li key={c.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          CALL_STATUS_TONE[status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>
                      {typeof (c.call_score as { overall?: number } | null)?.overall ===
                        "number" && (
                        <span
                          className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-900"
                          title={
                            (c.call_score as { rationale?: string })?.rationale ??
                            "Gemini call quality score (0–100)"
                          }
                        >
                          Call score {(c.call_score as { overall: number }).overall}
                        </span>
                      )}
                      {c.no_show_risk && (
                        <span
                          title={c.no_show_risk_reason ?? ""}
                          className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-900"
                        >
                          ⚠ no-show risk
                        </span>
                      )}
                      {c.confirmed_at && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-900">
                          ✓ confirmed
                          {c.confirmation_source && (
                            <span className="ml-1 normal-case font-normal">
                              ({c.confirmation_source})
                            </span>
                          )}
                        </span>
                      )}
                      {c.attendance_source && (
                        <span className="text-[10px] text-muted-foreground">
                          via {c.attendance_source}
                          {c.confidence != null && ` · ${Math.round(c.confidence * 100)}%`}
                        </span>
                      )}
                      {c.identity_match && (
                        <span className="text-[10px] text-muted-foreground">
                          match: {c.identity_match}
                        </span>
                      )}
                    </div>
                    {c.no_show_risk && c.no_show_risk_reason && (
                      <p className="text-xs text-amber-900 [overflow-wrap:anywhere]">
                        Risk reason: {riskReasonLabel(c.no_show_risk_reason)}.
                      </p>
                    )}
                    <p className="text-sm font-semibold">
                      {when?.absolute ?? c.call_at}
                      {c.duration_minutes && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {c.duration_minutes} min
                        </span>
                      )}
                    </p>
                    {c.summary && (
                      <p className="text-sm break-words [overflow-wrap:anywhere]">{c.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {c.meet_link && (
                        <a
                          href={c.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Meet link
                        </a>
                      )}
                      {c.recording_url && (
                        <a
                          href={c.recording_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Recording
                        </a>
                      )}
                      {c.transcript_doc_url && (
                        <a
                          href={c.transcript_doc_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Transcript doc
                        </a>
                      )}
                      {c.gmail_draft_id && (
                        <a
                          href={`https://mail.google.com/mail/u/0/#drafts/${c.gmail_draft_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Open Gmail draft
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1">
                    {status === "booked" || status === "confirmed" ? (
                      <>
                        {!c.confirmed_at && (
                          <button
                            type="button"
                            disabled={busyCall === c.id}
                            onClick={() => void override(c.id, "confirm_received")}
                            className="text-xs text-emerald-700 underline disabled:opacity-50"
                          >
                            Mark confirmed
                          </button>
                        )}
                        {!c.no_show_risk ? (
                          <button
                            type="button"
                            disabled={busyCall === c.id}
                            onClick={() => void override(c.id, "flag_risk")}
                            className="text-xs text-amber-700 underline disabled:opacity-50"
                          >
                            Flag no-show risk
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyCall === c.id}
                            onClick={() => void override(c.id, "clear_risk")}
                            className="text-xs text-slate-700 underline disabled:opacity-50"
                          >
                            Clear risk
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyCall === c.id}
                          onClick={() => void override(c.id, "attended")}
                          className="text-xs text-emerald-700 underline disabled:opacity-50"
                        >
                          Mark attended
                        </button>
                        <button
                          type="button"
                          disabled={busyCall === c.id}
                          onClick={() => void override(c.id, "no_show")}
                          className="text-xs text-rose-700 underline disabled:opacity-50"
                        >
                          Mark no-show
                        </button>
                      </>
                    ) : null}
                    {status === "no_show" && pendingActive && (
                      <button
                        type="button"
                        disabled={busyCall === c.id}
                        onClick={() => void override(c.id, "override")}
                        className="text-xs text-amber-700 underline disabled:opacity-50"
                      >
                        Cancel pending no-show
                      </button>
                    )}
                    {(c.transcript || c.summary) && (
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() => setExpanded({ ...expanded, [c.id]: !isOpen })}
                      >
                        {isOpen ? "Hide details" : "Show details"}
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-xs text-rose-700 underline"
                      onClick={() => void remove(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {pendingActive && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    <span>
                      Calendly no-show queued for {fmtAt(pendingNoShow!)}. Cancel within the
                      window to keep the invitee active.
                    </span>
                  </div>
                )}

                {isOpen && c.transcript && (
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs">
                    {c.transcript}
                  </pre>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function fmtAt(d: Date): string {
  try {
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York"
    });
  } catch {
    return d.toISOString();
  }
}

function riskReasonLabel(reason: string): string {
  switch (reason) {
    case "confirmation_email_bounced":
      return "the booking confirmation email bounced";
    case "email_suppressed":
      return "this email is on the suppression list";
    case "no_reply_24h":
      return "no reply in the last 24 hours";
    case "manual_owner_flag":
      return "manually flagged";
    default:
      return reason;
  }
}
