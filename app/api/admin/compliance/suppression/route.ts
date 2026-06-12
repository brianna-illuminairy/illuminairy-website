import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listSuppression } from "@/lib/crm/compliance";
import { suppressIdentifier } from "@/lib/crm/suppression";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, entries: await listSuppression() });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: { channel?: string; identifier?: string; reasonDetail?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.identifier) {
    return NextResponse.json({ error: "missing_identifier" }, { status: 400 });
  }
  const channel = body.channel === "sms" || body.channel === "all" ? body.channel : "email";
  await suppressIdentifier({
    channel,
    identifier: body.identifier,
    reason: "manual",
    reasonDetail: body.reasonDetail,
    addedBy: "admin"
  });
  return NextResponse.json({ ok: true });
}
