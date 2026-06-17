import { redirect } from "next/navigation";
import { isSohaAuthenticated, isSohaConfigured } from "@/lib/soha-auth";

export async function requireSohaAuth(nextPath: string) {
  if (!isSohaConfigured()) {
    return { configured: false as const, authed: false as const };
  }

  const authed = await isSohaAuthenticated();
  if (!authed) {
    redirect(`/soha/login?next=${encodeURIComponent(nextPath)}`);
  }

  return { configured: true as const, authed: true as const };
}
