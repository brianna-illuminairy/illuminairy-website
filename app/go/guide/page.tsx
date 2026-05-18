import type { Metadata } from "next";
import { MagnetGrowthFunnel } from "@/components/magnet-growth-funnel";
import { resolveMagnetGrowthHero } from "@/funnel/landing/magnets/resolve-hero";
import { resolveMagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import { magnetFunnelLandingPath } from "@/lib/magnet-growth-paths";
import { getLeadMagnet } from "@/lib/lead-magnets";
import { PRIMARY_LEAD_MAGNET_SLUG } from "@/lib/primary-lead-magnet";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const magnet = getLeadMagnet(PRIMARY_LEAD_MAGNET_SLUG)!;
  return {
    title: magnet.seoTitle,
    description: magnet.seoDescription,
    alternates: { canonical: magnetFunnelLandingPath() },
    robots: { index: true, follow: true }
  };
}

export default async function SingleMagnetFunnelPage({ searchParams }: Props) {
  const magnet = getLeadMagnet(PRIMARY_LEAD_MAGNET_SLUG)!;
  const query = await searchParams;
  const context = resolveMagnetFunnelContext(PRIMARY_LEAD_MAGNET_SLUG, query);
  const hero = resolveMagnetGrowthHero(PRIMARY_LEAD_MAGNET_SLUG);

  return <MagnetGrowthFunnel magnet={magnet} hero={hero} context={context} />;
}
