import { randomBytes } from "crypto";
import type { PlanRevealModel } from "@/lib/quiz-funnel/plan-reveal";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type PlanSharePayload = {
  version: 1;
  plan: PlanRevealModel;
  /** First name only when parent opted in */
  studentLabel: string | null;
  sharedAt: string;
};

export function newPlanShareId(): string {
  return randomBytes(9).toString("hex");
}

export async function createPlanShare(input: {
  plan: PlanRevealModel;
  studentLabel?: string | null;
  visitorId?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "supabase_not_configured" };
  }

  const id = newPlanShareId();
  const payload: PlanSharePayload = {
    version: 1,
    plan: input.plan,
    studentLabel: input.studentLabel?.trim() || null,
    sharedAt: new Date().toISOString()
  };

  const { error } = await supabase.from("plan_shares").insert({
    id,
    payload,
    visitor_id: input.visitorId ?? null
  });

  if (error) {
    console.error("[plan_shares] insert", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id };
}

export async function getPlanShare(
  id: string
): Promise<
  | { ok: true; payload: PlanSharePayload; viewCount: number }
  | { ok: false; error: "not_found" | "expired" | "supabase_not_configured" }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "supabase_not_configured" };
  }

  const { data, error } = await supabase
    .from("plan_shares")
    .select("payload, view_count, expires_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "not_found" };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { ok: false, error: "expired" };
  }

  void supabase
    .from("plan_shares")
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq("id", id);

  const payload = data.payload as PlanSharePayload;
  if (!payload?.plan) {
    return { ok: false, error: "not_found" };
  }

  return {
    ok: true,
    payload,
    viewCount: (data.view_count ?? 0) + 1
  };
}
