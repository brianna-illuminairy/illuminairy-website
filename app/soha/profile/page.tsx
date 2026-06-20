import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaProfileContent } from "@/components/soha/profile-content";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaProfilePage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/profile");

  return (
    <SohaPortalShell>
      <SohaProfileContent />
    </SohaPortalShell>
  );
}
