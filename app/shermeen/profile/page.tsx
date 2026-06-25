import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenProfileContent } from "@/components/shermeen/profile-content";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenProfilePage() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/profile");

  return (
    <ShermeenPortalShell>
      <ShermeenProfileContent />
    </ShermeenPortalShell>
  );
}
