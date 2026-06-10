import { createAdminAlert } from "@/lib/admin/alerts";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { satProgram } from "@/lib/site";
import { appendTouchEvent } from "@/lib/crm/touch";
import {
  enrollmentIntakeDetails,
  type TypeformEnrollmentIntake,
} from "@/lib/crm/typeform-enrollment-parse";

export async function recordEnrollmentFromTypeform(intake: TypeformEnrollmentIntake) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, error: "supabase_not_configured" };
  }

  const parentEmail = intake.parentEmail.toLowerCase();
  const details = enrollmentIntakeDetails(intake);
  const enrolledAt = intake.submittedAt
    ? new Date(intake.submittedAt).toISOString()
    : new Date().toISOString();

  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id, client_id, student_id, lead_id")
    .eq("typeform_response_token", intake.typeformToken)
    .maybeSingle();

  let stripeLinkedEnrollment = existingEnrollment;
  if (!stripeLinkedEnrollment && intake.typeformToken.startsWith("stripe_")) {
    const stripeSessionId = intake.typeformToken.slice("stripe_".length);
    const { data: byStripe } = await supabase
      .from("enrollments")
      .select("id, client_id, student_id, lead_id")
      .eq("stripe_checkout_session_id", stripeSessionId)
      .maybeSingle();
    stripeLinkedEnrollment = byStripe ?? null;
  }

  if (stripeLinkedEnrollment && !existingEnrollment) {
    await supabase
      .from("enrollments")
      .update({
        typeform_response_token: intake.typeformToken,
        intake_details: details,
        updated_at: new Date().toISOString()
      })
      .eq("id", stripeLinkedEnrollment.id);

    if (intake.studentFirst) {
      await supabase
        .from("students")
        .update({
          first_name: intake.studentFirst,
          last_name: intake.studentLast || null,
          grade: intake.studentGrade || null,
          school: intake.studentSchool || null,
          student_email: intake.studentEmail || null,
          student_phone: intake.studentPhone || null
        })
        .eq("id", stripeLinkedEnrollment.student_id);
    }

    return {
      ok: true as const,
      duplicate: true as const,
      clientId: stripeLinkedEnrollment.client_id,
      enrollmentId: stripeLinkedEnrollment.id,
      leadId: stripeLinkedEnrollment.lead_id,
      parentEmail
    };
  }

  if (existingEnrollment) {
    await supabase
      .from("enrollments")
      .update({ intake_details: details, updated_at: new Date().toISOString() })
      .eq("id", existingEnrollment.id);

    return {
      ok: true as const,
      duplicate: true as const,
      clientId: existingEnrollment.client_id,
      enrollmentId: existingEnrollment.id,
      leadId: existingEnrollment.lead_id,
      parentEmail,
    };
  }

  const { data: existingLead } = await supabase
    .from("leads")
    .select("id, visitor_id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let leadId = existingLead?.id ?? null;
  const visitorId = existingLead?.visitor_id ?? null;

  const leadPatch = {
    parent_first: intake.parentFirst,
    parent_last: intake.parentLast,
    parent_phone: intake.parentPhone || null,
    student_first: intake.studentFirst,
    student_grade: intake.studentGrade || null,
    student_school: intake.studentSchool || null,
    sat_baseline: intake.satTakenBefore ? "Official SAT or PSAT score on file" : null,
    funnel: "enrollment_typeform",
    stage: "won" as const,
    converted_at: enrolledAt,
    updated_at: new Date().toISOString(),
    additional_context: [
      intake.tutoringWindows.length
        ? `Tutoring windows: ${intake.tutoringWindows.join("; ")}`
        : null,
      intake.diagnosticAssessmentTime
        ? `Diagnostic: ${intake.diagnosticAssessmentTime}`
        : null,
      intake.diagnosticReviewTime
        ? `Diagnostic review: ${intake.diagnosticReviewTime}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  if (leadId) {
    await supabase.from("leads").update(leadPatch).eq("id", leadId);
  } else {
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .insert({
        ...leadPatch,
        parent_email: parentEmail,
        lead_source: "organic",
        first_touch_at: enrolledAt,
      })
      .select("id")
      .single();

    if (leadErr || !lead) {
      console.error("[typeform/enrollment] lead insert:", leadErr);
      return { ok: false as const, error: leadErr?.message ?? "lead_failed" };
    }
    leadId = lead.id;
  }

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let clientId = existingClient?.id;

  if (!clientId) {
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({
        lead_id: leadId,
        parent_email: parentEmail,
        parent_first: intake.parentFirst,
        parent_last: intake.parentLast,
        parent_phone: intake.parentPhone || null,
        status: "active",
      })
      .select("id")
      .single();

    if (clientErr || !client) {
      console.error("[typeform/enrollment] client insert:", clientErr);
      return { ok: false as const, error: clientErr?.message ?? "client_failed" };
    }
    clientId = client.id;
  } else {
    await supabase
      .from("clients")
      .update({
        parent_first: intake.parentFirst,
        parent_last: intake.parentLast,
        parent_phone: intake.parentPhone || null,
        lead_id: leadId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId);
  }

  await supabase
    .from("leads")
    .update({ converted_client_id: clientId })
    .eq("id", leadId);

  let studentId: string | null = null;

  if (intake.studentEmail) {
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("client_id", clientId)
      .eq("student_email", intake.studentEmail)
      .maybeSingle();
    studentId = existingStudent?.id ?? null;
  }

  if (!studentId) {
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .insert({
        client_id: clientId,
        first_name: intake.studentFirst,
        last_name: intake.studentLast || null,
        grade: intake.studentGrade || null,
        school: intake.studentSchool || null,
        student_email: intake.studentEmail || null,
        student_phone: intake.studentPhone || null,
      })
      .select("id")
      .single();

    if (studentErr || !student) {
      console.error("[typeform/enrollment] student insert:", studentErr);
      return { ok: false as const, error: studentErr?.message ?? "student_failed" };
    }
    studentId = student.id;
  } else {
    await supabase
      .from("students")
      .update({
        first_name: intake.studentFirst,
        last_name: intake.studentLast || null,
        grade: intake.studentGrade || null,
        school: intake.studentSchool || null,
        student_phone: intake.studentPhone || null,
      })
      .eq("id", studentId);
  }

  const { data: enrollment, error: enrollErr } = await supabase
    .from("enrollments")
    .insert({
      client_id: clientId,
      student_id: studentId,
      lead_id: leadId,
      program: "sat-accelerator",
      program_label: `SAT Accelerator · ${satProgram.examDayLabel}`,
      status: "active",
      typeform_response_token: intake.typeformToken,
      intake_details: details,
      paid_at: enrolledAt,
    })
    .select("id")
    .single();

  if (enrollErr || !enrollment) {
    console.error("[typeform/enrollment] enrollment insert:", enrollErr);
    return { ok: false as const, error: enrollErr?.message ?? "enrollment_failed" };
  }

  await appendTouchEvent({
    visitor_id: visitorId ?? undefined,
    lead_id: leadId ?? undefined,
    client_id: clientId,
    enrollment_id: enrollment.id,
    event_type: "enrollment_typeform_submitted",
    source: "webhook",
    payload: {
      typeform_token: intake.typeformToken,
      form_id: intake.formId,
      parent_email: parentEmail,
      student_email: intake.studentEmail,
    },
  });

  void createAdminAlert({
    alertType: "new_enrollment",
    severity: "info",
    title: `New enrollment: ${intake.studentFirst}`,
    body: `${parentEmail} submitted enrollment intake.`,
    source: "crm",
    linkUrl: "/admin/crm",
    dedupeKey: `enrollment:${enrollment.id}`
  });

  return {
    ok: true as const,
    duplicate: false as const,
    clientId,
    enrollmentId: enrollment.id,
    leadId,
    parentEmail,
  };
}
