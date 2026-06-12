import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { setLeadUrgency } from "@/lib/admin/lead-tags";
import { URGENCY_LEVELS, type UrgencyLevel } from "@/lib/admin/lead-tag-suggestions";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;

  let body: { level?: string | null; reason?: string | null } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lvlInput = body.level === "" ? null : (body.level ?? null);
  if (lvlInput !== null && !(URGENCY_LEVELS as readonly string[]).includes(lvlInput)) {
    return NextResponse.json({ error: "bad_level", allowed: URGENCY_LEVELS }, { status: 400 });
  }

  const result = await setLeadUrgency({
    leadId: id,
    level: lvlInput as UrgencyLevel | null,
    reason: body.reason ?? null,
    source: "manual",
    actor: "admin"
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
