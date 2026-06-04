"use client";

import type { TrustMetroId } from "@/lib/landing/infer-visitor-metro";
import type { TrustBarVariant } from "@/lib/landing/trust-bar-variant";
import { MomReviewsTrustBar } from "./mom-reviews-trust-bar";
import { ScoreTrustBar } from "./score-trust-bar";

type TrustBarProps = {
  variant: TrustBarVariant;
  preferredMetroId?: TrustMetroId | null;
};

export function TrustBar({ variant, preferredMetroId = null }: TrustBarProps) {
  if (variant === "mom_reviews") {
    return <MomReviewsTrustBar />;
  }
  return <ScoreTrustBar preferredMetroId={preferredMetroId} />;
}
