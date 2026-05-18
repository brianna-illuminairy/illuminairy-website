import { redirect } from "next/navigation";
import { magnetFunnelLandingPath } from "@/lib/magnet-growth-paths";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyGuideSlugRedirect(_props: Props) {
  redirect(magnetFunnelLandingPath());
}
