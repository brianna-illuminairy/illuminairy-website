import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./funnel.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-satplan-mono"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#b6d4d2"
};

export const metadata: Metadata = {
  title: "SAT plan",
  description:
    "Find out why they're struggling on the SAT, what improvement is realistic, and how to fix it before their next test.",
  robots: { index: false, follow: false }
};

export default function SatPlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`satplan-funnel-root ${hanken.className} ${jetbrains.variable}`}>
      {children}
    </div>
  );
}
