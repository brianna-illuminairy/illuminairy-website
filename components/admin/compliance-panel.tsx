"use client";

import { useEffect, useState } from "react";

type Quiet = { startHourLocal: number; endHourLocal: number; defaultTimezone: string };
type Ooo = { id: string; startsAt: string; endsAt: string; reason: string | null };
type Suppression = {
  id: string;
  channel: "email" | "sms" | "all";
  identifier: string;
  reason: string;
  reasonDetail: string | null;
  addedAt: string;
  addedBy: string | null;
};

export function CompliancePanel() {
  const [quiet, setQuiet] = useState<Quiet | null>(null);
  const [ooo, setOoo] = useState<Ooo[]>([]);
  const [supp, setSupp] = useState<Suppression[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setError(null);
    const [q, o, s] = await Promise.all([
      fetch("/api/admin/compliance/quiet-hours", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/compliance/ooo", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/compliance/suppression", { cache: "no-store" }).then((r) => r.json())
    ]);
    setQuiet(q.config);
    setOoo(o.periods ?? []);
    setSupp(s.entries ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/compliance/quiet-hours", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/compliance/ooo", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/compliance/suppression", { cache: "no-store" }).then((r) => r.json())
    ])
      .then(([q, o, s]) => {
        if (cancelled) return;
        setQuiet(q.config);
        setOoo(o.periods ?? []);
        setSupp(s.entries ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load compliance settings.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveQuiet(next: Quiet) {
    const res = await fetch("/api/admin/compliance/quiet-hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    if (!res.ok) {
      setError("Could not save quiet hours.");
      return;
    }
    await reload();
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Compliance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quiet hours, out-of-office mode, and global suppression list. The Phase 6 draft creator and any future auto-send paths consult these before sending.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <QuietSection quiet={quiet} onSave={saveQuiet} />
      <OooSection periods={ooo} onChange={reload} />
      <SuppressionSection entries={supp} onChange={reload} />
    </div>
  );
}

function QuietSection({
  quiet,
  onSave
}: {
  quiet: Quiet | null;
  onSave: (q: Quiet) => Promise<void>;
}) {
  const [s, setS] = useState<Quiet | null>(quiet);
  const [seedKey, setSeedKey] = useState<string | null>(null);
  const incomingKey = quiet
    ? `${quiet.startHourLocal}|${quiet.endHourLocal}|${quiet.defaultTimezone}`
    : null;
  if (incomingKey !== seedKey) {
    setSeedKey(incomingKey);
    setS(quiet);
  }

  if (!s) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold">Quiet hours</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Outbound SMS suppressed during this window. Email is not throttled by quiet hours.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted-foreground">
          Start hour (24h, local)
          <input
            type="number"
            min={0}
            max={23}
            value={s.startHourLocal}
            onChange={(e) => setS({ ...s, startHourLocal: Number(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          End hour (24h, local)
          <input
            type="number"
            min={0}
            max={23}
            value={s.endHourLocal}
            onChange={(e) => setS({ ...s, endHourLocal: Number(e.target.value) })}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Timezone
          <input
            type="text"
            value={s.defaultTimezone}
            onChange={(e) => setS({ ...s, defaultTimezone: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => void onSave(s)}
        className="mt-3 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        Save quiet hours
      </button>
    </section>
  );
}

function OooSection({ periods, onChange }: { periods: Ooo[]; onChange: () => Promise<void> }) {
  const [form, setForm] = useState({ startsAt: "", endsAt: "", reason: "" });

  async function create() {
    const res = await fetch("/api/admin/compliance/ooo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
        reason: form.reason || undefined
      })
    });
    if (!res.ok) return;
    setForm({ startsAt: "", endsAt: "", reason: "" });
    await onChange();
  }

  async function remove(id: string) {
    if (!confirm("Delete this OOO window?")) return;
    await fetch(`/api/admin/compliance/ooo/${id}`, { method: "DELETE" });
    await onChange();
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold">Out-of-office</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pauses all automated sends + cron drafts during the window.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          type="datetime-local"
          value={form.startsAt}
          onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="datetime-local"
          value={form.endsAt}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Reason (optional)"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void create()}
          disabled={!form.startsAt || !form.endsAt}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
        >
          Add window
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {periods.length === 0 ? (
          <li className="text-sm text-muted-foreground">No OOO windows scheduled.</li>
        ) : (
          periods.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">
                  {fmt(p.startsAt)} → {fmt(p.endsAt)}
                </p>
                {p.reason && <p className="text-xs text-muted-foreground">{p.reason}</p>}
              </div>
              <button
                type="button"
                onClick={() => void remove(p.id)}
                className="text-xs text-rose-700 underline"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function SuppressionSection({
  entries,
  onChange
}: {
  entries: Suppression[];
  onChange: () => Promise<void>;
}) {
  const [form, setForm] = useState({ identifier: "", channel: "email" as const, reason: "" });

  async function add() {
    if (!form.identifier) return;
    await fetch("/api/admin/compliance/suppression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: form.identifier,
        channel: form.channel,
        reasonDetail: form.reason || undefined
      })
    });
    setForm({ identifier: "", channel: "email", reason: "" });
    await onChange();
  }

  async function remove(id: string) {
    if (!confirm("Remove from suppression list?")) return;
    await fetch(`/api/admin/compliance/suppression/${id}`, { method: "DELETE" });
    await onChange();
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold">Suppression list</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Identifiers here are blocked from automated outbound. Bounces + unsubscribes append automatically via Gmail sync.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_1fr_auto]">
        <input
          type="text"
          placeholder="Email or phone"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={form.channel}
          onChange={(e) =>
            setForm({ ...form, channel: e.target.value as typeof form.channel })
          }
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="all">All</option>
        </select>
        <input
          type="text"
          placeholder="Reason (optional)"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void add()}
          disabled={!form.identifier}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <div className="mt-4 max-h-96 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="py-2 pr-3 font-medium">Identifier</th>
              <th className="py-2 pr-3 font-medium">Channel</th>
              <th className="py-2 pr-3 font-medium">Reason</th>
              <th className="py-2 pr-3 font-medium">Added</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-muted-foreground">
                  No suppressions.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="border-b border-border/60">
                  <td className="py-2 pr-3 font-mono text-xs break-all">{e.identifier}</td>
                  <td className="py-2 pr-3 text-xs">{e.channel}</td>
                  <td className="py-2 pr-3 text-xs">
                    <p>{e.reason}</p>
                    {e.reasonDetail && (
                      <p className="text-[10px] text-muted-foreground">{e.reasonDetail}</p>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">{fmt(e.addedAt)}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void remove(e.id)}
                      className="text-xs text-rose-700 underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
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
