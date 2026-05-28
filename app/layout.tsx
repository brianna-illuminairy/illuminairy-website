import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk, DM_Mono } from "next/font/google";
import { LayoutChrome } from "@/components/layout-chrome";
import { GoogleAnalytics } from "@/components/google-analytics";
import { KlaviyoScript } from "@/components/klaviyo";
import { AttributionProvider } from "@/components/attribution-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { MetaPixel } from "@/components/meta-pixel";
import { site } from "@/lib/site";
import "./globals.css";

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
  metadataBase: new URL(site.url),
  title: {
    default: "Illuminairy — SAT Prep for Ambitious Families",
    template: "%s · Illuminairy"
  },
  description:
    "Find out what's holding your kid's SAT score back and build a personalized plan before their next test.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Illuminairy — SAT Prep for Ambitious Families",
    description:
      "Free diagnostic for parents. Realistic score improvement plans before the next SAT.",
    url: site.url,
    siteName: "Illuminairy",
    images: [
      {
        url: "/brand/logo-square.png",
        width: 1200,
        height: 630,
        alt: "Illuminairy"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminairy",
    description: "SAT prep for ambitious families."
  },
  icons: {
    icon: "/brand/logo-square.png",
    apple: "/brand/logo-square.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.supportEmail,
    description: "SAT prep and personalized score improvement plans for ambitious families."
  };

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${schibstedGrotesk.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased" style={{ margin: 0 }}>
        <PostHogProvider>
          <AttributionProvider>
            <LayoutChrome>{children}</LayoutChrome>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <GoogleAnalytics />
            <MetaPixel />
            <KlaviyoScript />
          </AttributionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
