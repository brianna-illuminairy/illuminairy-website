import { NextResponse } from "next/server";
import { Resend } from "resend";
import { upsertLeadFromIntake } from "@/lib/crm/leads";
import type { IntakeWithAttribution } from "@/lib/crm/types";
import { onIntakeSubmitted } from "@/lib/klaviyo-server";
import {
  formatIntakeEmailBody,
  isDisqualifiedProgramInvestment,
  mainGoalOptions,
  needsInvestmentBudgetConfirmation,
  programInvestmentOptions,
  satBaselineOptions,
  scoreRangeOptions,
  targetExamOptions,
  type QualificationIntakePayload
} from "@/lib/sat-qualification";
import { site } from "@/lib/site";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function includesOption<T extends readonly string[]>(
  options: T,
  value: unknown
): value is T[number] {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  let body: IntakeWithAttribution;
  try {
    body = (await request.json()) as IntakeWithAttribution;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const parentEmail = body.parentEmail?.trim() ?? "";
  const parentFirst = body.parentFirst?.trim() ?? "";
  const parentLast = body.parentLast?.trim() ?? "";
  const parentPhone = body.parentPhone?.trim() ?? "";
  const studentFirst = body.studentFirst?.trim() ?? "";
  const studentSchool = body.studentSchool?.trim() ?? "";
  const additionalContext = body.additionalContext?.trim() ?? "";
  const scoreRange = body.scoreRange?.trim() ?? "";

  if (
    !parentEmail ||
    !parentFirst ||
    !parentLast ||
    !parentPhone ||
    !studentFirst ||
    !body.confirmParentOnCall ||
    !body.confirmNoGuarantee
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields and confirmations." },
      { status: 400 }
    );
  }

  if (!isValidEmail(parentEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (
    !includesOption(targetExamOptions, body.targetExam) ||
    !includesOption(satBaselineOptions, body.satBaseline) ||
    !includesOption(mainGoalOptions, body.mainGoal) ||
    !includesOption(programInvestmentOptions, body.programInvestment)
  ) {
    return NextResponse.json(
      { error: "Please choose a valid option for each question." },
      { status: 400 }
    );
  }

  if (
    scoreRange &&
    !includesOption(scoreRangeOptions, scoreRange)
  ) {
    return NextResponse.json(
      { error: "Please choose a valid score range." },
      { status: 400 }
    );
  }

  if (
    needsInvestmentBudgetConfirmation(body.programInvestment) &&
    !body.confirmBudgetGap
  ) {
    return NextResponse.json(
      {
        error:
          "Please confirm you'd still like to apply after reviewing program tuition."
      },
      { status: 400 }
    );
  }

  const payload: QualificationIntakePayload = {
    parentEmail,
    parentFirst,
    parentLast,
    parentPhone,
    studentFirst,
    studentGrade: body.studentGrade,
    studentSchool,
    targetExam: body.targetExam,
    satBaseline: body.satBaseline,
    scoreRange: scoreRange as QualificationIntakePayload["scoreRange"],
    mainGoal: body.mainGoal,
    programInvestment: body.programInvestment,
    confirmBudgetGap: body.confirmBudgetGap === true,
    additionalContext,
    confirmParentOnCall: true,
    confirmNoGuarantee: true
  };

  const disqualified = isDisqualifiedProgramInvestment(payload.programInvestment);

  const crm = await upsertLeadFromIntake(payload, {
    visitorId: body.visitorId,
    attribution: body.attribution,
    stage: disqualified ? "lost" : "intake_submitted",
    lostReason: disqualified ? "budget_not_ready" : undefined
  });

  if (!crm.ok && crm.error !== "supabase_not_configured") {
    console.error("CRM intake error:", crm.error);
    return NextResponse.json(
      {
        error: `We could not save your answers. Email ${site.supportEmail} and we will follow up.`
      },
      { status: 502 }
    );
  }

  void onIntakeSubmitted({
    email: parentEmail,
    firstName: parentFirst,
    lastName: parentLast,
    phone: parentPhone,
    leadSource: crm.ok ? crm.leadSource : "unknown",
    targetExam: payload.targetExam,
    scoreRange: payload.scoreRange || "",
    mainGoal: payload.mainGoal,
    programInvestment: payload.programInvestment,
    studentFirst,
    qualified: !disqualified
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const inbox = process.env.CONTACT_INBOX || site.supportEmail;
    const from =
      process.env.RESEND_FROM_EMAIL || "Illuminairy <onboarding@resend.dev>";
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: inbox,
      replyTo: parentEmail,
      subject: `SAT intake · ${studentFirst}`,
      text: formatIntakeEmailBody(payload)
    });

    if (error) {
      console.error("Resend intake error:", error);
    }
  }

  if (!apiKey && !crm.ok) {
    return NextResponse.json(
      {
        error:
          "Intake form is not configured yet. Email support@illuminairy.com directly."
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    qualified: !disqualified,
    leadId: crm.ok ? crm.leadId : undefined
  });
}
