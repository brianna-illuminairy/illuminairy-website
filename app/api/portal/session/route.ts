import { NextResponse } from "next/server";
import { auth, isNextAuthConfigured } from "@/lib/auth";
import { getPortalSession } from "@/lib/portal-auth";

export async function GET() {
  const portalSession = await getPortalSession();
  if (portalSession) {
    return NextResponse.json({
      ok: true,
      source: "portal_cookie",
      email: portalSession.email,
      leadId: portalSession.leadId,
    });
  }

  if (isNextAuthConfigured()) {
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase();
    if (email) {
      return NextResponse.json({
        ok: true,
        source: "oauth",
        email,
        leadId: null,
      });
    }
  }

  return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}
