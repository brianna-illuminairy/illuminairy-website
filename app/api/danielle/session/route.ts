import { NextResponse } from "next/server";
import { getDanielleSessionEmail, getDanielleVisitorContext, isDanielleAuthenticated } from "@/lib/danielle-auth";

export async function GET() {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const context = await getDanielleVisitorContext(email);

  return NextResponse.json({
    email: context.email,
    sessionRole: context.sessionRole,
    visitorRole: context.visitorRole,
    isOwnerQa: context.isOwnerQa,
    role: context.visitorRole
  });
}
