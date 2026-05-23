import { Suspense } from "react";
import { SatPlanFunnel } from "@/components/sat-plan/sat-plan-funnel";

export default function SatPlanPage() {
  return (
    <Suspense fallback={<div className="satplan-funnel-root min-h-dvh bg-[#b6d4d2]" aria-busy />}>
      <SatPlanFunnel />
    </Suspense>
  );
}
