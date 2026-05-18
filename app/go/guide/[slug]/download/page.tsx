import { redirect } from "next/navigation";
import { magnetFunnelDownloadPath } from "@/lib/magnet-growth-paths";

type Props = { params: Promise<{ slug: string }> };

/** Legacy per-slug download → single funnel download */
export default async function LegacyMagnetDownloadRedirect(_props: Props) {
  redirect(magnetFunnelDownloadPath());
}
