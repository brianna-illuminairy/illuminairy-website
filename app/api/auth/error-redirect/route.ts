import { NextRequest, NextResponse } from "next/server";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";
import { OAUTH_COMPLETE_PATH } from "@/lib/quiz-funnel-b/oauth-complete";
import { readOAuthReturnPathFromCookieHeader } from "@/lib/oauth-providers";

/** Auth.js error page — send users back to funnel or portal based on where sign-in started. */
export function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const returnPath = readOAuthReturnPathFromCookieHeader(request.headers.get("cookie"));
  const isPlanBReturn = Boolean(
    returnPath?.includes("/plan-b") ||
      returnPath?.includes("b-email") ||
      returnPath?.includes(OAUTH_COMPLETE_PATH)
  );

  const params = new URLSearchParams();
  if (error) params.set("oauth_reason", error);

  if (isPlanBReturn) {
    params.set("oauth_error", "1");
    const target = new URL(
      planBuilderBStepHref("b-email", params.toString()),
      request.url
    );
    const response = NextResponse.redirect(target);
    response.cookies.set("oauth_return_path", "", { path: "/", maxAge: 0 });
    return response;
  }

  if (error) params.set("error", error);
  const target = new URL(`/portal/login?${params.toString()}`, request.url);
  const response = NextResponse.redirect(target);
  response.cookies.set("oauth_return_path", "", { path: "/", maxAge: 0 });
  return response;
}
