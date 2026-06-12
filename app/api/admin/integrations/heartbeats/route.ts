import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLatestHeartbeats } from "@/lib/integrations/heartbeat";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const rows = await getLatestHeartbeats();
  const heartbeats = rows.map((r) => ({
    provider: r.provider,
    status:
      r.status === "ok"
        ? ("ok" as const)
        : r.status === "degraded"
          ? ("warn" as const)
          : ("error" as const),
    detail: r.error_message,
    ranAt: r.checked_at
  }));
  return NextResponse.json({ ok: true, heartbeats });
}
