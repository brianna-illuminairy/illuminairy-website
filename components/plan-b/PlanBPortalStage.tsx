import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import type { PortalProfile } from "@/lib/portal/load-dashboard";
import { PORTAL_PLANS_INTRO } from "@/lib/portal/portal-product-copy";

const MOCK_PROFILE: PortalProfile = {
  studentName: "Your student",
  studentInitials: "YS",
  parentName: "Parent",
  parentEmail: "parent@example.com",
  fields: [],
};

type Props = {
  children: ReactNode;
  showSuccessBanner?: boolean;
  activeTabId?: string;
};

export function PlanBPortalStage({
  children,
  showSuccessBanner = false,
  activeTabId = "lessons",
}: Props) {
  return (
    <div className="qfb-portal-stage">
      <div className="qfb-portal-stage__backdrop" aria-hidden="true">
        <PortalShell
          profile={MOCK_PROFILE}
          staticChrome
          activeTabId={activeTabId}
          activeSubjectId="sat-math"
        >
          <section className="portal-lesson aurora-hover-card portal-lesson--mock">
            <p className="portal-lesson__date-meta">Upcoming lesson</p>
            <p className="portal-lesson__date-main">Your free SAT lesson</p>
            <span className="portal-lesson__join">Join Lesson</span>
          </section>
          <div className="portal-page-card aurora-hover-card portal-page-card--mock">
            <p>{PORTAL_PLANS_INTRO}</p>
          </div>
        </PortalShell>
      </div>
      <div className="qfb-portal-stage__scrim" aria-hidden="true" />
      {showSuccessBanner ? (
        <div className="qfb-portal-stage__banner" role="status">
          <span className="qfb-portal-stage__banner-icon" aria-hidden="true">
            ✓
          </span>
          <p className="qfb-portal-stage__banner-text">
            You&apos;ve successfully booked your free SAT lesson
          </p>
        </div>
      ) : null}
      <div className="qfb-portal-stage__modal">{children}</div>
    </div>
  );
}
