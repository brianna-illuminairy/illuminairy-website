import type { Metadata } from "next";
import Script from "next/script";
import { CALENDLY_WIDGET_CSS, CALENDLY_WIDGET_JS } from "@/lib/calendly-embed";
import { funnelFontClassName } from "@/lib/funnel-fonts";
import "../quiz-funnel.css";
import "../quiz-globals.css";
import "../funnel-responsive.css";

export const metadata: Metadata = {
  title: "SAT Score Path · Illuminairy",
  description:
    "Find out what's really holding your kid's SAT score back, and what improvement is realistic before their next test.",
  robots: { index: true, follow: true }
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`qf-funnel-root ${funnelFontClassName}`}>
      <link rel="stylesheet" href={CALENDLY_WIDGET_CSS} />
      <Script src={CALENDLY_WIDGET_JS} strategy="afterInteractive" />
      <div className="qf-funnel-column">{children}</div>
    </div>
  );
}
