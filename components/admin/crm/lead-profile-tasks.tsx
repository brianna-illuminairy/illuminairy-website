"use client";

import { useEffect, useState } from "react";
import type { LeadTask } from "@/lib/admin/lead-tasks";

const SOURCE_TONE: Record<string, string> = {
  manual: "bg-slate-100 text-slate-700",
  trigger: "bg-sky-100 text-sky-900",
  cron: "bg-violet-100 text-violet-900",
  webhook: "bg-amber-100 text-amber-900",
  gemini: "bg-fuchsia-100 text-fuchsia-900"
};

export function LeadProfileTasks({ leadId }: { leadId: string }) {
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    kind: "general",
    title: "",
    body: "",
    dueAt: "",
    highlight: false
  });

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/leads/${leadId}/tasks`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { tasks: LeadTask[] } | null) => {
        if (cancelled) return;
        if (!json) {
          setError("Could not load tasks.");
          setLoading(false);
          return;
        }
        setTasks(json.tasks ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load tasks.");
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

  async function act(taskId: string, action: string, dueAt?: string) {
    setBusy(taskId);
    try {
      const res = await fetch(`/api/admin/lead-tasks/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, dueAt })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Action failed.");
        return;
      }
      bumpReload();
    } finally {
      setBusy(null);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    setError(null);
    const res = await fetch(`/api/admin/leads/${leadId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: form.kind,
        title: form.title,
        bodyText: form.body || undefined,
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
        highlight: form.highlight
      })
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? "Could not create task.");
      return;
    }
    setForm({ kind: "general", title: "", body: "", dueAt: "", highlight: false });
    setShowCreate(false);
    bumpReload();
  }

  const open = tasks.filter((t) => t.status === "open");
  const closed = tasks.filter((t) => t.status !== "open");

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-xs text-muted-foreground">
            Multi-slot follow-ups. The one with a star is the next follow-up shown on Overview.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? "Cancel" : "Add task"}
        </button>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {showCreate && (
        <form onSubmit={create} className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-[160px_1fr_220px]">
            <label className="text-xs text-muted-foreground">
              Kind
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="general">General follow-up</option>
                <option value="post_call">Send post-call email</option>
                <option value="post_call_check_in">Check-in (3 days post-call)</option>
                <option value="no_show_reschedule">No-show reschedule outreach</option>
                <option value="confirm_attendance">Confirm attendance</option>
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="e.g. Reply to Stripe payment plan question"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Due
              <input
                type="datetime-local"
                value={form.dueAt}
                onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Notes (optional)
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="mt-1 block h-20 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.checked })}
            />
            Mark as the highlighted follow-up (shown on Overview).
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              Add task
            </button>
          </div>
        </form>
      )}

      <section>
        <h3 className="text-sm font-semibold">Open ({open.length})</h3>
        {loading ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
        ) : open.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No open tasks.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {open.map((t) => (
              <TaskCard key={t.id} task={t} busy={busy === t.id} onAct={act} />
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground">Closed ({closed.length})</h3>
          <ul className="mt-2 space-y-2 opacity-70">
            {closed.slice(0, 10).map((t) => (
              <TaskCard key={t.id} task={t} busy={busy === t.id} onAct={act} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TaskCard({
  task,
  busy,
  onAct
}: {
  task: LeadTask;
  busy: boolean;
  onAct: (id: string, action: string, dueAt?: string) => Promise<void>;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  const overdue =
    task.status === "open" &&
    task.due_at &&
    now !== null &&
    new Date(task.due_at).getTime() < now;
  return (
    <li
      className={`rounded-xl border p-3 text-sm ${
        overdue ? "border-rose-200 bg-rose-50/30" : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                SOURCE_TONE[task.source] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {task.source}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{task.kind}</span>
            {task.is_highlighted && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                ★ highlight
              </span>
            )}
            {task.status !== "open" && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                {task.status}
              </span>
            )}
          </div>
          <p className="mt-1 font-medium">{task.title}</p>
          {task.body && (
            <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap break-words">
              {task.body}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Due {task.due_at ? fmtAt(task.due_at) : "—"}
            {overdue && <span className="ml-2 text-rose-700">overdue</span>}
            {task.completed_at && <span className="ml-2">· done {fmtAgo(task.completed_at)}</span>}
          </p>
        </div>
        {task.status === "open" && (
          <div className="flex flex-none flex-col items-end gap-1 text-xs">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onAct(task.id, "complete")}
              className="text-emerald-700 underline disabled:opacity-50"
            >
              Done
            </button>
            {!task.is_highlighted && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onAct(task.id, "highlight")}
                className="text-amber-700 underline disabled:opacity-50"
              >
                Highlight
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => void onAct(task.id, "cancel")}
              className="text-rose-700 underline disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function fmtAt(iso: string): string {
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

function fmtAgo(iso: string): string {
  return fmtAt(iso);
}
