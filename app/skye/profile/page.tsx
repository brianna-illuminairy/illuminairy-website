import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyeProfileContent } from "@/components/skye/profile-content";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeProfilePage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/profile");

  return (
    <SkyePortalShell>
      <SkyeProfileContent />
    </SkyePortalShell>
  );
}
