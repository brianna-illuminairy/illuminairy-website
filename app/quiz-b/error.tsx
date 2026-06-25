"use client";

import posthog from "posthog-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { planBuilderBEntryFromLanding } from "@/lib/plan-builder-b-routes";
import { getPostHogKey } from "@/lib/posthog";

export default function QuizBFunnelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const resumeHref = useMemo(
    () => planBuilderBEntryFromLanding(search ? `?${search}` : undefined),
    [search]
  );

  useEffect(() => {
    if (!getPostHogKey()) return;
    posthog.captureException(error, {
      error_boundary: "quiz_b_funnel",
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="qf-funnel-root mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="qf-h1 text-xl">Something went wrong</h1>
      <p className="qf-lead mt-3 text-sm">
        Your answers are still saved. Continue your free SAT lesson plan or try this step again.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={resumeHref} className="btn btn-forest">
          Continue your plan
        </Link>
        <button type="button" onClick={() => reset()} className="btn btn-ghost">
          Try again
        </button>
      </div>
      <p className="mt-6 text-xs text-muted">
        If this keeps happening, email support@illuminairy.com.
      </p>
    </div>
  );
}
