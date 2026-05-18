import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description:
    "Illuminairy refund and cancellation policy for SAT Accelerator and other program enrollment."
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Refund and Cancellation Policy"
        text="This policy explains refund eligibility, missed sessions, cancellations, and how program access works after you enroll."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-12">
          <p>Effective date: May 17, 2026</p>

          <h2>Educational services</h2>
          <p>
            Illuminairy provides SAT preparation, private coaching,
            diagnostics, mentorship, and related learning programs. Payments
            reserve instructional time, class seats, mentor availability, and
            program access.
          </p>

          <h2>Refund window</h2>
          <p>
            For the SAT Accelerator, customers may request a full refund up
            to 7 days before the program start date. Cancellations made less
            than 7 days before the program start date but before the first live
            session may be eligible for a 50% refund.
          </p>

          <h2>After program access begins</h2>
          <p>
            After the first live session or once program access has begun,
            payments are generally non-refundable. This helps protect reserved
            class seats, mentor time, and instructional capacity.
          </p>

          <h2>Missed sessions</h2>
          <p>
            Missed small-group sessions are not refunded. Private 1:1 sessions
            may be rescheduled with at least 24 hours’ notice, subject to mentor
            availability. Missed private sessions without timely notice may be
            forfeited.
          </p>

          <h2>No outcome-based refunds</h2>
          <p>
            Illuminairy does not provide refunds based on SAT score outcomes,
            admissions outcomes, scholarship results, or changes in student
            effort or availability after the program begins.
          </p>

          <h2>Program cancellation by Illuminairy</h2>
          <p>
            If Illuminairy cancels a program before it begins, customers will
            receive a refund or the option to transfer to another available
            program.
          </p>

          <h2>Processing time</h2>
          <p>
            Refunds are returned to the original payment method when possible
            and may take 5-10 business days depending on the bank or payment
            provider.
          </p>

          <h2>How to request a refund</h2>
          <p>
            Send refund requests to {site.supportEmail}. Include the enrolled
            student name, parent or guardian name, program name, and reason for
            the request.
          </p>
        </div>
      </section>
    </>
  );
}
