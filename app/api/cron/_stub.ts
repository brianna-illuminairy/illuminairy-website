/**
 * Shared stub for cron routes whose full implementation lands in a later
 * phase. Returns 200 with `{ ok: true, status: "not_implemented", route }` so
 * the GitHub Actions workflow doesn't fail-fast before Phases 3-10 are done.
 *
 * Each phase replaces its stub route with the real implementation.
 */

import { NextResponse, type NextRequest } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";

export function makeStubHandler(route: string) {
  async function handler(req: NextRequest) {
    const auth = authorizeCronRequest(req);
    if (!auth.ok) {
      return cronErrorResponse(auth);
    }
    return NextResponse.json({ ok: true, status: "not_implemented", route });
  }
  return handler;
}
