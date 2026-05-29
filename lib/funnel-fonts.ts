import { DM_Mono, DM_Sans, Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";

/** Editorial display serif — medium weight, restrained (replaces Fraunces). */
export const displaySerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"]
});

export const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"]
});

/** Logo v7b wordmark typeface */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500"]
});

export const funnelFontClassName = `${displaySerif.variable} ${schibstedGrotesk.variable} ${dmMono.variable} ${dmSans.variable}`;
