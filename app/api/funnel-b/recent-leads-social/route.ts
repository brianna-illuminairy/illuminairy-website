import { NextResponse } from "next/server";
import { loadLabEmailSocialProof } from "@/lib/quiz-funnel-b/recent-leads-social";

export const dynamic = "force-dynamic";

/** Masked parent emails for Plan B email capture social proof (real leads + clients). */
export async function GET() {
  const proof = await loadLabEmailSocialProof();
  return NextResponse.json({
    parentCount: proof.parentCount,
    maskedEmails: proof.maskedEmails,
  });
}
