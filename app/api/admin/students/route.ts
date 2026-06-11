import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listCrmStudents } from "@/lib/admin/students-queries";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const students = await listCrmStudents();
  return NextResponse.json({ ok: true, students });
}
