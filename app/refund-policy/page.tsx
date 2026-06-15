import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description:
    "Illuminairy refund, cancellation, and rescheduling policy for SAT diagnostics, tutoring, and related programs."
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Refund and Cancellation Policy"
        text="This policy governs the Skill Diagnostic, weekly SAT tutoring, rescheduling, cancellations, and how billing and program access work after enrollment."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-12">
          <p>Effective date: June 15, 2026</p>

          <h2>1. Educational services</h2>
          <p>
            Illuminairy (&ldquo;Illuminairy,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides
            SAT preparation, including the Skill Diagnostic, personalized SAT
            improvement plans, weekly tutoring, mentorship, and related learning
            programs. Payments reserve instructional time, tutor availability,
            and program access. By enrolling and submitting payment, the
            customer (&ldquo;Customer&rdquo;) agrees to the terms below.
          </p>

          <h2>2. Skill Diagnostic and personalized plan</h2>
          <p>
            The Skill Diagnostic, the analysis of diagnostic results, and the
            personalized improvement plan and first lessons developed from those
            results are non-refundable once any of the following has occurred,
            in whole or in part: the proctored Skill Diagnostic session has
            been delivered; the diagnostic analysis has been performed; or the
            personalized plan or initial lessons have been authored or
            delivered to the Customer. Customers who have paid for the Skill
            Diagnostic but have not yet had any of the foregoing performed may
            request a refund prior to the scheduled diagnostic session.
          </p>

          <h2>3. Weekly tutoring billing</h2>
          <p>
            Weekly tutoring is billed in advance on a recurring weekly basis at
            the rate disclosed at checkout. Each weekly charge is processed
            for, and entitles the Customer to, two (2) tutoring sessions
            during the seven (7) calendar days immediately following the date
            of that charge (the &ldquo;billing week&rdquo;), subject to tutor availability.
            By way of example, if the Customer enrolls and pays the Skill
            Diagnostic fee on day 0, the first weekly charge is processed on
            day 7 and covers the two sessions scheduled to occur during days 7
            through 14. The next weekly charge is processed on day 14 and
            covers the two sessions scheduled to occur during days 14 through
            21, and so forth. Sessions are non-transferable across billing
            weeks except as expressly permitted in Section 5.
          </p>

          <h2>4. Cancellation of weekly tutoring</h2>
          <p>
            The Customer may cancel weekly tutoring at any time by submitting a
            cancellation request to {site.supportEmail} prior to the next
            scheduled weekly billing date. Cancellation will stop all future
            weekly charges. Cancellation does not entitle the Customer to a
            refund of any prior weekly charge already billed, and any sessions
            in the then-current billing week that have not yet been used will
            be forfeited as of the cancellation effective date. There is no
            fixed contract length and no early-termination fee.
          </p>

          <h2>5. Rescheduling and missed sessions</h2>
          <p>
            Sessions may be rescheduled at no additional charge provided the
            Customer or student gives Illuminairy at least twenty-four (24)
            hours&apos; notice prior to the originally scheduled session start
            time, subject to tutor availability. Sessions for which less than
            twenty-four (24) hours&apos; notice is provided, sessions for which
            the student fails to appear (a &ldquo;no-show&rdquo;), and sessions during which
            the student is unable to participate due to causes within the
            Customer&apos;s or student&apos;s control are deemed delivered for purposes
            of this policy and the credit for that session is forfeited. No
            refund or session credit will be issued for forfeited sessions.
          </p>

          <h2>6. No refunds for delivered or forfeited sessions</h2>
          <p>
            No refund will be issued for any tutoring session that has been
            delivered, partially delivered, scheduled and forfeited under
            Section 5, or otherwise made available to the Customer. No refund
            will be issued for unused sessions remaining in a billing week
            following cancellation under Section 4.
          </p>

          <h2>7. Session quality concerns</h2>
          <p>
            If the Customer or student is dissatisfied with the quality of a
            specific tutoring session, the Customer should notify Illuminairy
            in writing at {site.supportEmail} as soon as reasonably possible
            and in any event within seven (7) calendar days of the session.
            Illuminairy may, at its sole discretion and without obligation,
            review session recordings, transcripts, materials, and other
            available records and, where Illuminairy determines a quality issue
            warrants remediation, may provide a complimentary replacement
            session. Determination is made solely by Illuminairy and is not
            subject to appeal. Nothing in this Section 7 entitles the Customer
            to a refund.
          </p>

          <h2>8. No outcome-based refunds</h2>
          <p>
            Illuminairy makes no guarantee of SAT score outcomes, admissions
            outcomes, scholarship results, or other educational results. No
            refund will be issued based on actual or perceived outcomes,
            student effort, student availability, or changes in the
            Customer&apos;s or student&apos;s circumstances after enrollment.
          </p>

          <h2>9. Cancellation by Illuminairy</h2>
          <p>
            If Illuminairy cancels a scheduled session for reasons within its
            reasonable control and is unable to reschedule the session within
            the same billing week, Illuminairy will, at its option, provide a
            replacement session in a subsequent week or issue a credit equal to
            one session of the affected billing week. If Illuminairy
            terminates a Customer&apos;s program access for reasons not caused by
            the Customer&apos;s breach of these terms, Illuminairy will refund any
            prepaid charges covering periods after the termination date.
          </p>

          <h2>10. Chargebacks</h2>
          <p>
            The Customer agrees to contact Illuminairy at {site.supportEmail}
            to resolve any billing concern before initiating a chargeback or
            payment dispute. Initiating a chargeback for a charge governed by
            this policy may, at Illuminairy&apos;s discretion, result in
            suspension or termination of program access pending resolution.
          </p>

          <h2>11. Refund processing</h2>
          <p>
            Where a refund is issued under this policy, refunds are returned
            to the original payment method when possible and may take 5 to 10
            business days to appear depending on the issuing bank or payment
            provider.
          </p>

          <h2>12. How to submit a request</h2>
          <p>
            All refund, cancellation, rescheduling, and quality-review
            requests must be submitted in writing to {site.supportEmail} and
            include the enrolled student name, parent or guardian name,
            program name, and reason for the request. Requests submitted
            through any other channel may not be processed.
          </p>

          <h2>13. Updates to this policy</h2>
          <p>
            Illuminairy may update this policy from time to time. The version
            in effect at the time a charge is processed governs that charge.
            Material updates will be posted on this page with a revised
            effective date.
          </p>
        </div>
      </section>
    </>
  );
}
