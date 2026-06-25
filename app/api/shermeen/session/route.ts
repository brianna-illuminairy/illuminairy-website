import { NextResponse } from "next/server";
import {
  getShermeenSessionEmail,
  getShermeenVisitorContext,
  isShermeenAuthenticated
} from "@/lib/shermeen-auth";

export async function GET() {
  const authed = await isShermeenAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getShermeenSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const context = await getShermeenVisitorContext(email);

  return NextResponse.json({
    email: context.email,
    isOwnerQa: context.isOwnerQa
  });
}
