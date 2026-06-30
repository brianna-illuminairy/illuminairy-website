import { SkyeWeek1Lesson2Content } from "@/components/skye/week1-lesson2-content";
import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeWeek1Lesson2Page() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/week-1/lesson-2");

  return (
    <SkyePortalShell>
      <SkyeWeek1Lesson2Content />
    </SkyePortalShell>
  );
}
