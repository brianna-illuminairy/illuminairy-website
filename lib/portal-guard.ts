import { redirect } from "next/navigation";
import { auth, isNextAuthConfigured } from "@/lib/auth";
import { getPortalSession, isPortalAuthenticated } from "@/lib/portal-auth";

export async function requirePortalAuth(nextPath: string) {
  const portalSession = await getPortalSession();
  if (portalSession) {
    return { authed: true as const, email: portalSession.email, leadId: portalSession.leadId };
  }

  if (isNextAuthConfigured()) {
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase();
    if (email) {
      return { authed: true as const, email, leadId: null };
    }
  }

  redirect(`/portal/login?next=${encodeURIComponent(nextPath)}`);
}

export async function isAnyPortalAuthed(): Promise<boolean> {
  if (await isPortalAuthenticated()) return true;
  if (!isNextAuthConfigured()) return false;
  const session = await auth();
  return Boolean(session?.user?.email);
}
