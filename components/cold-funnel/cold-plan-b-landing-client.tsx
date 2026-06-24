"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LandingPageLazy = dynamic(
  () => import("@/components/landing/landing-page").then((m) => ({ default: m.LandingPage })),
  { ssr: false, loading: () => null }
);

type ColdPlanBLandingClientProps = {
  landingPath: string;
  planBuilderB?: boolean;
};

/** Client hydration for cold Plan B LPs — analytics + interactive CTA after SSR shell. */
export function ColdPlanBLandingClient({ landingPath, planBuilderB }: ColdPlanBLandingClientProps) {
  return (
    <Suspense fallback={null}>
      <LandingPageLazy landingPath={landingPath} planBuilderB={planBuilderB} />
    </Suspense>
  );
}
