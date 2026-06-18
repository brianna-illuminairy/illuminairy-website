import { redirect } from "next/navigation";
import { isSkyeAuthenticated, isSkyeConfigured } from "@/lib/skye-auth";

export async function requireSkyeAuth(nextPath: string) {
  if (!isSkyeConfigured()) {
    return { configured: false as const, authed: false as const };
  }

  const authed = await isSkyeAuthenticated();
  if (!authed) {
    redirect(`/skye/login?next=${encodeURIComponent(nextPath)}`);
  }

  return { configured: true as const, authed: true as const };
}
