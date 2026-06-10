import { NextResponse } from "next/server";
import { acknowledgeAlert } from "@/lib/admin/alerts";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await acknowledgeAlert(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
