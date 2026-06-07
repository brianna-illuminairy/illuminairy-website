"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { getPostHogKey } from "@/lib/posthog";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!getPostHogKey()) return;
    posthog.captureException(error, {
      error_boundary: "global",
      digest: error.digest
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-primary antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted">
            Please refresh or try again later.
          </p>
          <button type="button" onClick={() => reset()} className="btn btn-forest mt-6">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
