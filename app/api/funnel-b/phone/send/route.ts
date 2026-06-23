import { NextResponse } from "next/server";
import {
  funnelBVerifyErrorMessage,
  funnelBVerifyStatus,
  isFunnelBVerifyConfigured,
} from "@/lib/funnel-b-verify";

export async function GET() {
  const status = funnelBVerifyStatus();
  return NextResponse.json({
    ok: status.configured,
    channel: status.channel,
    clientConfigured: status.clientConfigured,
    serverConfigured: status.serverConfigured,
  });
}

export async function POST() {
  if (!isFunnelBVerifyConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "verify_not_configured",
        message: funnelBVerifyErrorMessage("firebase_not_configured"),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    channel: "firebase",
    clientSide: true,
  });
}
