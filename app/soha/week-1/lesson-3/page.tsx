import { SohaWeek1Lesson3Content } from "@/components/soha/week1-lesson3-content";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaWeek1Lesson3Page() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1/lesson-3");

  return (
    <SohaPortalShell>
      <SohaWeek1Lesson3Content />
    </SohaPortalShell>
  );
}
