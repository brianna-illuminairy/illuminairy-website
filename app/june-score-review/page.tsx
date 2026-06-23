import type { Metadata } from "next";
import { Suspense } from "react";
import { ScoreReviewLandingPage } from "@/components/landing/score-review/score-review-landing-page";
import { landingAdFontClassName } from "@/lib/funnel-fonts";
import "../landing/landing-base.css";
import "../landing/landing-brand.css";
import "../landing/landing-overrides.css";
import "../landing/landing-premium.css";
import "../landing/landing-v4.css";
import "../landing/score-review-lp.css";

export const metadata: Metadata = {
  title: "Free June SAT Score Review · Illuminairy",
  description:
    "Early application deadlines are approaching. Free score review with an SAT expert: review your child's score report, see what they keep missing, and map the fastest path before their next test.",
  openGraph: {
    title: "Free June SAT Score Review · Illuminairy",
    description:
      "Review the score report, see missed skills, map the fastest path before the next test. Free · parent only.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: true },
};

export default function JuneScoreReviewPage() {
  return (
    <div className={landingAdFontClassName}>
      <Suspense fallback={null}>
        <ScoreReviewLandingPage />
      </Suspense>
    </div>
  );
}
