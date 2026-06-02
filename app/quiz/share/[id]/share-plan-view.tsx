"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { PlanSharePayload } from "@/lib/crm/plan-shares";
import { PlanRevealContent } from "@/app/quiz/components/PlanRevealContent";
import {
  SHARE_PAGE_CTA,
  SHARE_PAGE_CTA_SUB,
  SHARE_PAGE_DISCLAIMER,
  SHARE_PAGE_INTRO,
  sharePageTitle,
} from "@/lib/quiz-funnel/share-copy";
import { capturePlanShareViewed } from "@/lib/quiz-funnel/analytics";

type Props = {
  shareId: string;
  payload: PlanSharePayload;
};

export function SharePlanView({ shareId, payload }: Props) {
  const { plan, studentLabel } = payload;
  const ctaHref = `/quiz?step=q1&utm_source=shared_plan&utm_medium=referral&utm_content=${encodeURIComponent(shareId)}`;

  useEffect(() => {
    capturePlanShareViewed({ shareId });
  }, [shareId]);

  const title = (
    <h1 className="qf-h1" style={{ marginBottom: 8 }}>
      {sharePageTitle(studentLabel)}
    </h1>
  );

  return (
    <div className="qf-page qf-share-page-wrap">
      <header className="qf-share-page__header">
        <Link href="/" className="qf-share-page__logo">
          Illuminairy
        </Link>
      </header>

      <main className="qf-share-page" style={{ paddingBottom: 32 }}>
        <p className="qf-meta" style={{ color: "var(--qf-forest)", marginBottom: 8 }}>
          Shared Improvement Plan
        </p>
        <p className="qf-lead" style={{ marginTop: 0, marginBottom: 20 }}>
          {SHARE_PAGE_INTRO}
        </p>

        <PlanRevealContent
          plan={plan}
          title={title}
          introNote="Illustrative starter plan. Exact skills unlock after the Skill Diagnostic. Results vary."
        />

        <section className="qf-card qf-share-page__cta" style={{ padding: 20, marginTop: 24 }}>
          <h2 className="qf-h1" style={{ fontSize: 22, marginBottom: 8 }}>
            Want one for your child?
          </h2>
          <p className="qf-lead" style={{ fontSize: 15, marginBottom: 16 }}>
            Answer a few parent questions and get your own SAT Improvement Plan with a free score
            projection, then book a free SAT Strategy Call if it looks right.
          </p>
          <Link href={ctaHref} className="btn btn-forest" style={{ display: "inline-block" }}>
            {SHARE_PAGE_CTA}
          </Link>
          <p className="qf-meta" style={{ margin: "12px 0 0" }}>
            {SHARE_PAGE_CTA_SUB}
          </p>
          <p className="qf-disclaimer" style={{ marginTop: 14 }}>
            {SHARE_PAGE_DISCLAIMER}
          </p>
        </section>
      </main>
    </div>
  );
}
