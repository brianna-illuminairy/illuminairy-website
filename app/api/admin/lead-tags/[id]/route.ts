import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  removeLeadTag,
  resolveLeadTag,
  unresolveLeadTag
} from "@/lib/admin/lead-tags";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  let body: { action?: string; note?: string | null } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* tolerate empty */
  }

  if (body.action === "resolve") {
    const r = await resolveLeadTag(id, body.note ?? null, "admin");
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  }
  if (body.action === "reopen" || body.action === "unresolve") {
    const r = await unresolveLeadTag(id, "admin");
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad_action" }, { status: 400 });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const r = await removeLeadTag(id, "admin");
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
