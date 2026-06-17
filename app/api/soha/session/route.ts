import { NextResponse } from "next/server";
import {
  getSohaSessionEmail,
  getSohaVisitorContext,
  isSohaAuthenticated
} from "@/lib/soha-auth";

export async function GET() {
  const authed = await isSohaAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getSohaSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const context = await getSohaVisitorContext(email);

  return NextResponse.json({
    email: context.email,
    isOwnerQa: context.isOwnerQa
  });
}
