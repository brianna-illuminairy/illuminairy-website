import { NextResponse } from "next/server";
import {
  DANIELLE_COOKIE,
  DANIELLE_VISITOR_COOKIE,
  danielleVisitorCookieOptions,
  getDanielleAllowlist,
  isDanielleOwnerQaSecretValid,
  isEmailAllowed,
  normalizeDanielleEmail
} from "@/lib/danielle-auth";
import { isDanielleNotifyRegistryEmail } from "@/lib/danielle-notify-registry";
import { dispatchDaniellePortalUpdates } from "@/lib/danielle-portal-notify";
import { syncDanielleNotifyRegistry } from "@/lib/danielle-portal-subscriptions";
import { getDaniellePortalRole } from "@/lib/danielle-portal-roles";

export async function POST(request: Request) {
  const allowlist = getDanielleAllowlist();
  if (allowlist.length === 0) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  let body: { email?: string; staffCode?: string };
  try {
    body = (await request.json()) as { email?: string; staffCode?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !isEmailAllowed(email)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const normalized = normalizeDanielleEmail(email);
  const sessionRole = getDaniellePortalRole(normalized);
  const ownerQa = isDanielleOwnerQaSecretValid(body.staffCode);
  const visitorRole = ownerQa ? "owner" : sessionRole;
  const isOwnerQa = ownerQa && sessionRole !== "owner";

  const response = NextResponse.json({
    ok: true,
    sessionRole,
    visitorRole,
    isOwnerQa,
    role: visitorRole
  });
  response.cookies.set(DANIELLE_COOKIE, normalized, danielleVisitorCookieOptions());
  if (ownerQa) {
    response.cookies.set(DANIELLE_VISITOR_COOKIE, "owner", danielleVisitorCookieOptions());
  } else {
    response.cookies.set(DANIELLE_VISITOR_COOKIE, "", { ...danielleVisitorCookieOptions(), maxAge: 0 });
  }

  if (!ownerQa && isDanielleNotifyRegistryEmail(normalized)) {
    void syncDanielleNotifyRegistry().then(() => dispatchDaniellePortalUpdates({ email: normalized }));
  }

  return response;
}
