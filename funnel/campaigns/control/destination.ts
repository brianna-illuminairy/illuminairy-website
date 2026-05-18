import { buildFunnelDestinationUrl } from "@/funnel/lib/campaigns";
import type { FearId } from "@/funnel/lib/campaigns";

export function buildUrl(options: {
  source: "meta" | "google" | "email";
  tone: "aspiration" | "fear";
  fearId?: FearId;
  content?: string;
}) {
  return buildFunnelDestinationUrl({
    campaignId: "control",
    tone: options.tone,
    fearId: options.fearId,
    source: options.source,
    content: options.content
  });
}
