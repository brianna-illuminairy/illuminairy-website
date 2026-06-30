import { SohaWeek1Lesson2Content } from "@/components/soha/week1-lesson2-content";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaWeek1Lesson2Page() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1/lesson-2");

  return (
    <SohaPortalShell>
      <SohaWeek1Lesson2Content />
    </SohaPortalShell>
  );
}
