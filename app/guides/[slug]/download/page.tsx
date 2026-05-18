import { redirect } from "next/navigation";
import { magnetFunnelDownloadPath } from "@/lib/magnet-growth-paths";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyGuideDownloadRedirect(_props: Props) {
  redirect(magnetFunnelDownloadPath());
}
