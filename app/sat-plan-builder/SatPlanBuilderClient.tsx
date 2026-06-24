"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing/landing-page";
import { SAT_PLAN_BUILDER_LP_PATH } from "@/lib/plan-builder-routes";

const LandingPageLazy = dynamic(
  () => import("@/components/landing/landing-page").then((m) => ({ default: m.LandingPage })),
  { ssr: false, loading: () => null }
);

export function SatPlanBuilderClient() {
  return (
    <Suspense fallback={null}>
      <LandingPageLazy landingPath={SAT_PLAN_BUILDER_LP_PATH} />
    </Suspense>
  );
}

/** Eager export for tests that need the client module without dynamic wrapper. */
export { LandingPage };
