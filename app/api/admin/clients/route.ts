import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listCrmClients } from "@/lib/admin/clients-queries";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const clients = await listCrmClients();
  return NextResponse.json({ ok: true, clients });
}
