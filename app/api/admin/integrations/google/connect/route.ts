import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl } from "@/lib/integrations/google/oauth";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATE_COOKIE = "illuminairy_google_oauth_state";

export async function GET() {
  if (!isAdminConfigured()) {
    return new NextResponse("admin_not_configured", { status: 503 });
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(
      new URL("/admin/login?next=/admin/integrations", baseUrl())
    );
  }

  const state = randomBytes(16).toString("hex");
  const jar = await cookies();
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600
  });

  return NextResponse.redirect(buildAuthorizeUrl(state));
}

function baseUrl(): string {
  return process.env.ILLUMINAIRY_BASE_URL ?? "http://localhost:3000";
}
