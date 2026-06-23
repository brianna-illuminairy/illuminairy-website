import type { Metadata } from "next";
import "../aurora-brand.css";
import "../aurora-components.css";
import "./portal-dashboard.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Illuminairy Parent Portal",
  description: "Private portal for your student's SAT plan, files, and diagnostic results.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
