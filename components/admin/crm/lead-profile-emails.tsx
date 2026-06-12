"use client";

import { useEffect, useState } from "react";
import type { LeadEmailRow } from "@/lib/crm/lead-emails";

type Props = {
  leadId: string;
  awaitingReplySince?: string | null;
};

export function LeadProfileEmails({ leadId, awaitingReplySince }: Props) {
  const [emails, setEmails] = useState<LeadEmailRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/leads/${leadId}/emails`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { emails: LeadEmailRow[] } | null) => {
        if (cancelled) return;
        if (!json) {
          setError("Could not load emails.");
          setEmails([]);
          return;
        }
        setEmails(json.emails ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load emails.");
          setEmails([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Emails</h2>
          <p className="text-xs text-muted-foreground">
            Sent + received via Gmail. Synced every 15 minutes.
          </p>
        </div>
        {awaitingReplySince && <AwaitingReplyBadge since={awaitingReplySince} />}
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {emails === null && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {emails && emails.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
          No synced emails for this lead yet. Once you email them from Gmail,
          they will appear here within 15 minutes.
        </div>
      )}

      <ol className="space-y-2">
        {emails?.map((e) => (
          <li
            key={e.id}
            className={`rounded-xl border p-3 text-sm ${
              e.direction === "outbound"
                ? "border-border bg-background"
                : "border-emerald-200 bg-emerald-50/30"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-start gap-3 text-left"
              onClick={() => setExpanded((cur) => (cur === e.id ? null : e.id))}
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-16 items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                  e.direction === "outbound"
                    ? "bg-violet-100 text-violet-900"
                    : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {e.direction === "outbound" ? "Sent" : "Inbound"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{e.subject || "(no subject)"}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.direction === "outbound"
                    ? `To: ${(e.to_emails ?? []).join(", ")}`
                    : `From: ${e.from_name ? `${e.from_name} <${e.from_email}>` : e.from_email}`}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {e.snippet}
                </p>
              </div>
              <div className="ml-3 flex flex-col items-end gap-1 text-right text-xs text-muted-foreground">
                <span>{fmtDate(e.sent_at)}</span>
                {e.is_bounce && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-900">
                    bounce
                  </span>
                )}
                {e.is_unsubscribe && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">
                    unsub
                  </span>
                )}
                {(e.attachments?.length ?? 0) > 0 && (
                  <span className="text-[10px]">📎 {e.attachments?.length}</span>
                )}
              </div>
            </button>
            {expanded === e.id && (
              <div className="mt-3 border-t border-border pt-3 text-xs">
                {e.body_text && (
                  <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-surface p-3 font-mono text-xs">
                    {e.body_text}
                  </pre>
                )}
                {!e.body_text && e.body_html && (
                  <div
                    className="prose prose-sm max-w-none rounded bg-surface p-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.body_html) }}
                  />
                )}
                {e.attachments && e.attachments.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {e.attachments.map((a, i) => (
                      <li key={i} className="text-muted-foreground">
                        📎 {a.filename} ({a.mimeType}, {Math.round(a.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AwaitingReplyBadge({ since }: { since: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const days = Math.max(0, Math.floor((now - new Date(since).getTime()) / 86_400_000));
  const tone =
    days >= 3 ? "bg-rose-100 text-rose-900" : days >= 1 ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>
      Awaiting reply {days === 0 ? "today" : `${days}d`}
    </span>
  );
}

function fmtDate(iso: string): string {
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

/**
 * Very conservative HTML sanitizer — strips <script>, <iframe>, <style>, and
 * `on*=` event handlers. For richer rendering we'd use DOMPurify, but this
 * panel is owner-only inside /admin so the threat model is XSS via a
 * malicious sender.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|iframe|style|object|embed|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}
