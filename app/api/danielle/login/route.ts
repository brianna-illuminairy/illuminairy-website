import { NextResponse } from "next/server";
import {
  DANIELLE_COOKIE,
  getDanielleAllowlist,
  isEmailAllowed,
  normalizeDanielleEmail
} from "@/lib/danielle-auth";
import { getDaniellePortalRole } from "@/lib/danielle-portal-roles";

export async function POST(request: Request) {
  const allowlist = getDanielleAllowlist();
  if (allowlist.length === 0) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !isEmailAllowed(email)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const normalized = normalizeDanielleEmail(email);
  const role = getDaniellePortalRole(normalized);

  const response = NextResponse.json({ ok: true, role });
  response.cookies.set(DANIELLE_COOKIE, normalizeDanielleEmail(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/danielle",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
