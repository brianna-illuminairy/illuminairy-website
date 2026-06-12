import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createOoo, listOoo } from "@/lib/crm/compliance";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, periods: await listOoo(true) });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: { startsAt?: string; endsAt?: string; reason?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.startsAt || !body.endsAt) {
    return NextResponse.json({ error: "missing_dates" }, { status: 400 });
  }
  const period = await createOoo({
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    reason: body.reason
  });
  return NextResponse.json({ ok: true, period });
}
