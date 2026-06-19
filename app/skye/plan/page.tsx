import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePlanSkillContent } from "@/components/skye/plan-skill-content";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyePlanPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/plan");

  return (
    <SkyePortalShell>
      <SkyePlanSkillContent />
    </SkyePortalShell>
  );
}
