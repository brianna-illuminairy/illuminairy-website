import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import "./landing/landing-base.css";
import "./landing/landing-brand.css";
import "./landing/landing-overrides.css";
import "./landing/landing-premium.css";

export const metadata: Metadata = {
  title: "Personalized SAT plan for your child · Illuminairy",
  description:
    "Free ~2-minute assessment for parents. See which skills are costing points, what improvement is realistic, and how a personalized weekly plan works — backed by data from 250,000+ student scores.",
  openGraph: {
    title: "Personalized SAT plan for your child · Illuminairy",
    description:
      "Free assessment for parents. Diagnostic-driven weekly SAT plan with vetted tutors.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized SAT plan for your child · Illuminairy",
    description:
      "Free assessment for parents. Diagnostic-driven weekly SAT plan with vetted tutors."
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
