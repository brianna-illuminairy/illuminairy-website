/**
 * Shared `Authorization: Bearer $CRON_SHARED_SECRET` check for `/api/cron/*`
 * routes hit by GitHub Actions cron.
 *
 * GitHub Actions doesn't allow secrets in URLs, so we use a header. The
 * comparison uses `timingSafeEqual` to avoid leaking timing info.
 */

import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export type CronAuthResult =
  | { ok: true; secret: string }
  | { ok: false; status: number; reason: string };

export function authorizeCronRequest(req: NextRequest): CronAuthResult {
  const expected = process.env.CRON_SHARED_SECRET;
  if (!expected) {
    return { ok: false, status: 503, reason: "cron_secret_not_configured" };
  }

  const header = req.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/.exec(header);
  const provided = match?.[1] ?? "";

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, status: 401, reason: "bad_cron_secret" };
  }

  return { ok: true, secret: expected };
}

export function cronErrorResponse(result: { status: number; reason: string }): NextResponse {
  return NextResponse.json({ error: result.reason }, { status: result.status });
}
