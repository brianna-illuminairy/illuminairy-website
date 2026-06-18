import type { Metadata } from "next";
import { SkyePortalAnalytics } from "@/components/skye/portal-analytics";
import "../aurora-brand.css";
import "../aurora-components.css";
import "./skye-portal.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skye's SAT Portal",
  description:
    "Private Illuminairy student portal for Skye's pre-diagnostic lesson and Skill Diagnostic.",
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
