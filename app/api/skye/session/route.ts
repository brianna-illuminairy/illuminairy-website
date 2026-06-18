import { NextResponse } from "next/server";
import {
  getSkyeSessionEmail,
  getSkyeVisitorContext,
  isSkyeAuthenticated
} from "@/lib/skye-auth";

export async function GET() {
  const authed = await isSkyeAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getSkyeSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const context = await getSkyeVisitorContext(email);

  return NextResponse.json({
    email: context.email,
    isOwnerQa: context.isOwnerQa
  });
}
