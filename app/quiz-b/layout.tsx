import type { Metadata } from "next";
import { FunnelCriticalCss } from "@/components/funnel-sibling/FunnelCriticalCss";
import { DeferredFunnelStylesheet } from "@/components/funnel-sibling/DeferredFunnelStylesheet";
import { FunnelLayoutShell } from "@/components/funnel-sibling/FunnelLayoutShell";
import "../funnel-responsive.css";

export const metadata: Metadata = {
  title: "Free SAT Lesson · Illuminairy",
  description:
    "Plan Builder for parents. Answer a few questions, see what's realistic for their next SAT, and claim a free 1:1 lesson.",
  robots: { index: true, follow: true },
};

export default function QuizBLayout({ children }: { children: React.ReactNode }) {
  return (
    <FunnelLayoutShell
      rootClassName="qfb-lab-root"
      showLegal={false}
      useFunnelFont={false}
      head={
        <>
          <FunnelCriticalCss />
          <DeferredFunnelStylesheet />
        </>
      }
    >
      {children}
    </FunnelLayoutShell>
  );
}
