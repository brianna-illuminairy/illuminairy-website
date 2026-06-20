import type { Metadata } from "next";
import { SohaPortalAnalytics } from "@/components/soha/portal-analytics";
import "../aurora-brand.css";
import "../aurora-components.css";
import "../design/data-viz/data-viz.css";
import "./soha-diagnostic.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Soha's SAT Improvement Plan",
  description:
    "Private Illuminairy student portal for Soha Naveed's SAT Improvement Plan and diagnostic reports.",
  robots: { index: false, follow: false }
};

export default function SohaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SohaPortalAnalytics />
      {children}
    </>
  );
}
