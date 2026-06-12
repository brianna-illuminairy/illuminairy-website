import { NextRequest, NextResponse } from "next/server";
import {
  disconnectGoogleToken,
  getGoogleTokenByOwner
} from "@/lib/integrations/google/tokens";
import { decryptToken } from "@/lib/integrations/encrypt";
import { revokeRefreshToken } from "@/lib/integrations/google/oauth";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: { ownerEmail?: string } = {};
  try {
    body = (await req.json()) as { ownerEmail?: string };
  } catch {
    // Allow empty body.
  }
  const ownerEmail = body.ownerEmail;
  if (!ownerEmail) {
    return NextResponse.json({ error: "missing_owner_email" }, { status: 400 });
  }

  const token = await getGoogleTokenByOwner(ownerEmail);
  if (!token) {
    return NextResponse.json({ ok: true, note: "not_connected" });
  }

  const supabase = requireSupabaseAdmin();
  const { data: row } = await supabase
    .from("integration_tokens")
    .select("refresh_token_enc")
    .eq("id", token.id)
    .maybeSingle();

  if (row?.refresh_token_enc) {
    try {
      await revokeRefreshToken(decryptToken(row.refresh_token_enc));
    } catch (e) {
      // Continue with local delete even if Google revoke fails.
      console.warn("google revoke failed", e instanceof Error ? e.message : e);
    }
  }

  await disconnectGoogleToken(ownerEmail);
  return NextResponse.json({ ok: true });
}
