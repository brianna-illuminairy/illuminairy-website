import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { SkyeWeek4Lesson1Content } from "@/components/skye/week4-lesson1-content";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeWeek4Lesson1Page() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/week-4/lesson-1");

  return (
    <SkyePortalShell>
      <SkyeWeek4Lesson1Content />
    </SkyePortalShell>
  );
}
