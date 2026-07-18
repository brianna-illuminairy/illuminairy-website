import { DanielleSatAlgebraContent } from "@/components/danielle/sat-algebra-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleSatAlgebraPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/sat-algebra");

  return (
    <DaniellePortalShell>
      <DanielleSatAlgebraContent />
    </DaniellePortalShell>
  );
}
