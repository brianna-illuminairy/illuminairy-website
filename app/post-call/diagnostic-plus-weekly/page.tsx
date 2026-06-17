import type { Metadata } from "next";
import { PostCallSalesPage } from "@/components/post-call-sales/post-call-sales-page";

export const metadata: Metadata = {
  title: "Start Diagnostic + Weekly Tutoring | Illuminairy",
  description:
    "Post-call next step. Reserve the Skill Diagnostic and start the weekly tutoring baseline.",
  robots: { index: false, follow: false }
};

export default function PostCallDiagnosticPlusWeeklyPage() {
  return <PostCallSalesPage pageType="diagnostic_plus_weekly" />;
}
