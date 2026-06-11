import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createLeadCall, listLeadCalls } from "@/lib/admin/lead-calls";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const calls = await listLeadCalls({ leadId: id });
  return NextResponse.json({ ok: true, calls });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  let body: {
    call_at?: string;
    duration_minutes?: number | null;
    summary?: string | null;
    transcript?: string | null;
    recording_url?: string | null;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await createLeadCall({
    lead_id: id,
    call_at: body.call_at,
    duration_minutes: body.duration_minutes ?? null,
    summary: body.summary ?? null,
    transcript: body.transcript ?? null,
    recording_url: body.recording_url ?? null
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, call: result.call });
}
