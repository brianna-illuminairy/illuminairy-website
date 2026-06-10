import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  canonicalizeQuizStepId,
  isQuizStepAlias,
} from "@/lib/quiz-funnel/step-aliases";

/** Canonicalize legacy `?step=` deep links before client analytics load. */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/plan" && pathname !== "/quiz") {
    return NextResponse.next();
  }

  const rawStep = searchParams.get("step");
  if (!rawStep || !isQuizStepAlias(rawStep)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.searchParams.set("step", canonicalizeQuizStepId(rawStep));
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/plan", "/quiz"],
};
