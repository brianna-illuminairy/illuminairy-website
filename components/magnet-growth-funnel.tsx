"use client";

import { MagnetFunnelPage } from "@/components/magnet-funnel-page";
import type { MagnetGrowthHero } from "@/funnel/landing/magnets/resolve-hero";
import type { MagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import type { LeadMagnet } from "@/lib/lead-magnets";

export function MagnetGrowthFunnel({
  magnet,
  hero,
  context
}: {
  magnet: LeadMagnet;
  hero: MagnetGrowthHero;
  context: MagnetFunnelContext;
}) {
  return <MagnetFunnelPage magnet={magnet} hero={hero} context={context} mode="landing" />;
}
