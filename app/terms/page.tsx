import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Illuminairy Terms of Service for programs, enrollment, and website use."
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Terms of Service"
        text="These Terms govern your use of Illuminairy’s website, programs, and consultations."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-12">
          <p>Effective date: May 17, 2026</p>

          <h2>Overview</h2>
          <p>
            These Terms govern your use of Illuminairy’s website, consultations,
            programs, and educational services. Illuminairy is operated by {site.legalName}.
          </p>

          <h2>Educational services</h2>
          <p>
            Illuminairy provides educational programs, including
            structured SAT preparation, mentorship, coaching, diagnostics, study
            support, and related learning programs. Services may be delivered
            through live sessions, private coaching, digital materials, email,
            scheduling tools, and third-party video or communication platforms.
          </p>

          <h2>Students under 18</h2>
          <p>
            For students under 18, a parent or legal guardian must approve
            enrollment, payment, scheduling, and participation. By enrolling a
            minor student, the parent or guardian agrees to these Terms on the
            student’s behalf.
          </p>

          <h2>Payments and enrollment</h2>
          <p>
            Payments are processed through third-party payment providers such as
            Stripe. Enrollment may require payment before a seat is reserved.
            Program access, schedules, session links, and onboarding details are
            provided after enrollment or consultation approval.
          </p>

          <h2>No guaranteed outcomes</h2>
          <p>
            Illuminairy does not guarantee any specific SAT score, admissions
            result, scholarship outcome, academic result, job outcome, business
            outcome, or professional result. Programs are designed to support
            preparation, learning, accountability, and skill development.
          </p>

          <h2>Participant expectations</h2>
          <p>
            Students are expected to participate respectfully, attend scheduled
            sessions, complete assigned practice where applicable, and avoid
            disruptive conduct. Illuminairy may remove a participant from a
            program for abusive, unsafe, dishonest, or disruptive behavior.
          </p>

          <h2>Intellectual property</h2>
          <p>
            Illuminairy materials, curriculum, worksheets, recordings, website
            content, designs, and program materials are owned by Illuminairy or
            its licensors. Customers may use materials for personal educational
            purposes only and may not copy, resell, publish, or distribute them
            without permission.
          </p>

          <h2>Refunds and cancellations</h2>
          <p>
            Refunds and cancellations are governed by the Refund and
            Cancellation Policy. If there is a conflict between these Terms and
            that policy, the Refund and Cancellation Policy controls for
            payment-related issues.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Illuminairy’s services are
            provided “as is” and “as available.” Illuminairy is not liable for
            indirect, incidental, consequential, or punitive damages.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of Georgia, United States.
            Contact {site.supportEmail} with questions.
          </p>
        </div>
      </section>
    </>
  );
}
