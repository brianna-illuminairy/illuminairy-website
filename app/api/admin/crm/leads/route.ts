import { NextResponse } from "next/server";
import { getCrmPipelineStats, listCrmLeads } from "@/lib/admin/crm-queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const [pipeline, leads] = await Promise.all([getCrmPipelineStats(), listCrmLeads()]);

  return NextResponse.json({ ok: true, pipeline, leads });
}
