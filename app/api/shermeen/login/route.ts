import { NextResponse } from "next/server";
import {
  getShermeenAllowlist,
  isEmailAllowed,
  isShermeenOwnerQaSecretValid,
  normalizeShermeenEmail,
  SHERMEEN_COOKIE,
  SHERMEEN_VISITOR_COOKIE,
  shermeenVisitorCookieOptions
} from "@/lib/shermeen-auth";

export async function POST(request: Request) {
  const allowlist = getShermeenAllowlist();
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

  const normalized = normalizeShermeenEmail(email);
  const ownerQa = isShermeenOwnerQaSecretValid(body.staffCode);

  const response = NextResponse.json({
    ok: true,
    isOwnerQa: ownerQa
  });
  response.cookies.set(SHERMEEN_COOKIE, normalized, shermeenVisitorCookieOptions());
  if (ownerQa) {
    response.cookies.set(SHERMEEN_VISITOR_COOKIE, "owner", shermeenVisitorCookieOptions());
  } else {
    response.cookies.set(SHERMEEN_VISITOR_COOKIE, "", { ...shermeenVisitorCookieOptions(), maxAge: 0 });
  }

  return response;
}
