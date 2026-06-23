import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";
import { OAUTH_EMAIL_COOKIE } from "@/lib/quiz-funnel-b/oauth-constants";
import {
  isValidOAuthEmail,
  OAUTH_ERROR_PARAM,
  OAUTH_OK_PARAM,
  stripOAuthFunnelParams,
} from "@/lib/quiz-funnel-b/oauth-complete";

export const dynamic = "force-dynamic";

const OAUTH_EMAIL_MAX_AGE_SEC = 300;
const SESSION_READ_ATTEMPTS = 4;
const SESSION_READ_DELAY_MS = 80;

async function readSessionEmail(): Promise<string> {
  for (let attempt = 0; attempt < SESSION_READ_ATTEMPTS; attempt++) {
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase() ?? "";
    if (isValidOAuthEmail(email)) return email;
    if (attempt < SESSION_READ_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, SESSION_READ_DELAY_MS));
    }
  }
  return "";
}

function redirectTo(request: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

/**
 * Auth.js redirect target after Google/Facebook sign-in.
 * Route handlers may set cookies; Server Components may not.
 */
export async function GET(request: NextRequest) {
  try {
    const cleaned = stripOAuthFunnelParams(request.nextUrl.searchParams);
    const email = await readSessionEmail();

    if (!isValidOAuthEmail(email)) {
      cleaned.set(OAUTH_ERROR_PARAM, "1");
      return redirectTo(
        request,
        planBuilderBStepHref("b-email", cleaned.toString())
      );
    }

    cleaned.set("step", "b-zip");
    cleaned.set(OAUTH_OK_PARAM, "1");
    const target = planBuilderBStepHref("b-zip", cleaned.toString());
    const response = redirectTo(request, target);
    response.cookies.set(OAUTH_EMAIL_COOKIE, email, {
      path: "/",
      maxAge: OAUTH_EMAIL_MAX_AGE_SEC,
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("[funnel-b/oauth/complete]", error);
    const cleaned = stripOAuthFunnelParams(request.nextUrl.searchParams);
    cleaned.set("step", "b-email");
    cleaned.set(OAUTH_ERROR_PARAM, "1");
    return redirectTo(
      request,
      planBuilderBStepHref("b-email", cleaned.toString())
    );
  }
}
