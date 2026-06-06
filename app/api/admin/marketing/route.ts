import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAnonymousAbandonCount,
  getCampaignRows,
  getFunnelCounts,
  getStepDropoffs
} from "@/lib/marketing/funnel-metrics";
import { rankFunnelLeaks } from "@/lib/marketing/leak-detector";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const [current, previous, steps, campaigns, anonymousAbandon] =
    await Promise.all([
      getFunnelCounts(7),
      getFunnelCounts(14).then(async (twoWeek) => {
        const last7 = await getFunnelCounts(7);
        return {
          lpViews: Math.max(0, twoWeek.lpViews - last7.lpViews),
          ctaClicks: Math.max(0, twoWeek.ctaClicks - last7.ctaClicks),
          quizStarts: Math.max(0, twoWeek.quizStarts - last7.quizStarts),
          leads: Math.max(0, twoWeek.leads - last7.leads),
          books: Math.max(0, twoWeek.books - last7.books)
        };
      }),
      getStepDropoffs(7),
      getCampaignRows(30),
      getAnonymousAbandonCount(7)
    ]);

  const leaks = rankFunnelLeaks(current, previous, steps);

  return NextResponse.json({
    ok: true,
    periodDays: 7,
    funnel: current,
    priorFunnel: previous,
    leaks,
    stepDropoffs: steps,
    campaigns: campaigns.slice(0, 20),
    anonymousAbandon
  });
}
