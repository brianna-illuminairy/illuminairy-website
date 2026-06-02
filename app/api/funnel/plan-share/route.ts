import { NextResponse } from "next/server";
import { createPlanShare, getPlanShare } from "@/lib/crm/plan-shares";
import type { PlanRevealModel } from "@/lib/quiz-funnel/plan-reveal";

type PostBody = {
  plan?: PlanRevealModel;
  studentLabel?: string | null;
  visitorId?: string;
};

function isPlanRevealModel(value: unknown): value is PlanRevealModel {
  if (!value || typeof value !== "object") return false;
  const p = value as PlanRevealModel;
  return (
    typeof p.subhead === "string" &&
    typeof p.projectionVerdict === "string" &&
    Array.isArray(p.topLevers)
  );
}

export async function POST(request: Request) {
  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isPlanRevealModel(body.plan)) {
    return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
  }

  const result = await createPlanShare({
    plan: body.plan,
    studentLabel: body.studentLabel,
    visitorId: body.visitorId
  });

  if (!result.ok) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: isDev ? result.error : "Could not create share link."
      },
      { status: 500 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin;

  return NextResponse.json({
    ok: true,
    shareId: result.id,
    url: `${origin}/quiz/share/${result.id}`
  });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id || !/^[a-f0-9]{12,24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const result = await getPlanShare(id);
  if (!result.ok) {
    const status = result.error === "expired" ? 410 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    payload: result.payload,
    viewCount: result.viewCount
  });
}
