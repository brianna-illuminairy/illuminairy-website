import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Illuminairy | Modern Mentorship and Applied Learning",
    template: "%s | Illuminairy"
  },
  description:
    "Illuminairy is a premium education and mentorship company launching with a Georgia Tech-led SAT Accelerator and expanding into applied learning.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Illuminairy",
    description:
      "Modern mentorship and applied learning for ambitious students and professionals.",
    url: site.url,
    siteName: "Illuminairy",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Illuminairy brand card"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminairy",
    description:
      "Modern mentorship and applied learning for ambitious students and professionals.",
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
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Evans",
      addressRegion: "GA",
      addressCountry: "US"
    },
    areaServed: "United States",
    description:
      "Premium virtual educational services, mentorship, SAT preparation, and applied learning programs."
  };

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
