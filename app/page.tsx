import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import "./landing/landing-base.css";
import "./landing/landing-brand.css";
import "./landing/landing-overrides.css";
import "./landing/landing-premium.css";
import "./landing/landing-v4.css";

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
  robots: { index: true, follow: true }
};

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  );
}
