import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createLeadTask, listLeadTasks } from "@/lib/admin/lead-tasks";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  try {
    const tasks = await listLeadTasks(id);
    return NextResponse.json({ ok: true, tasks });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;

  let body: {
    kind?: string;
    title?: string;
    bodyText?: string;
    dueAt?: string;
    highlight?: boolean;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.kind || !body.title) {
    return NextResponse.json({ error: "missing_kind_or_title" }, { status: 400 });
  }

  try {
    const task = await createLeadTask({
      leadId: id,
      kind: body.kind,
      title: body.title,
      body: body.bodyText ?? null,
      dueAt: body.dueAt ?? null,
      source: "manual",
      highlight: body.highlight
    });
    return NextResponse.json({ ok: true, task });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
