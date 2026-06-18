import { NextResponse } from "next/server";
import {
  isEmailAllowed,
  isSkyeOwnerQaSecretValid,
  normalizeSkyeEmail,
  SKYE_COOKIE,
  SKYE_VISITOR_COOKIE,
  getSkyeAllowlist,
  skyeVisitorCookieOptions
} from "@/lib/skye-auth";

export async function POST(request: Request) {
  const allowlist = getSkyeAllowlist();
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

  const normalized = normalizeSkyeEmail(email);
  const ownerQa = isSkyeOwnerQaSecretValid(body.staffCode);

  const response = NextResponse.json({
    ok: true,
    isOwnerQa: ownerQa
  });
  response.cookies.set(SKYE_COOKIE, normalized, skyeVisitorCookieOptions());
  if (ownerQa) {
    response.cookies.set(SKYE_VISITOR_COOKIE, "owner", skyeVisitorCookieOptions());
  } else {
    response.cookies.set(SKYE_VISITOR_COOKIE, "", { ...skyeVisitorCookieOptions(), maxAge: 0 });
  }

  return response;
}
