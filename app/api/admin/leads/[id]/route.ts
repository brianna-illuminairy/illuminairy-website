import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCrmLeadDetail } from "@/lib/admin/crm-queries";
import { normalizeEnrollmentPageUrl } from "@/lib/admin/enrollment-page-url";
import { isFollowupKind } from "@/lib/admin/followup-kinds";
import { updateLeadPipeline } from "@/lib/crm/admin";
import { applyCallAttendance } from "@/lib/crm/lead-call-attendance";
import { fireLeadMilestone } from "@/lib/crm/ga4-milestones";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const detail = await getCrmLeadDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...detail });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  let body: {
    stage?: string;
    lost_reason?: string | null;
    sales_notes?: string | null;
    next_followup_at?: string | null;
    next_followup_note?: string | null;
    next_followup_kind?: string | null;
    attended?: boolean;
    complete_followup?: boolean;
    parent_first?: string | null;
    parent_last?: string | null;
    parent_email?: string;
    parent_phone?: string | null;
    student_first?: string | null;
    student_grade?: string | null;
    student_school?: string | null;
    target_exam?: string | null;
    sat_baseline?: string | null;
    main_goal?: string | null;
    enrollment_page_url?: string | null;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const patch: Parameters<typeof updateLeadPipeline>[1] = {};
  if (body.stage) {
    patch.stage = body.stage;
  }
  if (body.lost_reason !== undefined) {
    patch.lost_reason = body.lost_reason;
  }
  if (body.sales_notes !== undefined) {
    patch.sales_notes = body.sales_notes;
  }
  if (body.next_followup_at !== undefined) {
    patch.next_followup_at = body.next_followup_at;
  }
  if (body.next_followup_note !== undefined) {
    patch.next_followup_note = body.next_followup_note;
  }
  if (body.next_followup_kind !== undefined) {
    if (body.next_followup_kind !== null && !isFollowupKind(body.next_followup_kind)) {
      return NextResponse.json(
        { error: "Invalid next_followup_kind." },
        { status: 400 }
      );
    }
    patch.next_followup_kind = body.next_followup_kind;
  }
  if (body.attended === true) {
    patch.attended_at = new Date().toISOString();
    if (!body.stage) {
      patch.stage = "call_attended";
    }
  } else if (body.attended === false) {
    patch.attended_at = null;
  }

  // Editable parent + student profile fields. These are validated lightly:
  // empty strings are coerced to null so blanking a field actually clears it,
  // and parent_email must look like an email (we keep CRM-search consistent).
  const STRING_FIELDS = [
    "parent_first",
    "parent_last",
    "parent_phone",
    "student_first",
    "student_grade",
    "student_school",
    "target_exam",
    "sat_baseline",
    "main_goal"
  ] as const;
  for (const f of STRING_FIELDS) {
    if (body[f] !== undefined) {
      const v = typeof body[f] === "string" ? body[f]!.trim() : body[f];
      (patch as Record<string, unknown>)[f] = v === "" ? null : v;
    }
  }
  if (body.parent_email !== undefined) {
    const v = body.parent_email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return NextResponse.json({ error: "Invalid parent_email." }, { status: 400 });
    }
    patch.parent_email = v;
  }
  if (body.enrollment_page_url !== undefined) {
    if (body.enrollment_page_url === null || body.enrollment_page_url.trim() === "") {
      patch.enrollment_page_url = null;
    } else {
      const normalized = normalizeEnrollmentPageUrl(body.enrollment_page_url);
      if (!normalized) {
        return NextResponse.json(
          {
            error:
              "Invalid enrollment_page_url. Use a slug, /enroll/slug, or https://illuminairy.com/enroll/…"
          },
          { status: 400 }
        );
      }
      patch.enrollment_page_url = normalized;
    }
  }

  // `complete_followup: true` advances the serial follow-up state machine.
  // post_call (send email) -> post_call_check_in (+3 days). Anything else
  // clears the slot since there's no defined next step.
  if (body.complete_followup === true) {
    const detail = await getCrmLeadDetail(id);
    const currentKind =
      (detail?.lead as { next_followup_kind?: string | null } | undefined)
        ?.next_followup_kind ?? null;

    if (currentKind === "post_call") {
      const threeDaysOut = new Date(Date.now() + 72 * 60 * 60 * 1000);
      threeDaysOut.setHours(9, 0, 0, 0);
      patch.next_followup_at = threeDaysOut.toISOString();
      patch.next_followup_note = "Check in 3 days after the Strategy Call";
      patch.next_followup_kind = "post_call_check_in";
    } else {
      patch.next_followup_at = null;
      patch.next_followup_note = null;
      patch.next_followup_kind = null;
    }
  }

  const result = await updateLeadPipeline(id, patch);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  // Header "Mark attended" only touched leads.* — sync lead_calls so Gemini
  // extract + heat score (call_score) can run on the booking row.
  if (body.attended === true) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: callRow } = await supabase
        .from("lead_calls")
        .select("id, call_status")
        .eq("lead_id", id)
        .in("call_status", ["booked", "confirmed"])
        .order("scheduled_start", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (callRow?.id) {
        try {
          await applyCallAttendance({
            callId: callRow.id,
            decision: "attended",
            source: "manual",
            actor: "admin",
            attendanceSource: "manual",
            notes: "Synced from lead profile Mark attended"
          });
        } catch (e) {
          console.warn("applyCallAttendance after mark attended failed", e);
        }
      }
    }
  }

  if (body.stage === "qualified") {
    void fireLeadMilestone({ leadId: id, milestone: "lead_qualified" });
  } else if (body.stage === "lost") {
    void fireLeadMilestone({
      leadId: id,
      milestone: "lead_lost",
      extra: { lost_reason: body.lost_reason ?? "" }
    });
  } else if (body.stage === "client") {
    void fireLeadMilestone({ leadId: id, milestone: "lead_won", value: 7000 });
  }

  return NextResponse.json({ ok: true });
}
