import { redirect } from "next/navigation";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyePreDiagnosticPage() {
  if (!isSkyeConfigured()) {
    redirect("/skye/login");
  }

  await requireSkyeAuth("/skye/diagnostic");
  redirect("/skye/diagnostic");
}
