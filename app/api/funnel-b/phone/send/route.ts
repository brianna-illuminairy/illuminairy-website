import { NextResponse } from "next/server";
import { isFirebaseClientConfigured } from "@/lib/firebase/public-config";
import { isFirebaseAdminConfigured } from "@/lib/firebase/server-config";

export const dynamic = "force-dynamic";

function phoneVerifyStatus() {
  const clientConfigured = isFirebaseClientConfigured();
  const serverConfigured = isFirebaseAdminConfigured();
  return {
    ok: clientConfigured && serverConfigured,
    channel: "firebase" as const,
    clientConfigured,
    serverConfigured,
  };
}

export async function GET() {
  const status = phoneVerifyStatus();
  return NextResponse.json({
    ok: status.ok,
    channel: status.channel,
    clientConfigured: status.clientConfigured,
    serverConfigured: status.serverConfigured,
  });
}

export async function POST() {
  const status = phoneVerifyStatus();
  if (!status.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "verify_not_configured",
        message: "Verification is temporarily unavailable. Email support@illuminairy.com.",
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
