import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";
import { OAUTH_EMAIL_COOKIE } from "@/lib/quiz-funnel-b/oauth-constants";

const OAUTH_EMAIL_MAX_AGE_SEC = 300;

export function oauthCallbackCookieValue(): string {
  return `${OAUTH_EMAIL_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export async function setOAuthEmailCookie(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_EMAIL_COOKIE, email, {
    path: "/",
    maxAge: OAUTH_EMAIL_MAX_AGE_SEC,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
}

export function readOAuthEmailFromRequestCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): string | null {
  const raw = cookieStore.get(OAUTH_EMAIL_COOKIE)?.value?.trim().toLowerCase() ?? "";
  return raw.includes("@") ? raw : null;
}

function cleanedSearchParams(
  params: Record<string, string | string[] | undefined>
): URLSearchParams {
  const cleaned = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      if (value[0]) cleaned.set(key, value[0]);
      continue;
    }
    if (value !== "") cleaned.set(key, value);
  }
  cleaned.delete("oauth_return");
  cleaned.delete("oauth_error");
  cleaned.delete("oauth_reason");
  return cleaned;
}

/**
 * Auth.js returns here with a session cookie. Resolve email on the server and
 * redirect to the next funnel step (no client polling).
 */
export async function handlePlanBuilderOAuthReturn(
  params: Record<string, string | string[] | undefined>
): Promise<void> {
  if (params.oauth_return !== "1") return;
  const step = typeof params.step === "string" ? params.step : "";
  if (step !== "b-email") return;

  const cleaned = cleanedSearchParams(params);
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase() ?? "";

  if (email.includes("@")) {
    await setOAuthEmailCookie(email);
    cleaned.set("step", "b-zip");
    redirect(planBuilderBStepHref("b-zip", cleaned.toString()));
  }

  cleaned.set("step", "b-email");
  cleaned.set("oauth_error", "1");
  const reason = typeof params.oauth_reason === "string" ? params.oauth_reason : "";
  if (reason) cleaned.set("oauth_reason", reason);
  redirect(planBuilderBStepHref("b-email", cleaned.toString()));
}
