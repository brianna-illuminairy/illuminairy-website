import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import "./landing/landing-base.css";
import "./landing/landing-brand.css";
import "./landing/landing-overrides.css";
import "./landing/landing-premium.css";

export const metadata: Metadata = {
  title: "SAT Improvement Plan for your child · Illuminairy",
  description:
    "Free ~2-minute plan builder for parents. Get an SAT Improvement Plan with score projection — which skills to focus on first and what improvement is realistic. Your child doesn't take a test yet.",
  openGraph: {
    title: "SAT Improvement Plan for your child · Illuminairy",
    description:
      "For parents · ~2 minutes · free score projection. Skill Diagnostic and weekly plan follow your Strategy Call.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SAT Improvement Plan for your child · Illuminairy",
    description:
      "For parents · ~2 minutes · free score projection. Skill Diagnostic after your Strategy Call."
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
