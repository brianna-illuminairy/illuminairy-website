import { redirect } from "next/navigation";
import { isShermeenAuthenticated, isShermeenConfigured } from "@/lib/shermeen-auth";

export async function requireShermeenAuth(nextPath: string) {
  if (!isShermeenConfigured()) {
    return { configured: false as const, authed: false as const };
  }

  const authed = await isShermeenAuthenticated();
  if (!authed) {
    redirect(`/shermeen/login?next=${encodeURIComponent(nextPath)}`);
  }

  return { configured: true as const, authed: true as const };
}
