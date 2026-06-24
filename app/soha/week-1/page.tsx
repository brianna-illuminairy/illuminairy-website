import { SohaWeek1HubContent } from "@/components/soha/week1-hub-content";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaWeek1Page() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1");

  return (
    <SohaPortalShell>
      <SohaWeek1HubContent />
    </SohaPortalShell>
  );
}
