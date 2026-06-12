import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("pre_call_briefs")
    .select("id, lead_call_id, generated_at, brief_markdown, model")
    .eq("lead_id", id)
    .order("generated_at", { ascending: false })
    .limit(10);
  return NextResponse.json({ ok: true, briefs: data ?? [] });
}
