import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addLeadTag, listLeadTags } from "@/lib/admin/lead-tags";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  return NextResponse.json({ ok: true, tags: await listLeadTags(id) });
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
    category?: string;
    tag?: string;
    note?: string | null;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    body.category !== "buying_trigger" &&
    body.category !== "objection" &&
    body.category !== "priority" &&
    body.category !== "data_quality"
  ) {
    return NextResponse.json({ error: "bad_category" }, { status: 400 });
  }
  if (!body.tag || !body.tag.trim()) {
    return NextResponse.json({ error: "missing_tag" }, { status: 400 });
  }

  const result = await addLeadTag({
    leadId: id,
    category: body.category,
    tag: slugify(body.tag),
    note: body.note ?? null,
    source: "manual",
    createdBy: "admin"
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, tag: result.tag, inserted: result.inserted });
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}
