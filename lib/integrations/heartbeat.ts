/**
 * Integration health probe + recorder. Writes to `integration_heartbeat` so the
 * admin UI can show last-known status per provider.
 *
 * Two surfaces:
 *   1. `recordHeartbeat(...)` — call from anywhere after a successful API call
 *      to log "ok" with latency. Cheap fire-and-forget.
 *   2. `probeAllIntegrations()` — runs from the /api/cron/heartbeat-check
 *      route every 6 hr. Actively pings each integration with a minimal API
 *      call and records status (ok | degraded | down).
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const HEARTBEAT_PROVIDERS = [
  "google_meet",
  "google_calendar",
  "gmail",
  "google_drive",
  "calendly",
  "gemini"
] as const;

export type HeartbeatProvider = (typeof HEARTBEAT_PROVIDERS)[number];
export type HeartbeatStatus = "ok" | "degraded" | "down";

export type HeartbeatRow = {
  id: string;
  provider: HeartbeatProvider;
  status: HeartbeatStatus;
  latency_ms: number | null;
  error_message: string | null;
  checked_at: string;
};

export async function recordHeartbeat(args: {
  provider: HeartbeatProvider;
  status: HeartbeatStatus;
  latencyMs?: number | null;
  errorMessage?: string | null;
}): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase.from("integration_heartbeat").insert({
    provider: args.provider,
    status: args.status,
    latency_ms: args.latencyMs ?? null,
    error_message: args.errorMessage?.slice(0, 1000) ?? null
  });
}

export async function getLatestHeartbeats(): Promise<HeartbeatRow[]> {
  const supabase = requireSupabaseAdmin();
  // distinct on provider, ordered by checked_at desc — Postgres-specific but
  // works on Supabase. Use a CTE-style window if portability becomes a need.
  const { data, error } = await supabase
    .from("integration_heartbeat")
    .select("id, provider, status, latency_ms, error_message, checked_at")
    .order("checked_at", { ascending: false })
    .limit(200);
  if (error) {
    throw new Error(`getLatestHeartbeats failed: ${error.message}`);
  }
  const latestByProvider = new Map<HeartbeatProvider, HeartbeatRow>();
  for (const row of (data ?? []) as HeartbeatRow[]) {
    if (!latestByProvider.has(row.provider)) {
      latestByProvider.set(row.provider, row);
    }
  }
  return HEARTBEAT_PROVIDERS.map((p) => latestByProvider.get(p)).filter(
    (r): r is HeartbeatRow => Boolean(r)
  );
}

export async function timed<T>(
  provider: HeartbeatProvider,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    void recordHeartbeat({
      provider,
      status: "ok",
      latencyMs: Date.now() - start
    });
    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    void recordHeartbeat({
      provider,
      status: "down",
      latencyMs: Date.now() - start,
      errorMessage: message
    });
    throw e;
  }
}
