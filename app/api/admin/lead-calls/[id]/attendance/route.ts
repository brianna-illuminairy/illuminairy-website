/**
 * Manual override for a lead_call's attendance decision. Powers the "Mark
 * attended", "Mark no-show", "Cancel pending no-show", "Mark confirmed",
 * and risk-flag buttons in the admin Calls tab.
 *
 * Body: {
 *   decision:
 *     | "attended" | "no_show" | "override" | "confirm"
 *     | "confirm_received" | "flag_risk" | "clear_risk",
 *   notes?: string,
 *   riskReason?: string  // only with flag_risk
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { applyCallAttendance } from "@/lib/crm/lead-call-attendance";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Decision =
  | "attended"
  | "no_show"
  | "override"
  | "confirm"
  | "confirm_received"
  | "flag_risk"
  | "clear_risk";

const ALLOWED_DECISIONS: Decision[] = [
  "attended",
  "no_show",
  "override",
  "confirm",
  "confirm_received",
  "flag_risk",
  "clear_risk"
];

const ALLOWED_RISK_REASONS = [
  "confirmation_email_bounced",
  "email_suppressed",
  "no_reply_24h",
  "manual_owner_flag"
] as const;
type RiskReason = (typeof ALLOWED_RISK_REASONS)[number];

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const params = await ctx.params;
  const callId = params.id;
  if (!callId) {
    return NextResponse.json({ error: "missing_call_id" }, { status: 400 });
  }

  let body: { decision?: string; notes?: string; riskReason?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* allow empty */
  }

  const decision = body.decision as Decision | undefined;
  if (!decision || !ALLOWED_DECISIONS.includes(decision)) {
    return NextResponse.json(
      { error: "bad_decision", allowed: ALLOWED_DECISIONS },
      { status: 400 }
    );
  }

  const riskReason: RiskReason | undefined =
    decision === "flag_risk" && body.riskReason &&
    (ALLOWED_RISK_REASONS as readonly string[]).includes(body.riskReason)
      ? (body.riskReason as RiskReason)
      : decision === "flag_risk"
        ? "manual_owner_flag"
        : undefined;

  try {
    await applyCallAttendance({
      callId,
      decision,
      source: "manual",
      actor: "admin",
      attendanceSource: "manual",
      notes: body.notes ?? null,
      ...(decision === "confirm_received" ? { confirmationSource: "manual" as const } : {}),
      ...(decision === "flag_risk"
        ? { riskReason, riskSource: "manual" as const }
        : {})
    });
  } catch (e) {
    return NextResponse.json(
      { error: "apply_failed", detail: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
