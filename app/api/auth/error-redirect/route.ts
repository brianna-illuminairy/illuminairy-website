import { NextRequest, NextResponse } from "next/server";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";

/** Auth.js error page target — path only so Auth.js can append ?error= safely. */
export function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const params = new URLSearchParams({ oauth_error: "1" });
  if (error) params.set("oauth_reason", error);

  const target = new URL(planBuilderBStepHref("b-email", params.toString()), request.url);
  return NextResponse.redirect(target);
}
