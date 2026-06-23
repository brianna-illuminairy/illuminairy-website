import { NextResponse } from "next/server";
import { sendDanielleWeeklyReportEmail } from "@/lib/danielle-weekly-report-email";

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

  let body: {
    parentEmail?: string;
    studentEmail?: string;
    parentFirst?: string;
    week?: "week-1" | "week-2";
    weekLabel?: string;
    reportPath?: string;
  } = {};

  try {
    const raw = await request.text();
    if (raw.trim()) {
      body = JSON.parse(raw) as typeof body;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parentEmail = body.parentEmail?.trim() || process.env.DANIELLE_PARENT_EMAIL?.trim();
  if (!parentEmail) {
    return NextResponse.json(
      { error: "Set parentEmail in the request body or DANIELLE_PARENT_EMAIL." },
      { status: 400 }
    );
  }

  const result = await sendDanielleWeeklyReportEmail({
    parentEmail,
    studentEmail: body.studentEmail?.trim() || process.env.DANIELLE_STUDENT_EMAIL?.trim(),
    parentFirst: body.parentFirst ?? process.env.DANIELLE_PARENT_FIRST?.trim(),
    week: body.week,
    weekLabel: body.weekLabel,
    reportPath: body.reportPath
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json({ ok: true, to: parentEmail });
}
