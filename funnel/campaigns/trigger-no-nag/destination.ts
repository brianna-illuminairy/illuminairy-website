import { buildFunnelDestinationUrl } from "@/funnel/lib/campaigns";

export function buildUrl(options: {
  source: "meta" | "google" | "email";
  tone: "aspiration" | "fear";
  fearId?: "nagging" | "no-visibility";
  content?: string;
}) {
  return buildFunnelDestinationUrl({
    campaignId: "trigger-no-nag",
    tone: options.tone,
    fearId: options.fearId ?? "nagging",
    source: options.source,
    content: options.content
  });
}
