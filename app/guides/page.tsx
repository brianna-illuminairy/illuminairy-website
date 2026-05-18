import { redirect } from "next/navigation";
import { magnetFunnelLandingPath } from "@/lib/magnet-growth-paths";

/** Hub retired — one lead magnet LP only */
export default function GuidesHubRedirect() {
  redirect(magnetFunnelLandingPath());
}
