import type { Metadata } from "next";
import { Suspense } from "react";
import { GetStartedComplete } from "@/components/get-started-complete";

export const metadata: Metadata = {
  title: "Application Received",
  description: "Your SAT Accelerator application was received.",
  robots: { index: false, follow: false }
};

export default function GetStartedCompletePage() {
  return (
    <Suspense
      fallback={
        <p className="px-5 py-16 text-center text-ink-soft">Loading…</p>
      }
    >
      <GetStartedComplete />
    </Suspense>
  );
}
