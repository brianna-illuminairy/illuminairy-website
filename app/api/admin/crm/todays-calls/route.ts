import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listTodaysCalls } from "@/lib/admin/todays-calls";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const calls = await listTodaysCalls();
  return NextResponse.json({ ok: true, calls });
}
