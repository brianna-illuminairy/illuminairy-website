import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GoogleAnalytics } from "@/components/google-analytics";
import { KlaviyoScript } from "@/components/klaviyo";
import { PostHogProvider } from "@/components/posthog-provider";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Illuminairy — your guiding light for goals and growth",
    template: "%s · Illuminairy"
  },
  description:
    "Better SAT mentors and instructors — diagnostics, six personalized 1:1s, live classes, and practice. Not self-study or à la carte sessions.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Illuminairy — your guiding light for goals and growth",
    description:
      "Named mentors. A clear plan. Weekly progress reports. Georgia Tech-led SAT Accelerator.",
    url: site.url,
    siteName: "Illuminairy",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Illuminairy — premium mentorship and applied learning"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminairy",
    description:
      "Premium mentor-led learning for ambitious students.",
    images: ["/og-image.svg"]
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
    "@type": "EducationalOrganization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.supportEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      addressCountry: "US"
    },
    areaServed: "United States",
    slogan: site.tagline,
    description:
      "Premium mentorship, SAT preparation, and applied learning programs. Launching with Georgia Tech-led SAT instruction."
  };

  return (
    <html lang="en" className={jakarta.variable} data-scroll-behavior="smooth">
      <body className="bg-ivory text-ink antialiased">
        <PostHogProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          <GoogleAnalytics />
          <KlaviyoScript />
        </PostHogProvider>
      </body>
    </html>
  );
}
