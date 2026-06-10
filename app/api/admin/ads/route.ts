import { NextResponse } from "next/server";
import { listAdSpend } from "@/lib/admin/ads-queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rows = await listAdSpend(30);
  return NextResponse.json({ ok: true, rows });
}
