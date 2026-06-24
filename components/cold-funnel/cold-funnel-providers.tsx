"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { LayoutChrome } from "@/components/layout-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import { MarketingScripts } from "@/components/marketing-scripts";
import { AttributionProvider } from "@/components/attribution-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogLazySessionRecording } from "@/components/posthog-lazy-recording";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";
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

/**
 * Cold ad LP + Plan B: skip auth/PostHog/attribution/replay until LCP or first tap.
 * MarketingScripts still mounts but defers GA/Meta internally on these paths.
 */
export function ColdFunnelProviders({ children }: ColdFunnelProvidersProps) {
  const pathname = usePathname();
  const cold = isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrLcp(cold);

  const chrome = <LayoutChrome>{children}</LayoutChrome>;
  const schemaScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
    />
  );

  if (cold && !ready) {
    return (
      <ThemeProvider>
        {chrome}
        {schemaScript}
        <MarketingScripts />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthSessionProvider>
        <PostHogProvider>
          <AttributionProvider>
            {chrome}
            {schemaScript}
            <MarketingScripts />
            <PostHogLazySessionRecording />
          </AttributionProvider>
        </PostHogProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
