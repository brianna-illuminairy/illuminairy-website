import { NextResponse } from "next/server";
import { dispatchDaniellePortalUpdates } from "@/lib/danielle-portal-notify";

function isAuthorized(request: Request) {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) {
    return true;
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { updateIds?: string[]; email?: string } = {};
  try {
    const raw = await request.text();
    if (raw.trim()) {
      body = JSON.parse(raw) as typeof body;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const results = await dispatchDaniellePortalUpdates({
    updateIds: body.updateIds,
    email: body.email
  });

  const sent = results.filter((row) => row.ok && row.skipped !== "already_sent");
  const failed = results.filter((row) => !row.ok && row.skipped !== "already_sent");

  return NextResponse.json({
    ok: true,
    sent: sent.length,
    failed: failed.length,
    results
  });
}
