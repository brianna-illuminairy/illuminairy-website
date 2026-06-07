"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { getPostHogKey } from "@/lib/posthog";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!getPostHogKey()) return;
    posthog.captureException(error, {
      error_boundary: "route",
      digest: error.digest
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-primary">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        Please try again. If this keeps happening, email support@illuminairy.com.
      </p>
      <button type="button" onClick={() => reset()} className="btn btn-forest mt-6">
        Try again
      </button>
    </div>
  );
}
