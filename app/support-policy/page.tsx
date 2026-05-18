import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Support Policy",
  description:
    "Customer support details for Illuminairy virtual educational services."
};

export default function SupportPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Customer Support Policy"
        text="Illuminairy provides customer support for program questions, scheduling, billing, consultations, mentor applications, and service issues."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-12">
          <p>Effective date: May 17, 2026</p>

          <h2>Support scope</h2>
          <p>
            Illuminairy provides customer support for educational services,
            program questions, scheduling, billing, consultations, mentor
            applications, partnership inquiries, and service issues.
          </p>

          <h2>Contact methods</h2>
          <ul>
            <li>Email: {site.supportEmail}</li>
            <li>Business location: {site.location}, United States</li>
          </ul>

          <h2>Response times</h2>
          <p>
            Typical response time is 1-2 business days. Standard support hours
            are Monday-Friday, 9:00 AM-5:00 PM Eastern Time, excluding major
            U.S. holidays.
          </p>

          <h2>Program fulfillment support</h2>
          <p>
            For enrolled programs, Illuminairy provides onboarding details,
            cohort schedule information, session links, and support instructions
            by email. Customers should contact support if they do not receive
            expected onboarding or session information.
          </p>

          <h2>Billing support</h2>
          <p>
            Billing and refund questions should be sent to {site.supportEmail}.
            Refund eligibility is governed by the Refund and Cancellation Policy.
          </p>
        </div>
      </section>
    </>
  );
}
