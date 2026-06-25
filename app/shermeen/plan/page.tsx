import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPlanOverviewContent } from "@/components/shermeen/plan-overview-content";
import { ShermeenPlanScheduleContent } from "@/components/shermeen/plan-schedule-content";
import { ShermeenPlanTailContent } from "@/components/shermeen/plan-tail-content";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenPlanPage() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/plan");

  return (
    <ShermeenPortalShell>
      <div className="aurora-portal__plan-root">
        <div className="wrap">
          <ShermeenPlanOverviewContent />
          <ShermeenPlanScheduleContent />
          <ShermeenPlanTailContent />
        </div>
      </div>
    </ShermeenPortalShell>
  );
}
