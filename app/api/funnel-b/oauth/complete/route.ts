import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";
import { OAUTH_EMAIL_COOKIE } from "@/lib/quiz-funnel-b/oauth-constants";

const OAUTH_EMAIL_MAX_AGE_SEC = 300;

const STRIP_FROM_RETURN = new Set([
  "step",
  "oauth_return",
  "oauth_error",
  "oauth_reason",
]);

function cleanedFunnelSearch(incoming: URLSearchParams): URLSearchParams {
  const cleaned = new URLSearchParams();
  incoming.forEach((value, key) => {
    if (STRIP_FROM_RETURN.has(key)) return;
    if (value) cleaned.set(key, value);
  });
  return cleaned;
}

/**
 * Auth.js redirect target after Google/Facebook sign-in.
 * Route handlers may set cookies; Server Components may not (throws → error page).
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase() ?? "";
  const cleaned = cleanedFunnelSearch(request.nextUrl.searchParams);

  if (!email.includes("@")) {
    cleaned.set("oauth_error", "1");
    const target = new URL(planBuilderBStepHref("b-email", cleaned.toString()), request.url);
    return NextResponse.redirect(target);
  }

  cleaned.set("step", "b-zip");
  const target = new URL(planBuilderBStepHref("b-zip", cleaned.toString()), request.url);
  const response = NextResponse.redirect(target);
  response.cookies.set(OAUTH_EMAIL_COOKIE, email, {
    path: "/",
    maxAge: OAUTH_EMAIL_MAX_AGE_SEC,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
