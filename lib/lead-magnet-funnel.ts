import { PRIMARY_LEAD_MAGNET_SLUG } from "@/lib/primary-lead-magnet";

/** Single conversion CTA for all lead-magnet funnels (no main-site nav). */
export const LEAD_MAGNET_FUNNEL_CTA_LABEL =
  "Book a free SAT parent call (August 2026)";

export function leadMagnetFunnelCtaHref(): string {
  const params = new URLSearchParams({
    source: "lead_magnet",
    magnet: PRIMARY_LEAD_MAGNET_SLUG
  });
  return `/get-started?${params.toString()}`;
}
