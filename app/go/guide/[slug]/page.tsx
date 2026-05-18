import { redirect } from "next/navigation";
import { magnetFunnelLandingPath } from "@/lib/magnet-growth-paths";

type Props = { params: Promise<{ slug: string }> };

/** Legacy per-slug URLs → single funnel LP */
export default async function LegacyMagnetSlugRedirect(_props: Props) {
  redirect(magnetFunnelLandingPath());
}
