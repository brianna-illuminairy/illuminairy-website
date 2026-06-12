/**
 * GET   /api/admin/leads/[id]/script  → fetch the most recent generated script
 * POST  /api/admin/leads/[id]/script  → generate or regenerate via Gemini
 * PATCH /api/admin/leads/[id]/script  → save owner edits
 */

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { personalizeSalesScript } from "@/lib/integrations/gemini/sales-script";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 45;

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("lead_sales_scripts")
    .select("id, generated_at, script_markdown, owner_edits_markdown")
    .eq("lead_id", id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: template } = await supabase
    .from("sales_script_template")
    .select("template_markdown, updated_at")
    .eq("id", 1)
    .maybeSingle();
  return NextResponse.json({
    ok: true,
    script: data ?? null,
    templateAt: template?.updated_at ?? null,
    templateHasContent: Boolean(template?.template_markdown?.trim())
  });
}

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = requireSupabaseAdmin();

  const [{ data: lead }, { data: template }] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "parent_first, student_first, student_grade, target_exam, sat_baseline, main_goal, additional_context"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("sales_script_template")
      .select("template_markdown, updated_at")
      .eq("id", 1)
      .maybeSingle()
  ]);

  if (!lead) {
    return NextResponse.json({ error: "lead_not_found" }, { status: 404 });
  }
  const templateMarkdown = template?.template_markdown?.trim() ?? "";
  if (!templateMarkdown) {
    return NextResponse.json(
      { error: "sales_script_template_empty", message: "Set the SSOT template at /admin/automations first." },
      { status: 400 }
    );
  }

  try {
    const personalized = await personalizeSalesScript({
      parentFirst: lead.parent_first,
      studentFirst: lead.student_first,
      studentGrade: lead.student_grade,
      targetExam: lead.target_exam,
      satBaseline: lead.sat_baseline,
      mainGoal: lead.main_goal,
      additionalContext: lead.additional_context,
      templateMarkdown
    });

    const hash = createHash("sha256")
      .update(`${templateMarkdown}\n${JSON.stringify(lead)}`)
      .digest("hex")
      .slice(0, 32);

    await supabase.from("lead_sales_scripts").insert({
      lead_id: id,
      context_hash: hash,
      template_version_at: template?.updated_at ?? null,
      script_markdown: personalized
    });

    void logAudit({
      entityType: "lead",
      entityId: id,
      action: "sales_script:generated",
      source: "gemini"
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "generation_failed", detail: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  let body: { editsMarkdown?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = requireSupabaseAdmin();
  const { data: latest } = await supabase
    .from("lead_sales_scripts")
    .select("id")
    .eq("lead_id", id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) {
    return NextResponse.json({ error: "no_script_to_edit" }, { status: 404 });
  }
  await supabase
    .from("lead_sales_scripts")
    .update({ owner_edits_markdown: body.editsMarkdown ?? null })
    .eq("id", latest.id);
  return NextResponse.json({ ok: true });
}
