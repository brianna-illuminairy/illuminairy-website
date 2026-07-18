import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { SkyeSatAlgebraContent } from "@/components/skye/sat-algebra-content";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeSatAlgebraPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/sat-algebra");

  return (
    <SkyePortalShell>
      <SkyeSatAlgebraContent />
    </SkyePortalShell>
  );
}
