"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { StoredGoogleToken } from "@/lib/integrations/google/tokens";
import type { HeartbeatRow } from "@/lib/integrations/heartbeat";

type Props = {
  googleTokens: StoredGoogleToken[];
  heartbeats: HeartbeatRow[];
  flash: {
    connected?: string;
    error?: string;
    detail?: string;
    missingScopes?: string;
  };
};

const PROVIDER_LABELS: Record<string, string> = {
  google_meet: "Google Meet",
  google_calendar: "Google Calendar",
  gmail: "Gmail",
  google_drive: "Google Drive",
  calendly: "Calendly",
  gemini: "Gemini"
};

const STATUS_TONE: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-900 border-emerald-200",
  degraded: "bg-amber-100 text-amber-900 border-amber-200",
  down: "bg-rose-100 text-rose-900 border-rose-200",
  unknown: "bg-slate-100 text-slate-700 border-slate-200"
};

export function IntegrationsPanel({ googleTokens, heartbeats, flash }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function disconnect(ownerEmail: string) {
    if (!confirm(`Disconnect Google for ${ownerEmail}? Crons will stop until re-connected.`)) {
      return;
    }
    setBusy(ownerEmail);
    try {
      const res = await fetch("/api/admin/integrations/google/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(`Disconnect failed: ${body.error ?? res.status}`);
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-10">
      {(flash.connected || flash.error) && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            flash.error
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          {flash.connected && (
            <p>
              Connected Google as <strong>{flash.connected}</strong>.
              {flash.missingScopes && (
                <span className="block text-xs text-amber-900 mt-1">
                  Missing scopes: {flash.missingScopes}. Re-connect and accept everything.
                </span>
              )}
            </p>
          )}
          {flash.error && (
            <p>
              Google connect failed: <code className="font-mono text-xs">{flash.error}</code>
              {flash.detail && (
                <span className="block text-xs opacity-80 mt-1">{flash.detail}</span>
              )}
            </p>
          )}
        </div>
      )}

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Google Workspace</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Powers Meet attendance detection, Gmail sync, Drive transcript fetch, and Calendar event reads.
            </p>
          </div>
          <a
            href="/api/admin/integrations/google/connect"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            {googleTokens.length > 0 ? "Reconnect Google" : "Connect Google"}
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Owner</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Scopes</th>
                <th className="px-4 py-2 text-left font-medium">Last refresh</th>
                <th className="px-4 py-2 text-left font-medium">Last use</th>
                <th className="px-4 py-2 text-left font-medium">Access expires</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {googleTokens.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                    No Google account connected. Click <strong>Connect Google</strong> above and grant all requested scopes.
                  </td>
                </tr>
              )}
              {googleTokens.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 font-mono text-xs">{t.ownerEmail}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${
                        t.status === "active"
                          ? STATUS_TONE.ok
                          : t.status === "error"
                          ? STATUS_TONE.down
                          : STATUS_TONE.unknown
                      }`}
                    >
                      {t.status}
                    </span>
                    {t.statusDetail && (
                      <span className="block text-xs text-rose-700 mt-1">{t.statusDetail}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {t.scopes.length} granted
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {fmtAgo(t.lastRefreshedAt)}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {fmtAgo(t.lastUsedAt)}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {t.accessTokenExpiresAt ? fmtAt(t.accessTokenExpiresAt) : "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      disabled={busy === t.ownerEmail}
                      onClick={() => disconnect(t.ownerEmail)}
                      className="text-xs text-rose-700 hover:underline disabled:opacity-50"
                    >
                      {busy === t.ownerEmail ? "Disconnecting…" : "Disconnect"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Integration heartbeat</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest health check per provider. Auto-probed every 6 hours by the
          heartbeat cron (
          <code className="font-mono text-xs">/api/cron/heartbeat-check</code>) and after every successful API call from a worker.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(PROVIDER_LABELS).map((provider) => {
            const hb = heartbeats.find((h) => h.provider === provider);
            const tone = hb ? STATUS_TONE[hb.status] ?? STATUS_TONE.unknown : STATUS_TONE.unknown;
            return (
              <div
                key={provider}
                className={`rounded-xl border p-4 text-sm ${tone}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{PROVIDER_LABELS[provider]}</span>
                  <span className="text-xs uppercase tracking-wide">
                    {hb?.status ?? "unknown"}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-80">
                  {hb ? fmtAgo(hb.checked_at) : "no checks yet"}
                  {hb?.latency_ms != null && ` · ${hb.latency_ms}ms`}
                </p>
                {hb?.error_message && (
                  <p className="mt-1 text-xs opacity-80 line-clamp-2">
                    {hb.error_message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
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

function fmtAgo(iso: string | null): string {
  if (!iso) return "never";
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return "—";
  const diffMs = Date.now() - ts;
  const min = Math.round(diffMs / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}
