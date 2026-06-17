import type { Metadata } from "next";
import { PostCallSalesPage } from "@/components/post-call-sales/post-call-sales-page";

export const metadata: Metadata = {
  title: "Book your Skill Diagnostic | Illuminairy",
  description:
    "Post-call next step. Reserve the Skill Diagnostic and finalize weekly cadence after review.",
  robots: { index: false, follow: false }
};

export default function PostCallDiagnosticOnlyPage() {
  return <PostCallSalesPage pageType="diagnostic_only" />;
}
