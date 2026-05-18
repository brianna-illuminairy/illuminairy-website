import type { FunnelContext, FunnelHero } from "@/funnel/lib/campaigns";
import { aspirationCopy } from "@/funnel/copy/aspiration";
import { programProofBullets } from "@/funnel/copy/program-proof";

export function controlVariantHero(_ctx: FunnelContext): FunnelHero {
  return {
    eyebrow: "SAT Accelerator · Georgia",
    headline:
      "Georgia Tech mentors (1450+). Twelve weeks. A plan you can see every week.",
    subhead: aspirationCopy.defaultSubhead,
    bullets: [...programProofBullets],
    ctaLabel: aspirationCopy.cta,
    secondaryCta: {
      label: "Free list fit check",
      href: "/tools/georgia-list-fit"
    }
  };
}
