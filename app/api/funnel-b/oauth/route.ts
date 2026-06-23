import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { oauthProviderStatus } from "@/lib/oauth-providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase() ?? null;

  return NextResponse.json(
    {
      ok: true,
      providers: oauthProviderStatus(),
      email,
    },
    {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
      },
    }
  );
}
