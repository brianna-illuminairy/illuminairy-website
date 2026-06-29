import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyeGettingStartedContent } from "@/components/skye/getting-started-content";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeGettingStartedPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/getting-started");

  return (
    <SkyePortalShell>
      <SkyeGettingStartedContent />
    </SkyePortalShell>
  );
}
