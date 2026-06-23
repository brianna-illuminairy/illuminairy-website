import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Body = {
  devicePreference?: string;
};

export async function POST(request: Request) {
  const session = await getPortalSession();
  if (!session?.leadId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const devicePreference =
    typeof body.devicePreference === "string" ? body.devicePreference.trim() : "";
  if (!devicePreference) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("quiz_answers")
    .eq("id", session.leadId)
    .maybeSingle();

  const existing =
    lead?.quiz_answers && typeof lead.quiz_answers === "object" && !Array.isArray(lead.quiz_answers)
      ? (lead.quiz_answers as Record<string, unknown>)
      : {};

  await supabase
    .from("leads")
    .update({
      quiz_answers: { ...existing, devicePreference },
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.leadId);

  return NextResponse.json({ ok: true });
}
