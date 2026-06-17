import type { Metadata } from "next";
import { SohaPortalAnalytics } from "@/components/soha/portal-analytics";
import "../danielle/danielle-portal.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Soha's SAT Plan",
  description:
    "Private Illuminairy student portal for Soha Naveed's SAT plan and diagnostic reports.",
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
