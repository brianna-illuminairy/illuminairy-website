import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LayoutChrome } from "@/components/layout-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { KlaviyoScript } from "@/components/klaviyo";
import { AttributionProvider } from "@/components/attribution-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Illuminairy — Modern Mentorship and Applied Learning",
    template: "%s · Illuminairy"
  },
  description:
    "Illuminairy is a modern mentorship and applied learning company launching first with structured SAT cohorts.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Illuminairy — Modern Mentorship and Applied Learning",
    description:
      "Premium mentor-led learning for ambitious students, professionals, and business owners.",
    url: site.url,
    siteName: "Illuminairy",
    images: [
      {
        url: "/og-image.svg",
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
    description: "Modern mentorship and applied learning."
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg"
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
    description:
      "Modern mentorship and applied learning for ambitious students, professionals, and business owners."
  };

  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface font-sans text-primary antialiased">
        <ThemeProvider>
          <PostHogProvider>
            <AttributionProvider>
              <LayoutChrome>{children}</LayoutChrome>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
              />
              <GoogleAnalytics />
              <KlaviyoScript />
            </AttributionProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
