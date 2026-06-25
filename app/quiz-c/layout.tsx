import type { Metadata } from "next";
import { FunnelLayoutShell } from "@/components/funnel-sibling/FunnelLayoutShell";
import "../quiz-funnel.css";
import "../quiz-globals.css";
import "../funnel-responsive.css";

export const metadata: Metadata = {
  title: "June SAT Score Review · Illuminairy",
  description:
    "Book a free June SAT Score Review with an SAT expert. Review the score report, see missed skills, and map the fastest path before the next test.",
  robots: { index: false, follow: true },
};

export default function QuizCLayout({ children }: { children: React.ReactNode }) {
  return <FunnelLayoutShell>{children}</FunnelLayoutShell>;
}
