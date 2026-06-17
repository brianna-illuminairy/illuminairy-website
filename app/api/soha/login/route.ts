import { NextResponse } from "next/server";
import {
  isEmailAllowed,
  isSohaOwnerQaSecretValid,
  normalizeSohaEmail,
  SOHA_COOKIE,
  SOHA_VISITOR_COOKIE,
  getSohaAllowlist,
  sohaVisitorCookieOptions
} from "@/lib/soha-auth";

export async function POST(request: Request) {
  const allowlist = getSohaAllowlist();
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

  const normalized = normalizeSohaEmail(email);
  const ownerQa = isSohaOwnerQaSecretValid(body.staffCode);

  const response = NextResponse.json({
    ok: true,
    isOwnerQa: ownerQa
  });
  response.cookies.set(SOHA_COOKIE, normalized, sohaVisitorCookieOptions());
  if (ownerQa) {
    response.cookies.set(SOHA_VISITOR_COOKIE, "owner", sohaVisitorCookieOptions());
  } else {
    response.cookies.set(SOHA_VISITOR_COOKIE, "", { ...sohaVisitorCookieOptions(), maxAge: 0 });
  }

  return response;
}
