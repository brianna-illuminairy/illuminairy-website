import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  canonicalizeQuizStepId,
  isQuizStepAlias,
} from "@/lib/quiz-funnel/step-aliases";
import {
  isPlanBuilderBookingQaSecretValid,
  PLAN_BUILDER_BOOKING_QA_COOKIE,
  planBuilderBookingGateCookieOptions,
} from "@/lib/quiz-funnel/plan-builder-booking-gate";

function applyPlanBookingQaCookie(response: NextResponse) {
  response.cookies.set(
    PLAN_BUILDER_BOOKING_QA_COOKIE,
    "1",
    planBuilderBookingGateCookieOptions()
  );
  return response;
}

/** Canonicalize legacy `?step=` deep links before client analytics load. */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/plan" && pathname !== "/quiz") {
    return NextResponse.next();
  }

  const qaParam = searchParams.get("plan_booking_qa");
  const qaValid = isPlanBuilderBookingQaSecretValid(qaParam ?? undefined);

  const rawStep = searchParams.get("step");
  const needsStepCanonicalize = Boolean(rawStep && isQuizStepAlias(rawStep));

  if (qaValid) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("plan_booking_qa");
    if (needsStepCanonicalize) {
      url.searchParams.set("step", canonicalizeQuizStepId(rawStep!));
    }
    const changed =
      url.search !== request.nextUrl.search ||
      url.pathname !== request.nextUrl.pathname;
    const response = changed
      ? NextResponse.redirect(url, needsStepCanonicalize && !qaParam ? 308 : 302)
      : NextResponse.next();
    return applyPlanBookingQaCookie(response);
  }

  if (!needsStepCanonicalize) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.searchParams.set("step", canonicalizeQuizStepId(rawStep!));
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/plan", "/quiz"],
};
