import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { MentoMindJobType } from "@/lib/integrations/mentomind/types";

export async function queueIntegrationJob(input: {
  enrollmentId?: string;
  jobType: MentoMindJobType;
  payload?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "supabase_not_configured" };

  const { data, error } = await supabase
    .from("integration_jobs")
    .insert({
      enrollment_id: input.enrollmentId ?? null,
      job_type: input.jobType,
      status: "pending",
      payload: input.payload ?? {}
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false as const, error: error?.message ?? "job_failed" };
  }

  return { ok: true as const, jobId: data.id };
}

export async function listPendingIntegrationJobs(limit = 20) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("integration_jobs")
    .select("id, enrollment_id, job_type, status, last_error, created_at")
    .in("status", ["pending", "failed"])
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
