import { ShermeenSatAlgebraContent } from "@/components/shermeen/sat-algebra-content";
import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenSatAlgebraPage() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/sat-algebra");

  return (
    <ShermeenPortalShell>
      <ShermeenSatAlgebraContent />
    </ShermeenPortalShell>
  );
}
