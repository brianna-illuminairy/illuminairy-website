import { PortalShell } from "@/components/portal/portal-shell";
import { PortalLessonCard } from "@/components/portal/portal-lesson-card";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";

export default async function PortalHomePage() {
  const session = await requirePortalAuth("/portal/home");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile} enrollTab={dashboard.enrollTab}>
      <PortalLessonCard lesson={dashboard.lesson} studentName={dashboard.profile.studentName} />
    </PortalShell>
  );
}
