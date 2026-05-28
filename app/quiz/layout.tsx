import { Fraunces, Schibsted_Grotesk, DM_Mono } from "next/font/google";
import type { Metadata } from "next";
import { CALENDLY_WIDGET_CSS } from "@/lib/calendly-embed";
import "../quiz-funnel.css";
import "../quiz-globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
  weight: "variable"
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"]
});

export const metadata: Metadata = {
  title: "SAT Quiz · Illuminairy",
  description:
    "Find out what's really holding your kid's SAT score back — and what improvement is realistic before their next test.",
  robots: { index: true, follow: true }
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${schibstedGrotesk.variable} ${dmMono.variable}`}
    >
      <link rel="stylesheet" href={CALENDLY_WIDGET_CSS} />
      {children}
    </div>
  );
}
