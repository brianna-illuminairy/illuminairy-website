import { redirect } from "next/navigation";
import { isDanielleAuthenticated, isDanielleConfigured } from "@/lib/danielle-auth";

export async function requireDanielleAuth(nextPath: string) {
  if (!isDanielleConfigured()) {
    return { configured: false as const, authed: false as const };
  }

  const authed = await isDanielleAuthenticated();
  if (!authed) {
    redirect(`/danielle/login?next=${encodeURIComponent(nextPath)}`);
  }

  return { configured: true as const, authed: true as const };
}
