import { NextResponse } from "next/server";
import { AUTOMATION_CATALOG } from "@/lib/admin/automation-catalog";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, automations: AUTOMATION_CATALOG });
}
