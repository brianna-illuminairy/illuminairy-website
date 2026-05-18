import type { Metadata } from "next";
import { GuideDownloadClient } from "@/components/guide-download-client";
import { resolveMagnetGrowthHero } from "@/funnel/landing/magnets/resolve-hero";
import { resolveMagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import { magnetFunnelDownloadPath } from "@/lib/magnet-growth-paths";
import { getLeadMagnet } from "@/lib/lead-magnets";
import { PRIMARY_LEAD_MAGNET_SLUG } from "@/lib/primary-lead-magnet";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const magnet = getLeadMagnet(PRIMARY_LEAD_MAGNET_SLUG)!;
  return {
    title: `Download · ${magnet.seoTitle}`,
    alternates: { canonical: magnetFunnelDownloadPath() },
    robots: { index: false, follow: false }
  };
}

export default async function SingleMagnetDownloadPage({ searchParams }: Props) {
  const magnet = getLeadMagnet(PRIMARY_LEAD_MAGNET_SLUG)!;
  const query = await searchParams;
  const context = resolveMagnetFunnelContext(PRIMARY_LEAD_MAGNET_SLUG, query);
  const hero = resolveMagnetGrowthHero(PRIMARY_LEAD_MAGNET_SLUG);

  return (
    <GuideDownloadClient
      slug={PRIMARY_LEAD_MAGNET_SLUG}
      magnet={magnet}
      hero={hero}
      context={context}
    />
  );
}
