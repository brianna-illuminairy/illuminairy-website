import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import { SAT_FREE_LESSON_LP_PATH } from "@/lib/plan-builder-b-routes";
import "../landing/landing-base.css";
import "../landing/landing-brand.css";
import "../landing/landing-overrides.css";
import "../landing/landing-premium.css";
import "../landing/landing-v4.css";

export const metadata: Metadata = {
  title: "Free 1:1 SAT Lesson · Illuminairy",
  description:
    "For parents: claim a free 1:1 SAT lesson. A mentor walks through their personalized weekly plan and the first skills to fix. No payment required.",
  openGraph: {
    title: "Free 1:1 SAT Lesson · Illuminairy",
    description:
      "Free 1:1 lesson with a mentor. Plan walkthrough and first skills to fix. No payment required.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 1:1 SAT Lesson · Illuminairy",
    description: "Claim a free 1:1 SAT lesson. No payment required."
  },
  robots: { index: false, follow: true }
};

/** Plan Builder B lab LP — always routes hero CTA to `/plan-b`. */
export default function SatFreeLessonLandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPage landingPath={SAT_FREE_LESSON_LP_PATH} planBuilderB />
    </Suspense>
  );
}
