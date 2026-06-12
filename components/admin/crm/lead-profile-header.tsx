"use client";

import Link from "next/link";
import { useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";
import { stageBadgeTone, stageLabel } from "./stage-badge";

const STAGE_OPTIONS = [
  "intake_submitted",
  "call_booked",
  "no_show",
  "call_attended",
  "diagnostic_scheduled",
  "won",
  "lost"
];

export function LeadProfileHeader({
  detail,
  saving,
  onPatch,
  leadId
}: {
  detail: LeadDetail;
  saving: boolean;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
  leadId: string;
}) {
  const lead = detail.lead as unknown as {
    parent_first: string | null;
    parent_last: string | null;
    parent_email: string;
    student_first: string | null;
    stage: string;
    converted_client_id: string | null;
    booked_call_at: string | null;
  };
  const isConverted = !!lead.converted_client_id;
  const [copied, setCopied] = useState(false);

  const parentName =
    [lead.parent_first, lead.parent_last].filter(Boolean).join(" ") ||
    lead.parent_email;

  const tone = stageBadgeTone(lead.stage);

  return (
    <header className="space-y-4">
      {isConverted && detail.client ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-900">
            <span className="font-semibold">Converted to client.</span> This parent
            paid and was upgraded — manage their lifecycle on the client profile.
          </p>
          <Link
            href={`/admin/crm/clients/${detail.client.id}`}
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Open client →
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">
            {parentName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Student: {lead.student_first ?? "—"} ·{" "}
            <span className="font-mono text-xs [overflow-wrap:anywhere]">
              {lead.parent_email}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
          >
            {stageLabel(lead.stage)}
          </span>
          {isConverted ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
              Client
            </span>
          ) : null}

          <label className="text-xs text-muted-foreground">
            Stage
            <select
              className="ml-2 rounded border border-border bg-background px-2 py-1 text-sm"
              value={lead.stage}
              disabled={saving || isConverted}
              onChange={(e) => void onPatch({ stage: e.target.value })}
              title={
                isConverted
                  ? "This lead converted — manage status from client profile"
                  : undefined
              }
            >
              {STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {stageLabel(s)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled={saving || isConverted}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            onClick={() => void onPatch({ attended: true })}
          >
            Mark attended
          </button>

          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
            onClick={async () => {
              await navigator.clipboard.writeText(lead.parent_email);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>
      </div>

      <p className="text-[10px] font-mono text-muted-foreground [overflow-wrap:anywhere]">
        lead id: {leadId}
      </p>
    </header>
  );
}
