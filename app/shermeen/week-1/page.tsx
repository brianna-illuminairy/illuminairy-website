import { ShermeenWeek1HubContent } from "@/components/shermeen/week1-hub-content";
import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenWeek1Page() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/week-1");

  return (
    <ShermeenPortalShell>
      <ShermeenWeek1HubContent />
    </ShermeenPortalShell>
  );
}
