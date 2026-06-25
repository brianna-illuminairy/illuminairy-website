import type { Metadata } from "next";
import { FunnelLayoutShell } from "@/components/funnel-sibling/FunnelLayoutShell";
import "../quiz-funnel.css";
import "../quiz-globals.css";
import "../funnel-responsive.css";

export const metadata: Metadata = {
  title: "SAT Improvement Plan · Illuminairy",
  description:
    "Free ~2-minute Plan Builder for parents. Get an SAT Improvement Plan with score projection for what's realistic before their next test. Your child doesn't take a test yet.",
  robots: { index: true, follow: true },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <FunnelLayoutShell>{children}</FunnelLayoutShell>;
}
