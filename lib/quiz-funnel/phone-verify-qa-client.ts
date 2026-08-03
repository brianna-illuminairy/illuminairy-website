"use client";

/**
 * Client: non-prod + `?qa=phone` or `?qa=1` skips SMS OTP for owner testing.
 * Production builds never enable this (server also rejects qaPhoneBypass).
 */
export function isPlanPhoneVerifyQaActive(): boolean {
  if (typeof window === "undefined") return false;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv === "production") return false;
  if (process.env.NODE_ENV === "production" && vercelEnv !== "preview") {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  const qa = params.get("qa");
  return qa === "phone" || qa === "1";
}
