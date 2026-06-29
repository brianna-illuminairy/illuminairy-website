import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { SkyeWeek1Lesson1Content } from "@/components/skye/week1-lesson1-content";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeWeek1Lesson1Page() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/week-1/lesson-1");

  return (
    <SkyePortalShell>
      <SkyeWeek1Lesson1Content />
    </SkyePortalShell>
  );
}
