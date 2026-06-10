import { NextResponse } from "next/server";
import { getEnrollmentEconomicsList } from "@/lib/crm/economics";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const enrollments = await getEnrollmentEconomicsList();
  const totals = enrollments.reduce(
    (acc, row) => ({
      enrollmentId: "totals",
      clientId: "",
      parentEmail: "",
      studentName: "",
      revenueCents: acc.revenueCents + row.revenueCents,
      costCents: acc.costCents + row.costCents,
      marginCents: acc.marginCents + row.marginCents,
      loggedMinutes: acc.loggedMinutes + row.loggedMinutes
    }),
    {
      enrollmentId: "totals",
      clientId: "",
      parentEmail: "",
      studentName: "",
      revenueCents: 0,
      costCents: 0,
      marginCents: 0,
      loggedMinutes: 0
    }
  );

  return NextResponse.json({ ok: true, enrollments, totals });
}
