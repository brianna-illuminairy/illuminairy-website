import type { LeadMagnetSlug } from "@/lib/lead-magnets";
import {
  resolveFunnelContext,
  type FunnelContext
} from "@/funnel/lib/campaigns";

export type MagnetFunnelContext = FunnelContext & {
  magnetSlug: LeadMagnetSlug;
};

export function resolveMagnetFunnelContext(
  slug: LeadMagnetSlug,
  searchParams: Record<string, string | string[] | undefined>
): MagnetFunnelContext {
  return {
    ...resolveFunnelContext(searchParams),
    magnetSlug: slug
  };
}
