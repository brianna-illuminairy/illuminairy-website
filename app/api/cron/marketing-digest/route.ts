import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";
import {
  getAnonymousAbandonCount,
  getFunnelCounts,
  getStepDropoffs
} from "@/lib/marketing/funnel-metrics";
import { rankFunnelLeaks } from "@/lib/marketing/leak-detector";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const to =
    process.env.MARKETING_DIGEST_EMAIL?.trim() ??
    process.env.CONTACT_INBOX?.trim() ??
    site.supportEmail;
  const apiKey = process.env.RESEND_API_KEY?.trim();

  const [current, previous, steps, anonymousAbandon] = await Promise.all([
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
    getAnonymousAbandonCount(7)
  ]);

  const leaks = rankFunnelLeaks(current, previous, steps).slice(0, 3);

  const lines = [
    `Illuminairy funnel digest (last 7 days)`,
    ``,
    `LP views: ${current.lpViews}`,
    `CTA clicks: ${current.ctaClicks}`,
    `Quiz starts: ${current.quizStarts}`,
    `Leads: ${current.leads}`,
    `Books: ${current.books}`,
    `Anonymous abandons (step ≥ q3): ${anonymousAbandon}`,
    ``,
    `Top leaks:`,
    ...leaks.map(
      (l, i) =>
        `${i + 1}. ${l.label}${l.ratePct !== null ? ` (${l.ratePct}%)` : ""} — ${l.detail}`
    ),
    ``,
    `Dashboard: https://illuminairy.com/admin/marketing`,
    `PostHog: see growth/posthog-funnel-dashboard.md`
  ];

  const body = lines.join("\n");

  if (!apiKey) {
    console.log("[marketing-digest]\n", body);
    return NextResponse.json({ ok: true, emailed: false, preview: body });
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    `Illuminairy <notifications@${site.url.replace(/^https?:\/\//, "")}>`;

  await resend.emails.send({
    from,
    to: [to],
    subject: `Funnel digest — ${current.leads} leads, ${current.books} books (7d)`,
    text: body
  });

  return NextResponse.json({ ok: true, emailed: true });
}
