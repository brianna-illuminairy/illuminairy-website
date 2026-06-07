export function register() {
  /* PostHog server client is created per error in lib/posthog-server.ts */
}

export async function onRequestError(
  err: unknown,
  request: {
    path: string;
    method: string;
    headers: { cookie?: string | string[] };
  },
  context: {
    routerKind: string;
    routePath: string;
    routeType: string;
  }
) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { captureServerException, posthogDistinctIdFromCookie } = await import(
    "@/lib/posthog-server"
  );

  const distinctId = posthogDistinctIdFromCookie(request.headers.cookie);
  await captureServerException(err, distinctId, {
    error_source: "nextjs_on_request_error",
    route_path: context.routePath,
    router_kind: context.routerKind,
    route_type: context.routeType,
    request_method: request.method,
    request_path: request.path
  });
}
