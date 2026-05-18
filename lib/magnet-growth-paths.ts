import type { LeadMagnetSlug } from "@/lib/lead-magnets";
import {
  MAGNET_FUNNEL_DOWNLOAD_PATH,
  MAGNET_FUNNEL_LANDING_PATH,
  PRIMARY_LEAD_MAGNET_SLUG
} from "@/lib/primary-lead-magnet";
import { site } from "@/lib/site";

/** Single growth-funnel landing page (not per-slug URLs). */
export function magnetFunnelLandingPath(): string {
  return MAGNET_FUNNEL_LANDING_PATH;
}

export function magnetFunnelDownloadPath(): string {
  return MAGNET_FUNNEL_DOWNLOAD_PATH;
}

/** @deprecated Use magnetFunnelLandingPath — slug kept for Klaviyo/analytics only */
export function magnetGoPath(_slug?: LeadMagnetSlug): string {
  return MAGNET_FUNNEL_LANDING_PATH;
}

/** @deprecated Use magnetFunnelDownloadPath */
export function magnetDownloadPath(_slug?: LeadMagnetSlug): string {
  return MAGNET_FUNNEL_DOWNLOAD_PATH;
}

export function buildMagnetFunnelUrl(options?: {
  campaign?: string;
  tone?: "aspiration" | "fear";
  source?: "meta" | "google" | "email" | "organic";
  content?: string;
}): string {
  const url = new URL(MAGNET_FUNNEL_LANDING_PATH, site.url);
  if (options?.campaign) url.searchParams.set("campaign", options.campaign);
  if (options?.tone) url.searchParams.set("tone", options.tone);
  if (options?.source) {
    url.searchParams.set("utm_source", options.source);
    url.searchParams.set(
      "utm_medium",
      options.source === "google" ? "cpc" : options.source === "organic" ? "organic" : "paid"
    );
    url.searchParams.set("utm_campaign", `sat-magnet-${PRIMARY_LEAD_MAGNET_SLUG}`);
  }
  if (options?.content) url.searchParams.set("utm_content", options.content);
  return url.pathname + url.search;
}
