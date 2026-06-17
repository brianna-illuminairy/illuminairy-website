import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardEnrollPage } from "@/components/standard-enroll/standard-enroll-page";
import { getStandardEnrollLead } from "@/lib/standard-enroll";
import { initStandardEnrollCheckout } from "@/lib/standard-enroll-server";

const SLUG = "shelly-standard";

export const metadata: Metadata = {
  title: "Standard SAT enrollment | Illuminairy",
  description:
    "Personalized enrollment for Shelly Sood. $249 diagnostic, $99/week tutoring with the first week free.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function ShellyStandardEnrollPage() {
  const lead = getStandardEnrollLead(SLUG);
  if (!lead) notFound();
  const init = await initStandardEnrollCheckout(lead);
  return <StandardEnrollPage lead={lead} init={init} />;
}
