import { SohaSatAlgebraContent } from "@/components/soha/sat-algebra-content";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaSatAlgebraPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/sat-algebra");

  return (
    <SohaPortalShell>
      <SohaSatAlgebraContent />
    </SohaPortalShell>
  );
}
