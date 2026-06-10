import { NextResponse } from "next/server";
import { acknowledgeAlert, countOpenAlerts, listOpenAlerts } from "@/lib/admin/alerts";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("count") === "1") {
    const count = await countOpenAlerts();
    return NextResponse.json({ ok: true, count });
  }

  const alerts = await listOpenAlerts();
  return NextResponse.json({ ok: true, alerts });
}
