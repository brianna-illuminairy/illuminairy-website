import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";
import { illuminairyFirstMonthOutcomeLine } from "@/lib/site";

export default async function PortalPlanPage() {
  const session = await requirePortalAuth("/portal/plan");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile}>
      <div className="portal-page-card">
        <p>
          Built from your SAT Score Path answers. After the Skill Diagnostic, your mentor narrows
          focus to the skills the diagnostic ranks highest.
        </p>
        <ul style={{ margin: "14px 0 0", paddingLeft: 18, color: "var(--portal-muted)", fontSize: 14, lineHeight: 1.45 }}>
          <li>~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills</li>
          <li>Two live classes and six private 1:1s on a fixed weekly schedule</li>
          <li>Skill Diagnostic in week one to rank what to work first</li>
        </ul>
        <p style={{ marginTop: 12, fontSize: 13 }}>
          {illuminairyFirstMonthOutcomeLine()} Results vary.
        </p>
      </div>
    </PortalShell>
  );
}
