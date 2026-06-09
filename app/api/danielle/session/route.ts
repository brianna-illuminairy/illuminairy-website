import { NextResponse } from "next/server";
import { getDanielleSessionEmail, isDanielleAuthenticated } from "@/lib/danielle-auth";
import { getDaniellePortalRole } from "@/lib/danielle-portal-roles";

export async function GET() {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({
    email,
    role: getDaniellePortalRole(email)
  });
}
