import type { Metadata } from "next";
import { ColdPlanBLanding } from "@/components/cold-funnel/cold-plan-b-landing";
import { SAT_FREE_LESSON_LP_PATH } from "@/lib/plan-builder-b-routes";

export const metadata: Metadata = {
  title: "Free 1:1 SAT Lesson · Illuminairy",
  description:
    "For parents: claim a free 1:1 SAT lesson. A mentor walks through their personalized weekly plan and the first skills to fix. No payment required.",
  openGraph: {
    title: "Free 1:1 SAT Lesson · Illuminairy",
    description:
      "Free 1:1 lesson with a mentor. Plan walkthrough and first skills to fix. No payment required.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 1:1 SAT Lesson · Illuminairy",
    description: "Claim a free 1:1 SAT lesson. No payment required.",
  },
  robots: { index: false, follow: true },
};

type SatFreeLessonPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Internal QA — same cold LP shell as `/sat-plan-builder`, CTA always → `/plan-b`. */
export default async function SatFreeLessonLandingPage({ searchParams }: SatFreeLessonPageProps) {
  const sp = await searchParams;
  return (
    <ColdPlanBLanding
      searchParams={sp}
      landingPath={SAT_FREE_LESSON_LP_PATH}
      planBuilderB
    />
  );
}
