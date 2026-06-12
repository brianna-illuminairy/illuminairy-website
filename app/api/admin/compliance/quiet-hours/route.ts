import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getQuietHours, setQuietHours } from "@/lib/crm/compliance";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, config: await getQuietHours() });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: { startHourLocal?: number; endHourLocal?: number; defaultTimezone?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  await setQuietHours({
    startHourLocal: body.startHourLocal ?? 21,
    endHourLocal: body.endHourLocal ?? 8,
    defaultTimezone: body.defaultTimezone ?? "America/New_York"
  });
  return NextResponse.json({ ok: true });
}
