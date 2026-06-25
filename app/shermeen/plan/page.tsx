import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPlanSkillContent } from "@/components/shermeen/plan-skill-content";
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
      <ShermeenPlanSkillContent />
    </ShermeenPortalShell>
  );
}
