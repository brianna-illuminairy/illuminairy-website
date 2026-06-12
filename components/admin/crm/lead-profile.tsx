"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeadDetail } from "@/lib/admin/crm-queries";
import { LeadProfileHeader } from "./lead-profile-header";
import { LeadProfileOverview } from "./lead-profile-overview";
import { LeadProfileFollowups } from "./lead-profile-followups";
import { LeadProfileSalesNotes } from "./lead-profile-sales-notes";
import { LeadProfileQuizAnswers } from "./lead-profile-quiz-answers";
import { LeadProfileCalls } from "./lead-profile-calls";
import { LeadProfileEmails } from "./lead-profile-emails";
import { LeadProfileTasks } from "./lead-profile-tasks";
import { LeadProfileAudit } from "./lead-profile-audit";
import { LeadProfileScore } from "./lead-profile-score";
import { LeadProfileBrief } from "./lead-profile-brief";
import { LeadProfileScript } from "./lead-profile-script";
import { LeadProfileTags } from "./lead-profile-tags";
import { IntegrationsPill } from "./integrations-pill";
import { ActivityTimeline } from "./activity-timeline";
import type { UrgencyLevel } from "@/lib/admin/lead-tag-suggestions";

type Tab =
  | "overview"
  | "notes"
  | "brief"
  | "script"
  | "calls"
  | "emails"
  | "tasks"
  | "score"
  | "audit"
  | "activity";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "brief", label: "Brief" },
  { id: "script", label: "Script" },
  { id: "notes", label: "Notes" },
  { id: "calls", label: "Calls" },
  { id: "emails", label: "Emails" },
  { id: "tasks", label: "Tasks" },
  { id: "score", label: "Score" },
  { id: "audit", label: "Audit" },
  { id: "activity", label: "Activity" }
];

export function LeadProfile({
  initialDetail,
  leadId
}: {
  initialDetail: LeadDetail;
  leadId: string;
}) {
  const [detail, setDetail] = useState<LeadDetail>(initialDetail);
  const [tab, setTab] = useState<Tab>("overview");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/admin/leads/${leadId}`, { cache: "no-store" });
    if (!res.ok) {
      setError("Could not reload lead.");
      return;
    }
    const json = (await res.json()) as LeadDetail & { ok?: boolean };
    setDetail({
      lead: json.lead,
      touches: json.touches,
      quizAnswers: json.quizAnswers ?? {},
      client: json.client ?? null
    });
  }, [leadId]);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as Tab;
      if (TABS.find((t) => t.id === h)) setTab(h);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const patchLead = useCallback(
    async (body: Record<string, unknown>) => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/leads/${leadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const json = (await res.json().catch(() => ({}))) as { error?: string };
          setError(json.error ?? "Could not update lead.");
          return false;
        }
        await refresh();
        return true;
      } finally {
        setSaving(false);
      }
    },
    [leadId, refresh]
  );

  return (
    <div className="space-y-6">
      <LeadProfileHeader
        detail={detail}
        saving={saving}
        onPatch={patchLead}
        leadId={leadId}
      />

      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setTab(t.id);
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", `#${t.id}`);
              }
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {tab === "overview" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <LeadProfileOverview detail={detail} />
            <LeadProfileTags
              leadId={leadId}
              initialUrgencyLevel={
                (detail.lead as { urgency_level?: UrgencyLevel | null })
                  .urgency_level ?? null
              }
              initialUrgencyReason={
                (detail.lead as { urgency_reason?: string | null })
                  .urgency_reason ?? null
              }
            />
            <LeadProfileQuizAnswers answers={detail.quizAnswers} />
          </div>
          <div className="min-w-0 space-y-6">
            <LeadProfileFollowups
              detail={detail}
              saving={saving}
              onPatch={patchLead}
            />
            <IntegrationsPill />
          </div>
        </div>
      ) : null}

      {tab === "notes" ? (
        <div className="max-w-2xl">
          <LeadProfileSalesNotes
            detail={detail}
            saving={saving}
            onPatch={patchLead}
          />
        </div>
      ) : null}

      {tab === "calls" ? <LeadProfileCalls leadId={leadId} /> : null}

      {tab === "emails" ? (
        <LeadProfileEmails
          leadId={leadId}
          awaitingReplySince={
            (detail.lead as { awaiting_reply_since?: string | null }).awaiting_reply_since ??
            null
          }
        />
      ) : null}

      {tab === "brief" ? <LeadProfileBrief leadId={leadId} /> : null}

      {tab === "script" ? <LeadProfileScript leadId={leadId} /> : null}

      {tab === "tasks" ? <LeadProfileTasks leadId={leadId} /> : null}

      {tab === "score" ? (
        <LeadProfileScore
          leadId={leadId}
          currentScore={
            (detail.lead as { lead_score_current?: number | null }).lead_score_current ?? null
          }
        />
      ) : null}

      {tab === "audit" ? <LeadProfileAudit leadId={leadId} /> : null}

      {tab === "activity" ? (
        <ActivityTimeline
          leadId={leadId}
          touches={detail.touches}
          convertedAt={
            (detail.lead as { converted_at?: string | null }).converted_at ?? null
          }
        />
      ) : null}
    </div>
  );
}
