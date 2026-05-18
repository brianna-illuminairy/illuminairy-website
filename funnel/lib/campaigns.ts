import { site } from "@/lib/site";

export type CampaignId =
  | "control"
  | "trigger-may-score"
  | "trigger-gpa-mismatch"
  | "trigger-no-nag"
  | "trigger-post-finals"
  | "trigger-target-range"
  | "trigger-aug-registered";

export type FunnelTone = "aspiration" | "fear";

export type FearId =
  | "hours-no-payoff"
  | "doors-closing"
  | "started-late"
  | "gpa-mismatch"
  | "nagging"
  | "no-visibility"
  | "wasted-summer"
  | "summer-repeat"
  | "target-range";

export type LandingVariantId = "control" | "pacing-first";

export type FunnelHero = {
  eyebrow: string;
  headline: string;
  subhead: string;
  bullets: string[];
  ctaLabel: string;
  secondaryCta?: { label: string; href: string };
};

export type FunnelContext = {
  campaignId: CampaignId;
  tone: FunnelTone;
  fearId?: FearId;
  variant: LandingVariantId;
  utmCampaign?: string;
  attributionWarning?: boolean;
};

const CAMPAIGN_ALIASES: Record<string, CampaignId> = {
  control: "control",
  "sat-aug26-control": "control",
  "trigger-may-score": "trigger-may-score",
  "sat-aug26-may-score": "trigger-may-score",
  "trigger-gpa-mismatch": "trigger-gpa-mismatch",
  "trigger-no-nag": "trigger-no-nag",
  "trigger-post-finals": "trigger-post-finals",
  "trigger-target-range": "trigger-target-range",
  "trigger-aug-registered": "trigger-aug-registered"
};

const DEFAULT_CONTEXT: FunnelContext = {
  campaignId: "control",
  tone: "aspiration",
  variant: "control"
};

export function resolveCampaignId(raw?: string | null): CampaignId {
  if (!raw) return "control";
  const key = raw.trim().toLowerCase();
  return CAMPAIGN_ALIASES[key] ?? "control";
}

export function resolveLandingVariant(
  raw?: string | null
): LandingVariantId {
  if (raw === "pacing-first") return "pacing-first";
  return "control";
}

export function resolveFunnelContext(
  searchParams: Record<string, string | string[] | undefined>
): FunnelContext {
  const get = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const utmCampaign = get("utm_campaign");
  const campaignParam = get("campaign") ?? utmCampaign;
  const campaignId = resolveCampaignId(campaignParam);
  const variant = resolveLandingVariant(get("v"));

  let tone: FunnelTone =
    get("tone") === "fear" ? "fear" : "aspiration";
  const fearParam = get("fear_id") ?? get("fearId");
  let fearId: FearId | undefined = fearParam as FearId | undefined;

  if (tone === "fear" && !fearId) {
    if (campaignId === "trigger-may-score") fearId = "hours-no-payoff";
    else if (campaignId === "trigger-no-nag") fearId = "nagging";
    else if (campaignId === "trigger-gpa-mismatch") fearId = "gpa-mismatch";
    else fearId = "doors-closing";
  }

  const attributionWarning =
    !campaignParam && !get("utm_source") && !get("tone");

  return {
    campaignId,
    tone,
    fearId,
    variant,
    utmCampaign: utmCampaign ?? undefined,
    attributionWarning
  };
}

export function buildFunnelDestinationUrl(options: {
  campaignId: CampaignId;
  tone: FunnelTone;
  fearId?: FearId;
  variant?: LandingVariantId;
  source: "meta" | "google" | "email";
  content?: string;
  term?: string;
}): string {
  const url = new URL("/go/sat", site.url);
  url.searchParams.set("campaign", options.campaignId);
  url.searchParams.set("tone", options.tone);
  if (options.fearId) url.searchParams.set("fear_id", options.fearId);
  if (options.variant) url.searchParams.set("v", options.variant);
  url.searchParams.set("utm_source", options.source);
  url.searchParams.set(
    "utm_medium",
    options.source === "google" ? "cpc" : "paid"
  );
  url.searchParams.set(
    "utm_campaign",
    `sat-aug26-${options.campaignId}`
  );
  if (options.content) {
    url.searchParams.set("utm_content", options.content);
  }
  if (options.term) {
    url.searchParams.set("utm_term", options.term);
  }
  return url.pathname + url.search;
}
