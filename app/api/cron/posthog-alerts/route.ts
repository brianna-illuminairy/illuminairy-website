import { NextResponse } from "next/server";
import { pollPosthogExceptions } from "@/lib/admin/posthog-errors";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await pollPosthogExceptions(4);
  return NextResponse.json(result);
}
