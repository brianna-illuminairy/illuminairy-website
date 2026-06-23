import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import { SAT_PLAN_BUILDER_LP_PATH } from "@/lib/plan-builder-routes";
import "./landing-bundle.css";

export const metadata: Metadata = {
  title: "Free SAT Improvement Plan · Illuminairy",
  description:
    "For parents: SAT in the 1100s or 1200s but colleges expect ~1400? Free 2-minute plan shows why their score is stuck, what's realistic before their fall SAT, and what to study first. No test for your child.",
  openGraph: {
    title: "Free SAT Improvement Plan · Illuminairy",
    description:
      "Why their score is stuck, a realistic fall SAT range, and what to focus on first. Free · parent only · about 2 minutes.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SAT Improvement Plan · Illuminairy",
    description:
      "Why stuck · realistic fall score · what to study first. Free · parent only · about 2 minutes."
  },
  robots: { index: false, follow: true }
};

export default function SatPlanBuilderLandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPage landingPath={SAT_PLAN_BUILDER_LP_PATH} />
    </Suspense>
  );
}
