import type { Metadata } from "next";
import { DaniellePortalAnalytics } from "@/components/danielle/portal-analytics";
import "./danielle-portal.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Danielle's SAT Plan",
  description: "Private Illuminairy student portal for Danielle Danso's SAT plan and diagnostic reports.",
  robots: { index: false, follow: false }
};

export default function DanielleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DaniellePortalAnalytics />
      {children}
    </>
  );
}
