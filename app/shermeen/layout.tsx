import type { Metadata } from "next";
import { ShermeenPortalAnalytics } from "@/components/shermeen/portal-analytics";
import "../aurora-brand.css";
import "../aurora-components.css";
import "../diagnostic-report.css";
import "../design/data-viz/data-viz.css";
import "./shermeen-portal.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shermeen's SAT Portal",
  description:
    "Private Illuminairy student portal for Shermeen Sohail's diagnostic analysis.",
  robots: { index: false, follow: false }
};

export default function ShermeenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShermeenPortalAnalytics />
      {children}
    </>
  );
}
