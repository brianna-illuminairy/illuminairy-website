import { NextResponse } from "next/server";
import {
  DANIELLE_VISITOR_COOKIE,
  danielleVisitorCookieOptions,
  getDanielleSessionEmail,
  getDanielleVisitorContext,
  isDanielleAuthenticated,
  isDanielleOwnerQaSecretValid
} from "@/lib/danielle-auth";

export async function POST(request: Request) {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { staffCode?: string };
  try {
    body = (await request.json()) as { staffCode?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isDanielleOwnerQaSecretValid(body.staffCode)) {
    return NextResponse.json({ error: "Invalid staff code." }, { status: 401 });
  }

  const context = await getDanielleVisitorContext(email);
  const response = NextResponse.json({
    ok: true,
    sessionRole: context.sessionRole,
    visitorRole: "owner",
    isOwnerQa: context.sessionRole !== "owner"
  });
  response.cookies.set(DANIELLE_VISITOR_COOKIE, "owner", danielleVisitorCookieOptions());
  return response;
}

export async function DELETE() {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const context = await getDanielleVisitorContext(email);
  const response = NextResponse.json({
    ok: true,
    sessionRole: context.sessionRole,
    visitorRole: context.sessionRole,
    isOwnerQa: false
  });
  response.cookies.set(DANIELLE_VISITOR_COOKIE, "", { ...danielleVisitorCookieOptions(), maxAge: 0 });
  return response;
}
