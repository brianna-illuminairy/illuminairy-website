import type { FunnelContext, FunnelHero } from "@/funnel/lib/campaigns";
import { aspirationCopy } from "@/funnel/copy/aspiration";
import { georgiaProofLine } from "@/funnel/copy/georgia-proof";
import { parentVoiceByFear } from "@/funnel/copy/parent-voice";
import { programProofBullets } from "@/funnel/copy/program-proof";
import { pacingFirstHero } from "@/funnel/landing/sat-aug-2026/variants/pacing-first/hero";
import { controlVariantHero } from "@/funnel/landing/sat-aug-2026/variants/control/hero";

function baseHero(ctx: FunnelContext): FunnelHero {
  if (ctx.variant === "pacing-first") {
    return pacingFirstHero(ctx);
  }
  if (ctx.tone === "fear" && ctx.fearId) {
    const pair = parentVoiceByFear[ctx.fearId];
    return {
      eyebrow: "SAT Accelerator · August 2026",
      headline: pair.fearHook,
      subhead: pair.reliever,
      bullets: [...programProofBullets],
      ctaLabel: aspirationCopy.cta,
      secondaryCta: {
        label: "Check score vs GA schools",
        href: "/tools/georgia-list-fit"
      }
    };
  }

  if (ctx.campaignId === "trigger-may-score") {
    return {
      eyebrow: "SAT Accelerator · August 2026",
      headline:
        "Their whole future is ahead of them — August is where the right SAT score opens doors.",
      subhead: aspirationCopy.defaultSubhead,
      bullets: [...programProofBullets, georgiaProofLine],
      ctaLabel: aspirationCopy.cta,
      secondaryCta: {
        label: "See where their score sits",
        href: "/tools/georgia-list-fit"
      }
    };
  }

  return controlVariantHero(ctx);
}

export function resolveFunnelHero(ctx: FunnelContext): FunnelHero {
  return baseHero(ctx);
}
