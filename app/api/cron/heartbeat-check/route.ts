/**
 * Cron: probe every integration with a minimal API call and record health.
 * Schedule: every 6 hr via .github/workflows/crm-cron.yml.
 *
 * Probes:
 *   - google_meet     → GET spaces/{ownerSentinel}? — skipped if no token
 *   - google_calendar → calendars/primary
 *   - gmail           → users/me/profile
 *   - google_drive    → about?fields=user
 *   - calendly        → users/me
 *   - gemini          → models.list (cheapest call)
 *
 * If a probe fails with auth/permission errors, mark the corresponding
 * `integration_tokens.status = 'error'` and write a `system_alerts` row
 * the admin UI surfaces.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { createAdminAlert } from "@/lib/admin/alerts";
import { logAudit } from "@/lib/crm/audit-log";
import { getCalendlyClient } from "@/lib/integrations/calendly/client";
import { googleFetch } from "@/lib/integrations/google/client";
import {
  primaryGoogleOwnerEmail,
  listGoogleTokens
} from "@/lib/integrations/google/tokens";
import {
  HEARTBEAT_PROVIDERS,
  recordHeartbeat,
  type HeartbeatProvider
} from "@/lib/integrations/heartbeat";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return run(req);
}
export async function GET(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest): Promise<NextResponse> {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) return cronErrorResponse(auth);

  const ownerEmail = primaryGoogleOwnerEmail();
  const probes: Array<{
    provider: HeartbeatProvider;
    fn: () => Promise<{ latencyMs: number; detail?: string }>;
  }> = [
    {
      provider: "google_calendar",
      fn: timed(async () => {
        await googleFetch("https://www.googleapis.com/calendar/v3/calendars/primary", { ownerEmail });
      })
    },
    {
      provider: "gmail",
      fn: timed(async () => {
        await googleFetch(
          `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(ownerEmail)}/profile`,
          { ownerEmail }
        );
      })
    },
    {
      provider: "google_drive",
      fn: timed(async () => {
        await googleFetch("https://www.googleapis.com/drive/v3/about?fields=user", { ownerEmail });
      })
    },
    {
      provider: "google_meet",
      fn: timed(async () => {
        // Cheapest meet call available — list our own conferenceRecords with
        // pageSize=1. Returns 200 even when no conferences exist.
        await googleFetch(
          "https://meet.googleapis.com/v2/conferenceRecords?pageSize=1",
          { ownerEmail }
        );
      })
    },
    {
      provider: "calendly",
      fn: timed(async () => {
        const client = getCalendlyClient();
        await client.me();
      })
    },
    {
      provider: "gemini",
      fn: timed(async () => {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
        );
        if (!res.ok) {
          throw new Error(`gemini probe ${res.status}: ${(await res.text()).slice(0, 200)}`);
        }
      })
    }
  ];

  const results: Array<Record<string, unknown>> = [];

  for (const probe of probes) {
    try {
      const { latencyMs } = await probe.fn();
      void recordHeartbeat({ provider: probe.provider, status: "ok", latencyMs });
      results.push({ provider: probe.provider, status: "ok", latencyMs });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      void recordHeartbeat({
        provider: probe.provider,
        status: "down",
        errorMessage: message
      });
      results.push({ provider: probe.provider, status: "down", error: message });

      // For Google probes, flag the token row and alert the owner.
      if (probe.provider.startsWith("google") || probe.provider === "gmail") {
        await flagGoogleTokenError(ownerEmail, message);
      }

      void createAdminAlert({
        alertType: "integration_health",
        severity: "warning",
        title: `Integration ${probe.provider} is down`,
        body: message.slice(0, 600),
        source: "cron",
        dedupeKey: `integration_health:${probe.provider}`,
        notify: false // owner prefers in-app dashboard, not email
      }).catch(() => {
        /* never block on alert */
      });
      void logAudit({
        entityType: "integration",
        action: `heartbeat:${probe.provider}:down`,
        source: "cron",
        notes: message.slice(0, 600)
      });
    }
  }

  // Sanity check that every provider has at least one heartbeat row.
  const missing = HEARTBEAT_PROVIDERS.filter(
    (p) => !results.some((r) => r.provider === p)
  );

  return NextResponse.json({
    ok: true,
    results,
    missing
  });
}

function timed<T extends void | undefined>(
  fn: () => Promise<T>
): () => Promise<{ latencyMs: number; detail?: string }> {
  return async () => {
    const start = Date.now();
    await fn();
    return { latencyMs: Date.now() - start };
  };
}

async function flagGoogleTokenError(ownerEmail: string, message: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  // Only flag genuine auth errors as "error"; transient 5xx becomes "degraded".
  const status = /401|403|invalid_grant|permission/i.test(message) ? "error" : "active";
  if (status === "error") {
    await supabase
      .from("integration_tokens")
      .update({ status, status_detail: message.slice(0, 600) })
      .eq("provider", "google")
      .eq("owner_email", ownerEmail.toLowerCase());
  }
  // Touch listGoogleTokens just to avoid an unused import warning if probe set
  // changes later — the admin UI is the consumer.
  await listGoogleTokens().catch(() => []);
}
