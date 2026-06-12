import { Cormorant_Garamond, DM_Mono, DM_Sans } from "next/font/google";

/** Display serif from the brand guide — `~/Downloads/illuminairy_brand_guide (1).html`.
 *  300 (light) and 400 (regular) for hero / section titles; italic for emphasis. */
export const enrollDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--enroll-display",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"]
});

export const enrollBody = DM_Sans({
  subsets: ["latin"],
  variable: "--enroll-body",
  display: "swap",
  weight: ["300", "400", "500"]
});

export const enrollMono = DM_Mono({
  subsets: ["latin"],
  variable: "--enroll-mono",
  display: "swap",
  weight: ["300", "400", "500"]
});

export const enrollFontClassName = `${enrollDisplay.variable} ${enrollBody.variable} ${enrollMono.variable}`;
