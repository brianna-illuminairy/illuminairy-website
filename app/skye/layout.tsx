import type { Metadata } from "next";
import { SkyePortalAnalytics } from "@/components/skye/portal-analytics";
import "../aurora-brand.css";
import "../aurora-components.css";
import "../diagnostic-report.css";
import "../design/data-viz/data-viz.css";
import "./skye-portal.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skye's SAT Portal",
  description:
    "Private Illuminairy student portal for Skye's diagnostic analysis and improvement plan.",
  robots: { index: false, follow: false }
};

export default function SkyeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkyePortalAnalytics />
      {children}
    </>
  );
}
