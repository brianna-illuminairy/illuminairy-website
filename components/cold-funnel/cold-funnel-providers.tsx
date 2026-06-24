"use client";

import type { ReactNode } from "react";
import { AnalyticsReadyProvider } from "@/components/analytics-ready-provider";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { LayoutChrome } from "@/components/layout-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import { MarketingScripts } from "@/components/marketing-scripts";
import { AttributionProvider } from "@/components/attribution-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogLazySessionRecording } from "@/components/posthog-lazy-recording";
import { site } from "@/lib/site";

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.supportEmail,
  description: "SAT prep and personalized score improvement plans for ambitious families.",
};

type ColdFunnelProvidersProps = {
  children: ReactNode;
};

/** Root app shell — stable tree; marketing deferral uses AnalyticsReadyProvider SSOT. */
export function ColdFunnelProviders({ children }: ColdFunnelProvidersProps) {
  return (
    <ThemeProvider>
      <AnalyticsReadyProvider>
        <AuthSessionProvider>
          <PostHogProvider>
            <AttributionProvider>
              <LayoutChrome>{children}</LayoutChrome>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
              />
              <MarketingScripts />
              <PostHogLazySessionRecording />
            </AttributionProvider>
          </PostHogProvider>
        </AuthSessionProvider>
      </AnalyticsReadyProvider>
    </ThemeProvider>
  );
}
