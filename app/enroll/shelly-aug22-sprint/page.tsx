import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardEnrollPage } from "@/components/standard-enroll/standard-enroll-page";
import { getStandardEnrollLead } from "@/lib/standard-enroll";
import { initStandardEnrollCheckout } from "@/lib/standard-enroll-server";

const SLUG = "shelly-aug22-sprint";

export const metadata: Metadata = {
  title: "August 22 SAT Sprint enrollment | Illuminairy",
  description:
    "August 22 SAT Sprint enrollment for Shelly Sood. Family diagnostic bundle, $175/week tutoring with the first week free.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function ShellyAug22SprintEnrollPage() {
  const lead = getStandardEnrollLead(SLUG);
  if (!lead) notFound();
  const init = await initStandardEnrollCheckout(lead);
  return <StandardEnrollPage lead={lead} init={init} />;
}
