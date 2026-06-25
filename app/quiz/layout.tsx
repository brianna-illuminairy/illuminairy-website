import type { Metadata } from "next";
import { funnelFontClassName } from "@/lib/funnel-fonts";
import "../quiz-funnel.css";
import "../quiz-globals.css";
import "../funnel-responsive.css";
import { QFFunnelLegal } from "./components/QFFunnelLegal";

export const metadata: Metadata = {
  title: "SAT Improvement Plan · Illuminairy",
  description:
    "Free ~2-minute Plan Builder for parents. Get an SAT Improvement Plan with score projection for what's realistic before their next test. Your child doesn't take a test yet.",
  robots: { index: true, follow: true }
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`qf-funnel-root ${funnelFontClassName}`}>
      <div className="qf-funnel-column">
        <div className="qf-funnel-fill">{children}</div>
        <QFFunnelLegal />
      </div>
    </div>
  );
}
