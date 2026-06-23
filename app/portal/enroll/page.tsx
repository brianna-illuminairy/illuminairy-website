import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { StandardEnrollPage } from "@/components/standard-enroll/standard-enroll-page";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";
import { isPortalEnrollUnlocked } from "@/lib/portal/enroll-unlock";
import {
  buildPlanBPortalEnrollLead,
  type PlanBLeadRow,
} from "@/lib/portal/plan-b-enroll-lead";
import { initStandardEnrollCheckout } from "@/lib/standard-enroll-server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { planBRecommendedPackage } from "@/lib/plan-b/membership-pricing";

export const dynamic = "force-dynamic";

export default async function PortalEnrollPage() {
  const session = await requirePortalAuth("/portal/enroll");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  if (
    !isPortalEnrollUnlocked(dashboard.lesson.scheduledStart) &&
    dashboard.enrollTab.locked
  ) {
    redirect("/portal/home");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase || !session.leadId) {
    redirect("/portal/home");
  }

  const { data: leadRow } = await supabase
    .from("leads")
    .select(
      "id, parent_first, parent_last, parent_email, student_first, sat_next_test, regional_discount_code, regional_discount_pct, plan_b_membership_package, booked_call_at"
    )
    .eq("id", session.leadId)
    .maybeSingle();

  if (!leadRow) {
    redirect("/portal/home");
  }

  const pkg = planBRecommendedPackage(leadRow.sat_next_test);
  if (!leadRow.plan_b_membership_package) {
    await supabase
      .from("leads")
      .update({ plan_b_membership_package: pkg, updated_at: new Date().toISOString() })
      .eq("id", session.leadId);
  }

  const enrollLead = buildPlanBPortalEnrollLead(leadRow as PlanBLeadRow);
  const init = await initStandardEnrollCheckout(enrollLead);

  return (
    <PortalShell
      profile={dashboard.profile}
      activeTabId="enroll"
      enrollTab={{ ...dashboard.enrollTab, locked: false }}
    >
      <div className="portal-enroll-wrap">
        <StandardEnrollPage lead={enrollLead} init={init} embedded />
      </div>
    </PortalShell>
  );
}
