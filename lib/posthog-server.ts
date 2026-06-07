import { PostHog } from "posthog-node";
import { getPostHogKey } from "@/lib/posthog";

export function posthogDistinctIdFromCookie(
  cookieHeader?: string | string[] | null
): string | undefined {
  if (!cookieHeader) return undefined;
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join("; ")
    : cookieHeader;
  const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);
  if (!match?.[1]) return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as {
      distinct_id?: string;
    };
    return typeof parsed.distinct_id === "string" ? parsed.distinct_id : undefined;
  } catch {
    return undefined;
  }
}

/** Singleton for manual server captures (API routes, scripts). Prefer captureServerException in serverless hooks. */
let posthogServerInstance: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const key = getPostHogKey();
  if (!key) return null;
  if (!posthogServerInstance) {
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    posthogServerInstance = new PostHog(key, {
      host,
      flushAt: 1,
      flushInterval: 0
    });
  }
  return posthogServerInstance;
}

/** One-shot serverless client — flush and shutdown after each capture. */
export async function captureServerException(
  error: unknown,
  distinctId?: string,
  properties?: Record<string, string | number | boolean>
) {
  const key = getPostHogKey();
  if (!key) return;

  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const client = new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0
  });

  try {
    await client.captureExceptionImmediate(error, distinctId, properties);
  } finally {
    await client.shutdown();
  }
}
