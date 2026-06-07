/** PostHog client config (browser). */

export const POSTHOG_PROXY_PATH = "/ia";

export function getPostHogKey() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_TOKEN ??
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    ""
  );
}

export function getPostHogUiHost() {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (host.includes("eu")) {
    return "https://eu.posthog.com";
  }
  return "https://us.posthog.com";
}

export function getPostHogRegion() {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  return host.includes("eu") ? "eu" : "us";
}
