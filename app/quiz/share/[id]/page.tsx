import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlanShare } from "@/lib/crm/plan-shares";
import {
  SHARE_PAGE_DISCLAIMER,
  sharePageTitle,
} from "@/lib/quiz-funnel/share-copy";
import { SharePlanView } from "./share-plan-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getPlanShare(id);
  if (!result.ok) {
    return { title: "Plan not found · Illuminairy" };
  }
  const title = sharePageTitle(result.payload.studentLabel);
  return {
    title: `${title} · Illuminairy`,
    description:
      "Starter SAT Improvement Plan with illustrative score projection. Build your own free plan in about 2 minutes.",
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: SHARE_PAGE_DISCLAIMER,
      images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
    }
  };
}

export default async function SharedPlanPage({ params }: Props) {
  const { id } = await params;
  const result = await getPlanShare(id);

  if (!result.ok) {
    if (result.error === "expired") {
      return (
        <main className="qf-page qf-share-page">
          <p className="qf-lead">This shared plan link has expired.</p>
          <a className="btn btn-forest" href="/quiz?step=q-who&utm_source=shared_plan_expired">
            Build your child&apos;s Improvement Plan
          </a>
        </main>
      );
    }
    notFound();
  }

  return <SharePlanView shareId={id} payload={result.payload} />;
}
