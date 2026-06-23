import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";
import {
  portalProfileContactFromLead,
  validatePortalProfilePatch,
  type PortalProfilePatch,
} from "@/lib/portal/profile-contact";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const session = await getPortalSession();
  if (!session?.leadId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Partial<PortalProfilePatch>;
  try {
    body = (await request.json()) as Partial<PortalProfilePatch>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("student_first, parent_first, parent_last, parent_phone, parent_zip, parent_email")
    .eq("id", session.leadId)
    .maybeSingle();

  if (fetchError || !lead) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const existing = portalProfileContactFromLead(lead);
  const validated = validatePortalProfilePatch(existing, body);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  const { merged } = validated;
  const { error } = await supabase
    .from("leads")
    .update({
      student_first: merged.studentFirst,
      parent_first: merged.parentFirst || null,
      parent_last: merged.parentLast || null,
      parent_phone: merged.parentPhone || null,
      parent_zip: merged.parentZip || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.leadId);

  if (error) {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
