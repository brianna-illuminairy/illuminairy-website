import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { LayoutChrome } from "@/components/layout-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import { MarketingScripts } from "@/components/marketing-scripts";
import { AttributionProvider } from "@/components/attribution-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogLazySessionRecording } from "@/components/posthog-lazy-recording";
import { site } from "@/lib/site";
import "./globals.css";

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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light" as const
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
      className="light"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface text-primary antialiased" style={{ margin: 0 }}>
        <ThemeProvider>
          <AuthSessionProvider>
          <PostHogProvider>
            <AttributionProvider>
              <LayoutChrome>{children}</LayoutChrome>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <MarketingScripts />
            <PostHogLazySessionRecording />
            </AttributionProvider>
          </PostHogProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
