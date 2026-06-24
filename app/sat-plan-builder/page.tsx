import type { Metadata } from "next";
import { Ad3HdLandingPage } from "@/components/plan-b/ad3-hd-landing-page";
import { planBuilderBEntryFromSearchParams } from "@/lib/plan-builder-b-routes";

export const metadata: Metadata = {
  title: "Before paying for SAT tutoring · Illuminairy",
  description:
    "See what SAT score is realistic before you pay for tutoring. Free 2-minute plan for parents. No student required.",
  openGraph: {
    title: "Before paying for SAT tutoring · Illuminairy",
    description:
      "See what score is realistic by test day and which skills to focus on first. Free · parent only · about 2 minutes.",
    images: [{ url: "/brand/logo-square.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Before paying for SAT tutoring · Illuminairy",
    description:
      "Realistic score range and what to focus on first. Free · parent only · about 2 minutes.",
  },
  robots: { index: false, follow: true },
};

type SatPlanBuilderPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Ad3 HD only — frozen copy, full SSR, CTA → `/plan-b`. */
export default async function SatPlanBuilderLandingPage({ searchParams }: SatPlanBuilderPageProps) {
  const sp = await searchParams;
  const ctaHref = planBuilderBEntryFromSearchParams(sp);
  return <Ad3HdLandingPage ctaHref={ctaHref} />;
}
