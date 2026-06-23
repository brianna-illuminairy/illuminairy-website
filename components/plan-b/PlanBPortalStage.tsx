import type { ReactNode } from "react";
import {
  PortalChromeBottom,
  PortalChromeHeader,
} from "@/components/portal/portal-shell";
import type { PortalProfile } from "@/lib/portal/load-dashboard";

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

      <div className="qfb-portal-stage__top" aria-hidden="true">
        <PortalChromeHeader profile={MOCK_PROFILE} staticChrome activeTabId={activeTabId} />
      </div>

      <div className="qfb-portal-stage__middle">
        <div className="qfb-portal-stage__modal">{children}</div>
      </div>

      <div className="qfb-portal-stage__bottom" aria-hidden="true">
        <PortalChromeBottom activeSubjectId="sat-math" />
      </div>
    </div>
  );
}
