import type { LeadMagnetSlug } from "@/lib/lead-magnets";

/**
 * The one public lead-magnet funnel — single LP at /go/guide.
 * Change here if the active offer switches (e.g. to a school-specific guide).
 */
export const PRIMARY_LEAD_MAGNET_SLUG =
  "module-2-pacing-check" satisfies LeadMagnetSlug;

export const MAGNET_FUNNEL_LANDING_PATH = "/go/guide";
export const MAGNET_FUNNEL_DOWNLOAD_PATH = "/go/guide/download";
