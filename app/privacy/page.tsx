import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Illuminairy Privacy Policy for website visitors, families, students, and mentors."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Privacy Policy"
        text="This policy explains how Illuminairy collects, uses, and protects information submitted through the website, consultations, forms, and educational services."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-10">
          <p>Effective date: May 17, 2026</p>

          <h2>Overview</h2>
          <p>
            Illuminairy respects your privacy. This policy explains how {site.legalName},
            doing business as Illuminairy, collects and uses information through
            illuminairy.com, consultations, forms, and educational services.
          </p>

          <h2>Information we collect</h2>
          <p>
            We may collect name, email address, phone number, parent or student
            inquiry details, billing-related information, program interest,
            student education goals, mentor application details, and messages
            submitted through forms or email.
          </p>

          <h2>Payment information</h2>
          <p>
            Payment information is processed by third-party providers such as
            Stripe. Illuminairy does not store full card numbers on its own
            systems.
          </p>

          <h2>How we use information</h2>
          <p>
            We use information to respond to inquiries, schedule consultations,
            provide educational services, process payments, support customers,
            evaluate mentor applications, improve programs, prevent fraud, and
            comply with legal obligations.
          </p>

          <h2>Service providers</h2>
          <p>
            We may share information with service providers who help operate the
            business, including payment processors, email providers, scheduling
            tools, form tools, video platforms, website hosts, analytics tools,
            and professional advisors. We do not sell personal information.
          </p>

          <h2>Students and minors</h2>
          <p>
            Illuminairy may provide services to minors with parent or guardian
            involvement. Parents or guardians may contact us to request access,
            correction, or deletion of a student’s information where required by
            law.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable safeguards to protect information, but no system
            is perfectly secure. By using the website or services, you understand
            that information may be processed in the United States.
          </p>

          <h2>Contact</h2>
          <p>
            Contact privacy requests at {site.supportEmail}.
          </p>
        </div>
      </section>
    </>
  );
}
