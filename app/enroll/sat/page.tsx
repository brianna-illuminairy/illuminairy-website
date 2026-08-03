import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardEnrollPage } from "@/components/standard-enroll/standard-enroll-page";
import { getStandardEnrollLead } from "@/lib/standard-enroll";
import { initStandardEnrollCheckout } from "@/lib/standard-enroll-server";

const SLUG = "sat";

export const metadata: Metadata = {
  title: "SAT Diagnostic & Weekly Tutoring | Illuminairy",
  description:
    "What's included in Illuminairy SAT tutoring. $249 Skill Diagnostic, then $99/week with the first week for setup. Enroll online.",
  robots: { index: true, follow: true }
};

export const dynamic = "force-dynamic";

export default async function SatPublicEnrollPage() {
  const lead = getStandardEnrollLead(SLUG);
  if (!lead) notFound();
  const init = await initStandardEnrollCheckout(lead);
  return <StandardEnrollPage lead={lead} init={init} />;
}
