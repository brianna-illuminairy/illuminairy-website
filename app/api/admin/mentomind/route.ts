import { NextResponse } from "next/server";
import { createAdminAlert } from "@/lib/admin/alerts";
import { queueIntegrationJob } from "@/lib/integrations/mentomind/jobs";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { enrollmentId?: string; jobType?: string; notes?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const jobType = body.jobType as
    | "create_student"
    | "download_reports"
    | "assign_practice"
    | "sync_progress"
    | undefined;

  if (!jobType) {
    return NextResponse.json({ error: "jobType required." }, { status: 400 });
  }

  const result = await queueIntegrationJob({
    enrollmentId: body.enrollmentId,
    jobType,
    payload: { notes: body.notes ?? null, manual: true }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  void createAdminAlert({
    alertType: "mentomind_job_queued",
    severity: "info",
    title: `MentoMind job queued: ${jobType}`,
    body: body.enrollmentId ? `Enrollment ${body.enrollmentId}` : "Manual queue",
    source: "system",
    notify: false
  });

  return NextResponse.json({ ok: true, jobId: result.jobId });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { listPendingIntegrationJobs } = await import("@/lib/integrations/mentomind/jobs");
  const jobs = await listPendingIntegrationJobs();
  return NextResponse.json({ ok: true, jobs });
}
