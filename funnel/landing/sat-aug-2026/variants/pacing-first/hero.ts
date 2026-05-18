import type { FunnelContext, FunnelHero } from "@/funnel/lib/campaigns";
import { aspirationCopy } from "@/funnel/copy/aspiration";
import { programProofBullets } from "@/funnel/copy/program-proof";

export function pacingFirstHero(_ctx: FunnelContext): FunnelHero {
  return {
    eyebrow: "SAT Accelerator · Digital SAT",
    headline:
      "Practice looked better than test day? Pacing is a skill — we teach it before August 22.",
    subhead:
      "Timed module work, trap-answer discipline, and full-length tests at weeks 3, 6, 9, and 12 — on top of mistake-driven 1:1s.",
    bullets: [...programProofBullets],
    ctaLabel: aspirationCopy.cta,
    secondaryCta: {
      label: "Check score vs GA schools",
      href: "/tools/georgia-list-fit"
    }
  };
}
