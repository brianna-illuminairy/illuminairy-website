import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { SkyeWeek2Lesson1Content } from "@/components/skye/week2-lesson1-content";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeWeek2Lesson1Page() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/week-2/lesson-1");

  return (
    <SkyePortalShell>
      <SkyeWeek2Lesson1Content />
    </SkyePortalShell>
  );
}
