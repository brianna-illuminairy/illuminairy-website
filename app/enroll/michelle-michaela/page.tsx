import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardEnrollPage } from "@/components/standard-enroll/standard-enroll-page";
import { getStandardEnrollLead } from "@/lib/standard-enroll";
import { initStandardEnrollCheckout } from "@/lib/standard-enroll-server";

const SLUG = "michelle-michaela";

export const metadata: Metadata = {
  title: "Michaela's enrollment | Illuminairy",
  description:
    "Personalized enrollment for Michelle and Michaela after their June 13 Strategy Call. $249 diagnostic, $99/week tutoring with the first week free.",
  robots: { index: false, follow: false }
};

// Always render fresh — we mint a new Stripe PaymentIntent on each request
// so the form mounts with a live clientSecret instead of a cached/expired one.
export const dynamic = "force-dynamic";

export default async function MichelleMichaelaEnrollPage() {
  const lead = getStandardEnrollLead(SLUG);
  if (!lead) notFound();
  const init = await initStandardEnrollCheckout(lead);
  return <StandardEnrollPage lead={lead} init={init} />;
}
