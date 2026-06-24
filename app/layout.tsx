import type { Metadata } from "next";
import { ColdFunnelProviders } from "@/components/cold-funnel/cold-funnel-providers";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Illuminairy — SAT Prep for Ambitious Families",
    template: "%s · Illuminairy",
  },
  description:
    "Find out what's holding your kid's SAT score back and build a personalized plan before their next test.",
  alternates: {
    canonical: "/",
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
        alt: "Illuminairy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminairy",
    description: "SAT prep for ambitious families.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface text-primary antialiased" style={{ margin: 0 }}>
        <ColdFunnelProviders>{children}</ColdFunnelProviders>
      </body>
    </html>
  );
}
